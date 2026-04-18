'use client';

import { useState, useCallback, useEffect } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { usePdfPassword } from './use-pdf-password';

export interface OrganizeProgress {
  currentFile: number;
  totalFiles: number;
  currentFileName: string;
  percentage: number;
  status: 'preparing' | 'processing' | 'saving' | 'complete';
}

export interface OrganizeResult {
  url: string;
  filename: string;
  pageCount: number;
}

export interface PageItem {
  id: string;
  type: 'original' | 'blank';
  originalPageIndex?: number; // 0-indexed from source PDF
  rotation: 0 | 90 | 180 | 270;
}

export function useOrganizePdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [result, setResult] = useState<OrganizeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<OrganizeProgress | null>(null);

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

  // Initialize pages array from original PDF
  const initializePages = useCallback((count: number): PageItem[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: `page-${i}`,
      type: 'original' as const,
      originalPageIndex: i,
      rotation: 0 as const,
    }));
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
        const initialPages = initializePages(pageCount);
        setPages(initialPages);
        setIsSuccess(false);
        setResult(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load PDF file.';
        setError(errorMessage);
      }
    },
    [validatePdfFile, loadPdfInfo, initializePages]
  );

  // Move page (reorder) - accepts new order array like merge-pdf
  const movePage = useCallback((oldIndex: number, newIndex: number) => {
    setPages((prev) => {
      const newPages = [...prev];
      const [movedPage] = newPages.splice(oldIndex, 1);
      newPages.splice(newIndex, 0, movedPage);
      return newPages;
    });
  }, []);

  // Handle reorder (for drag and drop) - accepts new order array like merge-pdf
  const handleReorder = useCallback((newOrder: PageItem[]) => {
    setPages(newOrder);
  }, []);

  // Add blank page
  const addBlankPage = useCallback((insertIndex: number) => {
    setPages((prev) => {
      const newPages = [...prev];
      const blankPage: PageItem = {
        id: `blank-${Date.now()}-${Math.random()}`,
        type: 'blank',
        rotation: 0,
      };
      newPages.splice(insertIndex, 0, blankPage);
      return newPages;
    });
  }, []);

  // Remove page
  const removePage = useCallback((index: number) => {
    setPages((prev) => {
      if (prev.length <= 1) {
        // Don't allow removing the last page
        return prev;
      }
      const newPages = [...prev];
      newPages.splice(index, 1);
      return newPages;
    });
  }, []);

  // Rotate page (increment by 90 degrees)
  const rotatePage = useCallback((index: number) => {
    setPages((prev) => {
      const newPages = [...prev];
      const currentRotation = newPages[index].rotation;
      const newRotation = ((currentRotation + 90) % 360) as 0 | 90 | 180 | 270;
      newPages[index] = {
        ...newPages[index],
        rotation: newRotation,
      };
      return newPages;
    });
  }, []);

  // Reset to original state
  const reset = useCallback(() => {
    if (file && pageCount > 0) {
      const initialPages = initializePages(pageCount);
      setPages(initialPages);
    }
  }, [file, pageCount, initializePages]);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!file) {
      setError('Please upload a PDF file first.');
      return;
    }

    // Validate page count
    if (pageCount === 0) {
      setError('The PDF file has no pages. Please upload a valid PDF file.');
      return;
    }

    // Validate pages array
    if (pages.length === 0) {
      setError('The document has no pages. Please add at least one page.');
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

      // Create new PDF
      const newPdf = await PDFDocument.create();

      // Process each page in order
      for (let i = 0; i < pages.length; i++) {
        const pageItem = pages[i];
        const percentage = Math.round(((i + 1) / pages.length) * 90); // 90% for processing

        // Update progress
        setProgress({
          currentFile: i + 1,
          totalFiles: pages.length,
          currentFileName: pageItem.type === 'blank' ? 'Blank page' : `Page ${i + 1}`,
          percentage,
          status: 'processing',
        });

        if (pageItem.type === 'original' && pageItem.originalPageIndex !== undefined) {
          // Get the source page to check its original rotation
          const sourcePage = sourcePdf.getPage(pageItem.originalPageIndex);
          const sourceRotation = sourcePage.getRotation();

          // Copy original page
          const [copiedPage] = await newPdf.copyPages(sourcePdf, [pageItem.originalPageIndex]);
          const newPage = newPdf.addPage(copiedPage);

          // Apply rotation - combine source rotation with user's rotation
          // pdf-lib's setRotation handles rotation correctly without cropping
          const totalRotation = (sourceRotation.angle + pageItem.rotation) % 360;
          newPage.setRotation(degrees(totalRotation));
        } else if (pageItem.type === 'blank') {
          // Add blank page
          newPdf.addPage();
        }

        // Show progress for at least 0.2s per page
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      // Update progress: Saving
      setProgress({
        currentFile: pages.length,
        totalFiles: pages.length,
        currentFileName: 'organized.pdf',
        percentage: 95,
        status: 'saving',
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      // Save the PDF
      const pdfBytes = await newPdf.save();

      // Create blob and URL
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      // Update progress: Complete
      setProgress({
        currentFile: pages.length,
        totalFiles: pages.length,
        currentFileName: 'organized.pdf',
        percentage: 100,
        status: 'complete',
      });

      // Show 100% completion for 1s before transitioning to success
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setResult({
        url,
        filename: 'organized.pdf',
        pageCount: pages.length,
      });
      setIsSuccess(true);
      setProgress(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred while organizing the PDF.';
      setError(errorMessage);
      setIsSuccess(false);
      setProgress(null);
    } finally {
      setIsProcessing(false);
    }
  }, [file, pageCount, pages, isProcessing]);

  // Reset everything (full reset)
  const handleReset = useCallback(() => {
    // Clean up blob URL
    if (result?.url) {
      URL.revokeObjectURL(result.url);
    }

    setFile(null);
    setPageCount(0);
    setPages([]);
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

        // Initialize pages array
        const initialPages = initializePages(pageCount);

        setFile(unlockedFile);
        setPageCount(pageCount);
        setPages(initialPages);
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
    [passwordPrompt, unlockPdf, loadPdfInfo, initializePages]
  );

  // Handle password cancel
  const handlePasswordCancel = useCallback(() => {
    setPasswordPrompt({ open: false, file: null });
    setPasswordError(null);
  }, []);

  return {
    file,
    pageCount,
    pages,
    isProcessing,
    isSuccess,
    result,
    error,
    progress,
    handleUpload,
    movePage,
    handleReorder,
    addBlankPage,
    removePage,
    rotatePage,
    reset,
    handleSave,
    handleReset,
    formatFileSize,
    setPages,
    // Password handling
    passwordPrompt,
    passwordError,
    handlePasswordSubmit,
    handlePasswordCancel,
  };
}
