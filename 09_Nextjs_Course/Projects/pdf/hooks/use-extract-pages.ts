'use client';

import { useState, useCallback, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import { usePdfPassword } from './use-pdf-password';

export interface ExtractProgress {
  currentFile: number;
  totalFiles: number;
  currentFileName: string;
  percentage: number;
  status: 'preparing' | 'processing' | 'saving' | 'complete';
}

export interface ExtractResult {
  url: string;
  filename: string;
  pageCount: number;
}

export function useExtractPages() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);
  const [mergeOutput, setMergeOutput] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [results, setResults] = useState<ExtractResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<ExtractProgress | null>(null);

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
        setSelectedPages(new Set());
        setLastClickedIndex(null);
        setIsSuccess(false);
        setResults([]);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load PDF file.';
        setError(errorMessage);
      }
    },
    [validatePdfFile, loadPdfInfo]
  );

  // Toggle page selection
  const togglePage = useCallback((pageIndex: number) => {
    setSelectedPages((prev) => {
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

  // Select all pages
  const selectAll = useCallback(() => {
    const allPages = new Set<number>();
    for (let i = 1; i <= pageCount; i++) {
      allPages.add(i);
    }
    setSelectedPages(allPages);
    setLastClickedIndex(null);
  }, [pageCount]);

  // Deselect all pages
  const deselectAll = useCallback(() => {
    setSelectedPages(new Set());
    setLastClickedIndex(null);
  }, []);

  // Handle range input (e.g., "1-3, 5, 7-9")
  const handleRangeInput = useCallback(
    (inputString: string) => {
      const newSet = new Set<number>();
      const trimmed = inputString.trim();

      if (!trimmed) {
        setSelectedPages(newSet);
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

      setSelectedPages(newSet);
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

      setSelectedPages((prev) => {
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

  // Convert selectedPages Set to string for input
  const getSelectedPagesString = useCallback((): string => {
    if (selectedPages.size === 0) return '';

    const sorted = Array.from(selectedPages).sort((a, b) => a - b);
    return sorted.join(', ');
  }, [selectedPages]);

  // Handle extract pages
  const handleExtract = useCallback(async () => {
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
    if (selectedPages.size === 0) {
      setError('Please select at least one page to extract.');
      return;
    }

    // Prevent multiple simultaneous operations
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResults([]);

    try {
      const sortedPages = Array.from(selectedPages).sort((a, b) => a - b);
      const totalFiles = mergeOutput ? 1 : sortedPages.length;

      // Update progress: Preparing
      setProgress({
        currentFile: 0,
        totalFiles,
        currentFileName: file.name,
        percentage: 0,
        status: 'preparing',
      });

      // Show preparing state for 0.5s
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Load PDF
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);

      const results: ExtractResult[] = [];

      if (mergeOutput) {
        // Mode 1: Merge all selected pages into one PDF
        // Update progress: Processing
        setProgress({
          currentFile: 0,
          totalFiles: 1,
          currentFileName: file.name,
          percentage: 10,
          status: 'processing',
        });

        await new Promise((resolve) => setTimeout(resolve, 300));

        // Create new PDF with all selected pages
        const newPdf = await PDFDocument.create();
        const pageIndices = sortedPages.map((p) => p - 1); // Convert to 0-indexed
        const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
        copiedPages.forEach((page) => newPdf.addPage(page));

        // Update progress: Saving
        setProgress({
          currentFile: 1,
          totalFiles: 1,
          currentFileName: 'extracted.pdf',
          percentage: 95,
          status: 'saving',
        });

        await new Promise((resolve) => setTimeout(resolve, 500));

        // Save the PDF
        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        results.push({
          url,
          filename: 'extracted.pdf',
          pageCount: sortedPages.length,
        });
      } else {
        // Mode 2: Create separate PDF for each selected page
        for (let i = 0; i < sortedPages.length; i++) {
          const pageNum = sortedPages[i];
          const percentage = Math.round(((i + 1) / sortedPages.length) * 90); // 90% for processing, 10% for saving

          // Update progress: Processing
          setProgress({
            currentFile: i + 1,
            totalFiles: sortedPages.length,
            currentFileName: `page-${pageNum}.pdf`,
            percentage,
            status: 'processing',
          });

          // Show progress for at least 0.3s per file
          await new Promise((resolve) => setTimeout(resolve, 300));

          // Create new PDF with single page
          const newPdf = await PDFDocument.create();
          const [copiedPage] = await newPdf.copyPages(sourcePdf, [pageNum - 1]); // Convert to 0-indexed
          newPdf.addPage(copiedPage);

          // Save the PDF
          const pdfBytes = await newPdf.save();
          const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);

          results.push({
            url,
            filename: `page-${pageNum}.pdf`,
            pageCount: 1,
          });
        }

        // Update progress: Saving
        setProgress({
          currentFile: sortedPages.length,
          totalFiles: sortedPages.length,
          currentFileName: `${sortedPages.length} files created`,
          percentage: 95,
          status: 'saving',
        });

        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Update progress: Complete
      setProgress({
        currentFile: results.length,
        totalFiles: results.length,
        currentFileName: mergeOutput ? 'extracted.pdf' : `${results.length} files created`,
        percentage: 100,
        status: 'complete',
      });

      // Show 100% completion for 1s before transitioning to success
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setResults(results);
      setIsSuccess(true);
      setProgress(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred while extracting pages.';
      setError(errorMessage);
      setIsSuccess(false);
      setProgress(null);
    } finally {
      setIsProcessing(false);
    }
  }, [file, pageCount, selectedPages, mergeOutput, isProcessing]);

  // Reset everything
  const reset = useCallback(() => {
    // Clean up blob URLs
    results.forEach((result) => {
      URL.revokeObjectURL(result.url);
    });

    setFile(null);
    setPageCount(0);
    setSelectedPages(new Set());
    setLastClickedIndex(null);
    setMergeOutput(true);
    setIsProcessing(false);
    setIsSuccess(false);
    setResults([]);
    setError(null);
    setProgress(null);
  }, [results]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      results.forEach((result) => {
        URL.revokeObjectURL(result.url);
      });
    };
  }, [results]);

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
        setSelectedPages(new Set());
        setLastClickedIndex(null);
        setIsSuccess(false);
        setResults([]);

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
    selectedPages,
    mergeOutput,
    isProcessing,
    isSuccess,
    results,
    error,
    progress,
    handleUpload,
    togglePage,
    selectAll,
    deselectAll,
    handleRangeInput,
    handleShiftClick,
    handleExtract,
    setMergeOutput,
    reset,
    formatFileSize,
    getSelectedPagesString,
    // Password handling
    passwordPrompt,
    passwordError,
    handlePasswordSubmit,
    handlePasswordCancel,
  };
}
