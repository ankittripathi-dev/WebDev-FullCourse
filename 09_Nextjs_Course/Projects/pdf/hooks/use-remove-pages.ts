'use client';

import { useState, useCallback, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import { usePdfPassword } from './use-pdf-password';

export interface RemoveProgress {
  currentFile: number;
  totalFiles: number;
  currentFileName: string;
  percentage: number;
  status: 'preparing' | 'processing' | 'saving' | 'complete';
}

export interface RemoveResult {
  url: string;
  filename: string;
  pageCount: number;
}

export function useRemovePages() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pagesToRemove, setPagesToRemove] = useState<Set<number>>(new Set());
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [result, setResult] = useState<RemoveResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<RemoveProgress | null>(null);

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
        setPagesToRemove(new Set());
        setLastClickedIndex(null);
        setIsSuccess(false);
        setResult(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load PDF file.';
        setError(errorMessage);
      }
    },
    [validatePdfFile, loadPdfInfo]
  );

  // Toggle page selection
  const togglePage = useCallback((pageIndex: number) => {
    setPagesToRemove((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(pageIndex)) {
        newSet.delete(pageIndex);
      } else {
        newSet.add(pageIndex);
      }
      return newSet;
    });
    setLastClickedIndex(pageIndex);
  }, []);

  // Handle range input (e.g., "1-3, 5, 7-9")
  const handleRangeInput = useCallback(
    (inputString: string) => {
      const newSet = new Set<number>();
      const trimmed = inputString.trim();

      if (!trimmed) {
        setPagesToRemove(newSet);
        return;
      }

      // Split by comma
      const parts = trimmed.split(',').map((p) => p.trim());

      for (const part of parts) {
        if (part.includes('-')) {
          // Range (e.g., "1-3")
          const [start, end] = part.split('-').map((s) => parseInt(s.trim(), 10));
          if (!isNaN(start) && !isNaN(end) && start >= 1 && end >= start) {
            for (let i = start; i <= end; i++) {
              if (i >= 1 && i <= pageCount) {
                newSet.add(i);
              }
            }
          }
        } else {
          // Single page (e.g., "5")
          const page = parseInt(part, 10);
          if (!isNaN(page) && page >= 1 && page <= pageCount) {
            newSet.add(page);
          }
        }
      }

      setPagesToRemove(newSet);
      setLastClickedIndex(null);
    },
    [pageCount]
  );

  // Handle shift click for range selection
  const handleShiftClick = useCallback(
    (targetIndex: number) => {
      if (lastClickedIndex === null) {
        togglePage(targetIndex);
        return;
      }

      const start = Math.min(lastClickedIndex, targetIndex);
      const end = Math.max(lastClickedIndex, targetIndex);

      setPagesToRemove((prev) => {
        const newSet = new Set(prev);
        for (let i = start; i <= end; i++) {
          newSet.add(i);
        }
        return newSet;
      });
      setLastClickedIndex(targetIndex);
    },
    [lastClickedIndex, togglePage]
  );

  // Convert pagesToRemove Set to string for input
  const getPagesToRemoveString = useCallback((): string => {
    if (pagesToRemove.size === 0) return '';

    const sorted = Array.from(pagesToRemove).sort((a, b) => a - b);
    const ranges: string[] = [];
    let rangeStart = sorted[0];
    let rangeEnd = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === rangeEnd + 1) {
        rangeEnd = sorted[i];
      } else {
        if (rangeStart === rangeEnd) {
          ranges.push(rangeStart.toString());
        } else {
          ranges.push(`${rangeStart}-${rangeEnd}`);
        }
        rangeStart = sorted[i];
        rangeEnd = sorted[i];
      }
    }

    // Add last range
    if (rangeStart === rangeEnd) {
      ranges.push(rangeStart.toString());
    } else {
      ranges.push(`${rangeStart}-${rangeEnd}`);
    }

    return ranges.join(', ');
  }, [pagesToRemove]);

  // Handle remove pages
  const handleRemove = useCallback(async () => {
    if (!file) {
      setError('Please upload a PDF file first.');
      return;
    }

    // Validate page count
    if (pageCount === 0) {
      setError('The PDF file has no pages. Please upload a valid PDF file.');
      return;
    }

    // Validate selection
    if (pagesToRemove.size === 0) {
      setError('Please select at least one page to remove.');
      return;
    }

    if (pagesToRemove.size >= pageCount) {
      setError('Cannot remove all pages. At least one page must remain.');
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

      // Show preparing state for 0.5s
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update progress: Processing
      setProgress({
        currentFile: 0,
        totalFiles: 1,
        currentFileName: file.name,
        percentage: 10,
        status: 'processing',
      });

      // Show processing state for 0.3s
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Load PDF
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);

      // Get pages to keep (1-indexed to 0-indexed conversion)
      const pagesToKeep: number[] = [];
      for (let i = 1; i <= pageCount; i++) {
        if (!pagesToRemove.has(i)) {
          pagesToKeep.push(i - 1); // Convert to 0-indexed
        }
      }

      if (pagesToKeep.length === 0) {
        throw new Error('Cannot create a PDF with no pages.');
      }

      // Create new PDF with only pages to keep
      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(sourcePdf, pagesToKeep);
      copiedPages.forEach((page) => newPdf.addPage(page));

      // Update progress: Saving
      setProgress({
        currentFile: 1,
        totalFiles: 1,
        currentFileName: file.name,
        percentage: 95,
        status: 'saving',
      });

      // Show saving state for 0.5s
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Save the PDF
      const pdfBytes = await newPdf.save();

      // Create blob and URL
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      // Update progress: Complete
      setProgress({
        currentFile: 1,
        totalFiles: 1,
        currentFileName: file.name,
        percentage: 100,
        status: 'complete',
      });

      // Show 100% completion for 1s before transitioning to success
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setResult({
        url,
        filename: 'removed-pages.pdf',
        pageCount: pagesToKeep.length,
      });
      setIsSuccess(true);
      setProgress(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred while removing pages.';
      setError(errorMessage);
      setIsSuccess(false);
      setProgress(null);
    } finally {
      setIsProcessing(false);
    }
  }, [file, pageCount, pagesToRemove, isProcessing]);

  // Reset everything
  const reset = useCallback(() => {
    // Clean up blob URL
    if (result?.url) {
      URL.revokeObjectURL(result.url);
    }

    setFile(null);
    setPageCount(0);
    setPagesToRemove(new Set());
    setLastClickedIndex(null);
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
          setError('The PDF file has no pages. Please select a valid PDF file.');
          setPasswordPrompt({ open: false, file: null });
          return;
        }

        setFile(unlockedFile);
        setPageCount(pageCount);
        setPagesToRemove(new Set());
        setLastClickedIndex(null);
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
    pagesToRemove,
    isProcessing,
    isSuccess,
    result,
    error,
    progress,
    handleUpload,
    togglePage,
    handleRangeInput,
    handleShiftClick,
    handleRemove,
    reset,
    formatFileSize,
    getPagesToRemoveString,
    // Password handling
    passwordPrompt,
    passwordError,
    handlePasswordSubmit,
    handlePasswordCancel,
  };
}
