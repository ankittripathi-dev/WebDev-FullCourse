'use client';

import { useState, useCallback, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import { usePdfPassword } from './use-pdf-password';

export interface RepairProgress {
  currentFile: number;
  totalFiles: number;
  currentFileName: string;
  percentage: number;
  status: 'preparing' | 'processing' | 'saving' | 'complete';
}

export interface RepairResult {
  url: string;
  filename: string;
  pageCount: number;
}

export type RepairStatus = 'idle' | 'processing' | 'success' | 'error';

export function useRepairPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [repairStatus, setRepairStatus] = useState<RepairStatus>('idle');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [result, setResult] = useState<RepairResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<RepairProgress | null>(null);

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

  // Load PDF and get page count (with ignoreEncryption for damaged files)
  const loadPdfInfo = useCallback(async (pdfFile: File) => {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      // Try to load with ignoreEncryption to handle damaged/encrypted files
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const pages = pdf.getPageCount();
      return { pdf, pageCount: pages };
    } catch (err) {
      throw new Error('Failed to load PDF. The file may be too damaged or corrupted.');
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

        // Try to load PDF to get page count
        const { pageCount } = await loadPdfInfo(selectedFile);

        // Validate page count
        if (pageCount === 0) {
          setError('The PDF file has no pages. Please select a valid PDF file.');
          return;
        }

        setFile(selectedFile);
        setPageCount(pageCount);
        setRepairStatus('idle');
        setIsSuccess(false);
        setResult(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load PDF file.';
        setError(errorMessage);
        setRepairStatus('error');
      }
    },
    [validatePdfFile, loadPdfInfo]
  );

  // Handle repair
  const handleRepair = useCallback(async () => {
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
    setRepairStatus('processing');
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

      // Load source PDF with ignoreEncryption to handle damaged files
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

      // Update progress: Processing
      setProgress({
        currentFile: 0,
        totalFiles: 1,
        currentFileName: file.name,
        percentage: 10,
        status: 'processing',
      });

      await new Promise((resolve) => setTimeout(resolve, 300));

      // Create new PDF to rebuild structure
      const repairedPdf = await PDFDocument.create();

      // Copy all pages from the damaged PDF to the new one
      // This strips broken metadata/xref tables and rebuilds the structure
      const pageIndices = sourcePdf.getPageIndices();
      const copiedPages = await repairedPdf.copyPages(sourcePdf, pageIndices);
      copiedPages.forEach((page) => repairedPdf.addPage(page));

      // Update progress: Saving
      setProgress({
        currentFile: 1,
        totalFiles: 1,
        currentFileName: 'repaired.pdf',
        percentage: 90,
        status: 'saving',
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      // Save the repaired PDF
      const pdfBytes = await repairedPdf.save();

      // Create blob and URL
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      // Update progress: Complete
      setProgress({
        currentFile: 1,
        totalFiles: 1,
        currentFileName: 'repaired.pdf',
        percentage: 100,
        status: 'complete',
      });

      // Show 100% completion for 1s before transitioning to success
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setResult({
        url,
        filename: 'repaired.pdf',
        pageCount: pageIndices.length,
      });
      setRepairStatus('success');
      setIsSuccess(true);
      setProgress(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'An error occurred while repairing the PDF. The file may be too damaged to recover.';
      setError(errorMessage);
      setRepairStatus('error');
      setIsSuccess(false);
      setProgress(null);
    } finally {
      setIsProcessing(false);
    }
  }, [file, pageCount, isProcessing]);

  // Reset everything (full reset)
  const handleReset = useCallback(() => {
    // Clean up blob URL
    if (result?.url) {
      URL.revokeObjectURL(result.url);
    }

    setFile(null);
    setPageCount(0);
    setRepairStatus('idle');
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
        setRepairStatus('idle');
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
    repairStatus,
    isProcessing,
    isSuccess,
    result,
    error,
    progress,
    handleUpload,
    handleRepair,
    handleReset,
    formatFileSize,
    // Password handling
    passwordPrompt,
    passwordError,
    handlePasswordSubmit,
    handlePasswordCancel,
  };
}
