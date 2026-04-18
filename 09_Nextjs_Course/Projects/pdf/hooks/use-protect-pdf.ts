'use client';

import { useState, useCallback, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import { encryptPDF } from '@pdfsmaller/pdf-encrypt-lite';

export interface ProtectProgress {
  currentFile: number;
  totalFiles: number;
  currentFileName: string;
  percentage: number;
  status: 'preparing' | 'processing' | 'saving' | 'complete';
}

export interface ProtectResult {
  url: string;
  filename: string;
}

export function useProtectPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [passwords, setPasswords] = useState({ value: '', confirm: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [result, setResult] = useState<ProtectResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProtectProgress | null>(null);

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

  // Load PDF and get page count
  const loadPdfInfo = useCallback(async (pdfFile: File) => {
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
    async (uploadedFile: File) => {
      setError(null);
      setPasswords({ value: '', confirm: '' });
      setIsSuccess(false);
      setResult(null);

      const validation = validatePdfFile(uploadedFile);
      if (!validation.valid) {
        setError(validation.error || 'Invalid file.');
        return;
      }

      try {
        const { pageCount } = await loadPdfInfo(uploadedFile);

        if (pageCount === 0) {
          setError('The PDF file has no pages. Please upload a valid PDF file.');
          return;
        }

        setFile(uploadedFile);
        setPageCount(pageCount);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to load PDF. The file may be corrupted or encrypted.';
        setError(errorMessage);
      }
    },
    [validatePdfFile, loadPdfInfo]
  );

  // Set password
  const setPassword = useCallback((value: string) => {
    setPasswords((prev) => ({ ...prev, value }));
    setError(null);
  }, []);

  // Set confirm password
  const setConfirm = useCallback((value: string) => {
    setPasswords((prev) => ({ ...prev, confirm: value }));
    setError(null);
  }, []);

  // Validate passwords
  const validatePasswords = useCallback((): { valid: boolean; error?: string } => {
    if (passwords.value.length === 0) {
      return { valid: false, error: 'Please enter a password.' };
    }

    if (passwords.value.length < 4) {
      return { valid: false, error: 'Password must be at least 4 characters long.' };
    }

    if (passwords.value !== passwords.confirm) {
      return { valid: false, error: 'Passwords do not match.' };
    }

    return { valid: true };
  }, [passwords]);

  // Handle protect
  const handleProtect = useCallback(async () => {
    if (!file) {
      setError('Please upload a PDF file first.');
      return;
    }

    // Validate passwords
    const validation = validatePasswords();
    if (!validation.valid) {
      setError(validation.error || 'Invalid password.');
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

      // Load PDF and get bytes
      const arrayBuffer = await file.arrayBuffer();
      const pdfBytes = new Uint8Array(arrayBuffer);

      // Update progress: Saving
      setProgress({
        currentFile: 1,
        totalFiles: 1,
        currentFileName: 'protected.pdf',
        percentage: 70,
        status: 'saving',
      });

      // Encrypt PDF with password
      // @pdfsmaller/pdf-encrypt-lite supports RC4 128-bit encryption
      // This is compatible with most PDF viewers
      const encryptedPdfBytes = await encryptPDF(
        pdfBytes,
        passwords.value, // userPassword
        passwords.value // ownerPassword
      );

      // Create blob from encrypted PDF
      const blob = new Blob([encryptedPdfBytes as unknown as BlobPart], {
        type: 'application/pdf',
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      // Create download URL
      const url = URL.createObjectURL(blob);
      const filename = file.name.replace(/\.pdf$/i, '') + '_protected.pdf';

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
      setProgress(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred while protecting the PDF.';
      setError(errorMessage);
      setIsSuccess(false);
      setProgress(null);
    } finally {
      setIsProcessing(false);
    }
  }, [file, passwords, isProcessing, validatePasswords]);

  // Reset everything
  const handleReset = useCallback(() => {
    // Clean up result URL
    if (result) {
      URL.revokeObjectURL(result.url);
    }

    setFile(null);
    setPageCount(0);
    setPasswords({ value: '', confirm: '' });
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
    passwords,
    isProcessing,
    isSuccess,
    result,
    error,
    progress,
    handleUpload,
    setPassword,
    setConfirm,
    handleProtect,
    handleReset,
    formatFileSize,
    validatePasswords,
  };
}
