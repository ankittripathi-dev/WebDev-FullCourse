'use client';

import { useState, useCallback, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import { usePdfPassword } from './use-pdf-password';

export interface CompressProgress {
  currentFile: number;
  totalFiles: number;
  currentFileName: string;
  percentage: number;
  status: 'preparing' | 'processing' | 'saving' | 'complete';
}

export interface CompressResult {
  url: string;
  filename: string;
  originalSize: number;
  compressedSize: number;
  reductionPercentage: number;
}

export type CompressionLevel = 'extreme' | 'recommended' | 'less';

export function useCompressPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('recommended');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [result, setResult] = useState<CompressResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<CompressProgress | null>(null);

  // Password handling
  const { checkEncryption, unlockPdf, loadPdfWithPassword } = usePdfPassword();
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
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        return { valid: false, error: 'Invalid file type. Only PDF files are allowed.' };
      }

      if (file.size > MAX_FILE_SIZE) {
        const maxSizeStr = formatFileSize(MAX_FILE_SIZE);
        return {
          valid: false,
          error: `File "${file.name}" is too large. Maximum size is ${maxSizeStr}.`,
        };
      }

      if (file.size === 0) {
        return { valid: false, error: `File "${file.name}" is empty.` };
      }

      return { valid: true };
    },
    [formatFileSize]
  );

  // Load PDF and get page count
  const loadPdfInfo = useCallback(async (pdfFile: File) => {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pages = pdf.getPageCount();
      return { pdf, pageCount: pages };
    } catch (err) {
      throw new Error('Failed to load PDF. The file may be corrupted or encrypted.');
    }
  }, []);

  // Get estimated reduction percentage based on compression level
  const getEstimatedReduction = useCallback((level: CompressionLevel): number => {
    switch (level) {
      case 'extreme':
        return 60; // ~60% reduction
      case 'recommended':
        return 40; // ~40% reduction
      case 'less':
        return 20; // ~20% reduction
      default:
        return 40;
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
        const { pageCount } = await loadPdfInfo(selectedFile);

        // Validate page count
        if (pageCount === 0) {
          setError('The PDF file has no pages. Please select a valid PDF file.');
          return;
        }

        setFile(selectedFile);
        setPageCount(pageCount);
        setIsSuccess(false);
        setResult(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load PDF file.';
        setError(errorMessage);
      }
    },
    [validatePdfFile, loadPdfInfo]
  );

  // Handle compress
  const handleCompress = useCallback(async () => {
    if (!file) {
      setError('Please upload a PDF file first.');
      return;
    }

    // Validate page count
    if (pageCount === 0) {
      setError('The PDF file has no pages. Please upload a valid PDF file.');
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
      const originalSize = file.size;

      // Update progress: Preparing
      setProgress({
        currentFile: 0,
        totalFiles: 1,
        currentFileName: file.name,
        percentage: 0,
        status: 'preparing',
      });

      // Show preparing state for 0.5s
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Load source PDF
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);

      // Update progress: Processing
      setProgress({
        currentFile: 0,
        totalFiles: 1,
        currentFileName: file.name,
        percentage: 10,
        status: 'processing',
      });

      await new Promise((resolve) => setTimeout(resolve, 300));

      // Create new PDF for compression
      const compressedPdf = await PDFDocument.create();

      // Copy all pages
      const pageIndices = sourcePdf.getPageIndices();
      const copiedPages = await compressedPdf.copyPages(sourcePdf, pageIndices);
      copiedPages.forEach((page) => compressedPdf.addPage(page));

      // Apply compression based on level
      // pdf-lib's compression options:
      // - useObjectStreams: true for better compression (structure optimization)
      // - addDefaultPage: false (we already added pages)
      const saveOptions: { useObjectStreams: boolean } = {
        useObjectStreams: compressionLevel !== 'less', // Use object streams for extreme and recommended
      };

      // Update progress: Saving
      setProgress({
        currentFile: 1,
        totalFiles: 1,
        currentFileName: 'compressed.pdf',
        percentage: 90,
        status: 'saving',
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      // Save the PDF with compression options
      const pdfBytes = await compressedPdf.save(saveOptions);

      // Create blob and URL
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const compressedSize = blob.size;
      const url = URL.createObjectURL(blob);

      // Calculate actual reduction
      const reductionPercentage = Math.round(
        ((originalSize - compressedSize) / originalSize) * 100
      );

      // Update progress: Complete
      setProgress({
        currentFile: 1,
        totalFiles: 1,
        currentFileName: 'compressed.pdf',
        percentage: 100,
        status: 'complete',
      });

      // Show 100% completion for 1s before transitioning to success
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setResult({
        url,
        filename: 'compressed.pdf',
        originalSize,
        compressedSize,
        reductionPercentage: Math.max(0, reductionPercentage), // Ensure non-negative
      });
      setIsSuccess(true);
      setProgress(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred while compressing the PDF.';
      setError(errorMessage);
      setIsSuccess(false);
      setProgress(null);
    } finally {
      setIsProcessing(false);
    }
  }, [file, pageCount, compressionLevel, isProcessing]);

  // Reset everything (full reset)
  const handleReset = useCallback(() => {
    // Clean up blob URL
    if (result?.url) {
      URL.revokeObjectURL(result.url);
    }

    setFile(null);
    setPageCount(0);
    setCompressionLevel('recommended');
    setIsProcessing(false);
    setIsSuccess(false);
    setResult(null);
    setError(null);
    setProgress(null);
  }, [result]);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (result?.url) {
        URL.revokeObjectURL(result.url);
      }
    };
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
        const { pageCount } = await loadPdfInfo(unlockedFile);

        if (pageCount === 0) {
          setError('The PDF file has no pages. Please upload a valid PDF file.');
          setPasswordPrompt({ open: false, file: null });
          return;
        }

        setFile(unlockedFile);
        setPageCount(pageCount);
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
    [passwordPrompt, unlockPdf, loadPdfInfo]
  );

  // Handle password cancel
  const handlePasswordCancel = useCallback(() => {
    setPasswordPrompt({ open: false, file: null });
    setPasswordError(null);
  }, []);

  return {
    file,
    pageCount,
    compressionLevel,
    isProcessing,
    isSuccess,
    result,
    error,
    progress,
    handleUpload,
    setCompressionLevel,
    handleCompress,
    handleReset,
    formatFileSize,
    getEstimatedReduction,
    // Password handling
    passwordPrompt,
    passwordError,
    handlePasswordSubmit,
    handlePasswordCancel,
  };
}
