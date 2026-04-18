'use client';

import { useState, useCallback, useEffect } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { usePdfPassword } from './use-pdf-password';

export interface RotateProgress {
  currentFile: number;
  totalFiles: number;
  currentFileName: string;
  percentage: number;
  status: 'preparing' | 'processing' | 'saving' | 'complete';
}

export interface RotateResult {
  url: string;
  filename: string;
  pageCount: number;
}

export type RotateDirection = 'left' | 'right';

export function useRotatePdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [rotations, setRotations] = useState<Record<number, number>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [result, setResult] = useState<RotateResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<RotateProgress | null>(null);

  // Password handling
  const { checkEncryption, unlockPdf } = usePdfPassword();
  const [passwordPrompt, setPasswordPrompt] = useState<{
    open: boolean;
    file: File | null;
  }>({ open: false, file: null });
  const [passwordError, setPasswordError] = useState<string | null>(null);

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
        return {
          valid: false,
          error: `File "${file.name}" exceeds the maximum size of ${formatFileSize(
            MAX_FILE_SIZE
          )}.`,
        };
      }

      return { valid: true };
    },
    [formatFileSize]
  );

  // Load PDF info
  const loadPdfInfoLocal = useCallback(async (pdfFile: File) => {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();
      return { pageCount };
    } catch (err) {
      throw new Error('Failed to load PDF. The file may be corrupted or encrypted.');
    }
  }, []);

  // Handle file upload
  const handleUpload = useCallback(
    async (uploadedFiles: FileList | File[]) => {
      setError(null);
      const fileArray = Array.from(uploadedFiles);

      if (fileArray.length === 0) {
        setError('Please select at least one PDF file.');
        return;
      }

      // Use first file only
      const selectedFile = fileArray[0];

      // Validate file
      const validation = validatePdfFile(selectedFile);
      if (!validation.valid) {
        setError(validation.error || 'Invalid file.');
        return;
      }

      try {
        // Check if file is encrypted
        const isEncrypted = await checkEncryption(selectedFile);

        if (isEncrypted) {
          // Show password prompt
          setPasswordPrompt({ open: true, file: selectedFile });
          return;
        }

        // Load PDF to get page count
        const { pageCount } = await loadPdfInfoLocal(selectedFile);

        // Validate page count
        if (pageCount === 0) {
          setError('The PDF file has no pages. Please select a valid PDF file.');
          return;
        }

        setFile(selectedFile);
        setPageCount(pageCount);
        setRotations({});
        setIsSuccess(false);
        setResult(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load PDF file.';
        setError(errorMessage);
      }
    },
    [validatePdfFile, loadPdfInfoLocal, checkEncryption]
  );

  // Rotate a single page
  const rotatePage = useCallback((pageIndex: number, direction: RotateDirection) => {
    setRotations((prev) => {
      const currentRotation = prev[pageIndex] || 0;
      const rotationDelta = direction === 'left' ? -90 : 90;
      const newRotation = (currentRotation + rotationDelta + 360) % 360;

      if (newRotation === 0) {
        // Remove from record if back to 0
        const updated = { ...prev };
        delete updated[pageIndex];
        return updated;
      }

      return { ...prev, [pageIndex]: newRotation };
    });
  }, []);

  // Rotate all pages
  const rotateAll = useCallback(
    (direction: RotateDirection) => {
      const rotationDelta = direction === 'left' ? -90 : 90;

      setRotations((prev) => {
        const updated: Record<number, number> = {};

        for (let i = 0; i < pageCount; i++) {
          const currentRotation = prev[i] || 0;
          const newRotation = (currentRotation + rotationDelta + 360) % 360;

          if (newRotation !== 0) {
            updated[i] = newRotation;
          }
        }

        return updated;
      });
    },
    [pageCount]
  );

  // Reset all rotations
  const reset = useCallback(() => {
    setRotations({});
  }, []);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!file) {
      setError('Please upload a PDF file first.');
      return;
    }

    // Prevent multiple simultaneous operations
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      // Progress: Preparing
      setProgress({
        currentFile: 1,
        totalFiles: 1,
        currentFileName: file.name,
        percentage: 10,
        status: 'preparing',
      });

      await new Promise((resolve) => setTimeout(resolve, 300));

      // Load PDF
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // Progress: Processing
      setProgress({
        currentFile: 1,
        totalFiles: 1,
        currentFileName: file.name,
        percentage: 30,
        status: 'processing',
      });

      // Process each page
      for (let i = 0; i < pageCount; i++) {
        const page = pdfDoc.getPage(i);

        // Get existing rotation from the page
        const existingRotation = page.getRotation();
        const existingAngle = existingRotation.angle;

        // Get user-applied rotation (default to 0)
        const userRotation = rotations[i] || 0;

        // Combine rotations
        const totalRotation = (existingAngle + userRotation) % 360;

        // Apply rotation
        page.setRotation(degrees(totalRotation));

        // Update progress
        const progressPercent = 30 + ((i + 1) / pageCount) * 50;
        setProgress({
          currentFile: 1,
          totalFiles: 1,
          currentFileName: file.name,
          percentage: Math.round(progressPercent),
          status: 'processing',
        });
      }

      // Progress: Saving
      setProgress({
        currentFile: 1,
        totalFiles: 1,
        currentFileName: file.name,
        percentage: 90,
        status: 'saving',
      });

      await new Promise((resolve) => setTimeout(resolve, 300));

      // Save PDF
      const pdfBytes = await pdfDoc.save();

      // Create blob and URL
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      // Generate filename
      const originalName = file.name.replace('.pdf', '');
      const filename = `${originalName}_rotated.pdf`;

      // Progress: Complete
      setProgress({
        currentFile: 1,
        totalFiles: 1,
        currentFileName: file.name,
        percentage: 100,
        status: 'complete',
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      setResult({
        url,
        filename,
        pageCount: pdfDoc.getPageCount(),
      });
      setIsSuccess(true);
      setIsProcessing(false);
      setProgress(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to rotate PDF.';
      setError(errorMessage);
      setIsProcessing(false);
      setProgress(null);
    }
  }, [file, pageCount, rotations, isProcessing]);

  // Reset everything
  const handleReset = useCallback(() => {
    // Clean up blob URL
    if (result?.url) {
      URL.revokeObjectURL(result.url);
    }

    setFile(null);
    setPageCount(0);
    setRotations({});
    setIsProcessing(false);
    setIsSuccess(false);
    setResult(null);
    setError(null);
    setProgress(null);
  }, [result]);

  // Handle password submission
  const handlePasswordSubmit = useCallback(
    async (password: string) => {
      if (!passwordPrompt.file) return;

      setPasswordError(null);

      try {
        // Unlock the PDF
        const unlockedFile = await unlockPdf(passwordPrompt.file, password);

        // Load PDF info with unlocked file
        const { pageCount } = await loadPdfInfoLocal(unlockedFile);

        if (pageCount === 0) {
          setError('The PDF file has no pages. Please select a valid PDF file.');
          setPasswordPrompt({ open: false, file: null });
          return;
        }

        setFile(unlockedFile);
        setPageCount(pageCount);
        setRotations({});
        setIsSuccess(false);
        setResult(null);

        setPasswordPrompt({ open: false, file: null });
        setPasswordError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '';
        if (errorMessage === 'INCORRECT_PASSWORD' || errorMessage.includes('password')) {
          setPasswordError('Incorrect password. Please try again.');
        } else {
          setPasswordError('Failed to unlock PDF. Please try again.');
        }
      }
    },
    [passwordPrompt, unlockPdf, loadPdfInfoLocal]
  );

  // Handle password cancel
  const handlePasswordCancel = useCallback(() => {
    setPasswordPrompt({ open: false, file: null });
    setPasswordError(null);
  }, []);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (result?.url) {
        URL.revokeObjectURL(result.url);
      }
    };
  }, [result]);

  return {
    file,
    pageCount,
    rotations,
    isProcessing,
    isSuccess,
    result,
    error,
    progress,
    handleUpload,
    rotatePage,
    rotateAll,
    reset,
    handleSave,
    handleReset,
    formatFileSize,
    // Password handling
    passwordPrompt,
    passwordError,
    handlePasswordSubmit,
    handlePasswordCancel,
  };
}
