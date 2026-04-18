'use client';

import { useState, useCallback, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';

export interface UnlockProgress {
  currentFile: number;
  totalFiles: number;
  currentFileName: string;
  percentage: number;
  status: 'preparing' | 'processing' | 'saving' | 'complete';
}

export interface UnlockResult {
  url: string;
  filename: string;
}

export type UnlockStatus = 'idle' | 'processing' | 'success' | 'error_password';

export function useUnlockPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [password, setPassword] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [status, setStatus] = useState<UnlockStatus>('idle');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [result, setResult] = useState<UnlockResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<UnlockProgress | null>(null);

  // Format file size
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }, []);

  // Maximum file size: 50MB
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  // Validate PDF file
  const validatePdfFile = useCallback(
    (file: File): { valid: boolean; error?: string } => {
      const validTypes = ['application/pdf'];
      const validExtensions = ['.pdf'];

      const hasValidType = validTypes.includes(file.type);
      const hasValidExtension = validExtensions.some((ext) =>
        file.name.toLowerCase().endsWith(ext)
      );

      if (!hasValidType && !hasValidExtension) {
        return {
          valid: false,
          error: `Invalid file type. Only PDF files are allowed.`,
        };
      }

      if (file.size === 0) {
        return { valid: false, error: `File "${file.name}" is empty.` };
      }

      if (file.size > MAX_FILE_SIZE) {
        const maxSizeStr = formatFileSize(MAX_FILE_SIZE);
        return {
          valid: false,
          error: `File "${file.name}" is too large. Maximum size is ${maxSizeStr}.`,
        };
      }

      return { valid: true };
    },
    [formatFileSize]
  );

  // Check if PDF is encrypted
  const checkEncryption = useCallback(async (pdfFile: File): Promise<boolean> => {
    try {
      // Dynamically import pdfjs-dist to avoid SSR issues
      const pdfjsLib = await import('pdfjs-dist');

      // Set worker source for pdfjs-dist
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      }

      const arrayBuffer = await pdfFile.arrayBuffer();
      // Try to load without password using pdfjs-dist
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      // If successful, file is not encrypted
      return false;
    } catch (err) {
      // Check if error is related to encryption
      const errorMessage = err instanceof Error ? err.message.toLowerCase() : '';
      const isEncrypted =
        errorMessage.includes('encrypted') ||
        errorMessage.includes('password') ||
        errorMessage.includes('security handler') ||
        errorMessage.includes('encryption') ||
        errorMessage.includes('needs password');

      return isEncrypted;
    }
  }, []);

  // Load PDF and get page count using pdfjs-dist (supports password)
  const loadPdfWithPassword = useCallback(async (pdfFile: File, providedPassword?: string) => {
    try {
      // Dynamically import pdfjs-dist to avoid SSR issues
      const pdfjsLib = await import('pdfjs-dist');

      // Set worker source for pdfjs-dist
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      }

      const arrayBuffer = await pdfFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        password: providedPassword,
      });

      const pdf = await loadingTask.promise;
      const pageCount = pdf.numPages;

      // Convert to pdf-lib format by rendering pages
      // We'll need to render each page and recreate the PDF
      const pdfDoc = await PDFDocument.create();

      for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.0 });

        // Create canvas to render page
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error('Failed to get canvas context');
        }

        // Render page to canvas
        await page.render({
          canvasContext: context,
          viewport: viewport,
          canvas: canvas,
        }).promise;

        // Convert canvas to image and embed in pdf-lib
        const imageBytes = await new Promise<Uint8Array>((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Failed to create blob'));
              return;
            }
            blob.arrayBuffer().then((buf) => {
              resolve(new Uint8Array(buf));
            });
          }, 'image/png');
        });

        // Add page to PDF
        const pdfPage = pdfDoc.addPage([viewport.width, viewport.height]);
        const image = await pdfDoc.embedPng(imageBytes);
        pdfPage.drawImage(image, {
          x: 0,
          y: 0,
          width: viewport.width,
          height: viewport.height,
        });
      }

      return { pdfDoc, pageCount };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message.toLowerCase() : '';
      if (
        errorMessage.includes('encrypted') ||
        errorMessage.includes('password') ||
        errorMessage.includes('incorrect password') ||
        errorMessage.includes('needs password')
      ) {
        throw new Error('INCORRECT_PASSWORD');
      }
      throw new Error('Failed to load PDF. The file may be corrupted.');
    }
  }, []);

  // Handle file upload
  const handleUpload = useCallback(
    async (uploadedFile: File) => {
      setError(null);
      setPassword('');
      setStatus('idle');
      setIsSuccess(false);
      setResult(null);
      setIsLocked(false);

      const validation = validatePdfFile(uploadedFile);
      if (!validation.valid) {
        setError(validation.error || 'Invalid file.');
        return;
      }

      try {
        // Check if file is encrypted
        const encrypted = await checkEncryption(uploadedFile);

        if (encrypted) {
          setIsLocked(true);
          setStatus('idle');
        } else {
          setIsLocked(false);
          setStatus('idle');
          // If not encrypted, we can still get page count using pdf-lib
          try {
            const arrayBuffer = await uploadedFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pageCount = pdfDoc.getPageCount();
            setPageCount(pageCount);
          } catch {
            // Ignore errors for non-encrypted files
          }
        }

        setFile(uploadedFile);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to check PDF encryption status.';
        setError(errorMessage);
      }
    },
    [validatePdfFile, checkEncryption]
  );

  // Set password
  const setPasswordValue = useCallback(
    (value: string) => {
      setPassword(value);
      setError(null);
      // Clear password error status when user types
      if (status === 'error_password') {
        setStatus('idle');
      }
    },
    [status]
  );

  // Handle unlock
  const handleUnlock = useCallback(async () => {
    if (!file) {
      setError('Please upload a PDF file first.');
      return;
    }

    if (!isLocked) {
      // File is not locked, just download it
      try {
        const arrayBuffer = await file.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const filename = file.name.replace(/\.pdf$/i, '') + '_unlocked.pdf';
        setResult({ url, filename });
        setIsSuccess(true);
        setStatus('success');
      } catch (err) {
        setError('Failed to process PDF file.');
      }
      return;
    }

    if (!password || password.length === 0) {
      setError('Please enter the PDF password.');
      return;
    }

    // Prevent multiple simultaneous operations
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResult(null);
    setStatus('processing');

    try {
      // Update progress: Preparing
      setProgress({
        currentFile: 0,
        totalFiles: 1,
        currentFileName: file.name,
        percentage: 0,
        status: 'preparing',
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update progress: Processing
      setProgress({
        currentFile: 0,
        totalFiles: 1,
        currentFileName: file.name,
        percentage: 30,
        status: 'processing',
      });

      await new Promise((resolve) => setTimeout(resolve, 300));

      // Load PDF with password using pdfjs-dist and convert to pdf-lib
      const { pdfDoc, pageCount } = await loadPdfWithPassword(file, password);
      setPageCount(pageCount);

      // Update progress: Saving
      setProgress({
        currentFile: 1,
        totalFiles: 1,
        currentFileName: 'unlocked.pdf',
        percentage: 70,
        status: 'saving',
      });

      // Save PDF without encryption (pdf-lib saves without encryption by default)
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], {
        type: 'application/pdf',
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      // Create download URL
      const url = URL.createObjectURL(blob);
      const filename = file.name.replace(/\.pdf$/i, '') + '_unlocked.pdf';

      setResult({ url, filename });

      // Update progress: Complete
      setProgress({
        currentFile: 1,
        totalFiles: 1,
        currentFileName: filename,
        percentage: 100,
        status: 'complete',
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSuccess(true);
      setStatus('success');
      setProgress(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '';

      if (errorMessage === 'INCORRECT_PASSWORD' || errorMessage.includes('password')) {
        setStatus('error_password');
        setError('Incorrect password. Please try again.');
      } else {
        setError('An error occurred while unlocking the PDF.');
        setStatus('idle');
      }
      setIsSuccess(false);
      setProgress(null);
    } finally {
      setIsProcessing(false);
    }
  }, [file, isLocked, password, isProcessing]);

  // Reset everything
  const handleReset = useCallback(() => {
    // Clean up result URL
    if (result) {
      URL.revokeObjectURL(result.url);
    }

    setFile(null);
    setPageCount(0);
    setPassword('');
    setIsLocked(false);
    setStatus('idle');
    setIsProcessing(false);
    setIsSuccess(false);
    setResult(null);
    setError(null);
    setProgress(null);
  }, [result]);

  // Cleanup result URL on unmount
  useEffect(() => {
    return () => {
      if (result) {
        URL.revokeObjectURL(result.url);
      }
    };
  }, [result]);

  return {
    file,
    pageCount,
    password,
    isLocked,
    status,
    isProcessing,
    isSuccess,
    result,
    error,
    progress,
    handleUpload,
    setPassword: setPasswordValue,
    handleUnlock,
    handleReset,
    formatFileSize,
  };
}
