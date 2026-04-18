'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import { usePdfPassword } from './use-pdf-password';

export interface FileWithMetadata {
  file: File;
  id: string;
  size: number;
  name: string;
}

export interface MergeProgress {
  currentFile: number;
  totalFiles: number;
  currentFileName: string;
  percentage: number;
  status: 'preparing' | 'processing' | 'saving' | 'complete';
}

export function useMergePdf() {
  const [files, setFiles] = useState<FileWithMetadata[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<MergeProgress | null>(null);
  
  // Password handling
  const { checkEncryption, unlockPdf } = usePdfPassword();
  const [passwordPrompt, setPasswordPrompt] = useState<{
    open: boolean;
    file: File | null;
    fileIndex: number;
  }>({ open: false, file: null, fileIndex: -1 });
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Format file size
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }, []);

  // Maximum file size: 50MB per file (adjust as needed)
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  const MAX_TOTAL_SIZE = 200 * 1024 * 1024; // 200MB total
  const MAX_FILES = 50; // Maximum number of files

  // Validate PDF files
  const validatePdfFile = useCallback(
    (file: File): { valid: boolean; error?: string } => {
      // Check file type
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        return { valid: false, error: 'Invalid file type. Only PDF files are allowed.' };
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        const maxSizeStr = formatFileSize(MAX_FILE_SIZE);
        return {
          valid: false,
          error: `File "${file.name}" is too large. Maximum size is ${maxSizeStr}.`,
        };
      }

      // Check if file is empty
      if (file.size === 0) {
        return { valid: false, error: `File "${file.name}" is empty.` };
      }

      return { valid: true };
    },
    [formatFileSize]
  );

  // Pending files queue (files waiting for password unlock)
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  // Process and add files (after password check/unlock)
  const processAndAddFiles = useCallback(
    async (fileArray: File[], startIndex: number = 0) => {
      if (startIndex >= fileArray.length) {
        setPendingFiles([]);
        return;
      }

      const file = fileArray[startIndex];
      
      try {
        // Check if file is encrypted
        const isEncrypted = await checkEncryption(file);
        
        if (isEncrypted) {
          // Store remaining files and show password prompt for this file
          setPendingFiles(fileArray.slice(startIndex));
          setPasswordPrompt({ open: true, file, fileIndex: startIndex });
          return;
        }

        // File is not encrypted, add it
        const existingFileNames = new Set(files.map((f) => f.name.toLowerCase()));
        if (!existingFileNames.has(file.name.toLowerCase())) {
          const newFile: FileWithMetadata = {
            file,
            id: `${Date.now()}-${startIndex}-${Math.random().toString(36).substr(2, 9)}`,
            size: file.size,
            name: file.name,
          };
          setFiles((prev) => [...prev, newFile]);
        }

        // Process next file
        await processAndAddFiles(fileArray, startIndex + 1);
      } catch (err) {
        // If encryption check fails, try to add file anyway (might not be encrypted)
        const existingFileNames = new Set(files.map((f) => f.name.toLowerCase()));
        if (!existingFileNames.has(file.name.toLowerCase())) {
          const newFile: FileWithMetadata = {
            file,
            id: `${Date.now()}-${startIndex}-${Math.random().toString(36).substr(2, 9)}`,
            size: file.size,
            name: file.name,
          };
          setFiles((prev) => [...prev, newFile]);
        }
        // Continue with next file
        await processAndAddFiles(fileArray, startIndex + 1);
      }
    },
    [checkEncryption, files]
  );

  // Handle password submission
  const handlePasswordSubmit = useCallback(
    async (password: string) => {
      if (!passwordPrompt.file) return;

      setPasswordError(null);
      
      try {
        // Unlock the PDF
        const unlockedFile = await unlockPdf(passwordPrompt.file, password);
        
        // Add unlocked file
        const existingFileNames = new Set(files.map((f) => f.name.toLowerCase()));
        if (!existingFileNames.has(unlockedFile.name.toLowerCase())) {
          const newFile: FileWithMetadata = {
            file: unlockedFile,
            id: `${Date.now()}-${passwordPrompt.fileIndex}-${Math.random().toString(36).substr(2, 9)}`,
            size: unlockedFile.size,
            name: unlockedFile.name,
          };
          setFiles((prev) => [...prev, newFile]);
        }

        // Close prompt
        setPasswordPrompt({ open: false, file: null, fileIndex: -1 });
        setPasswordError(null);

        // Continue processing remaining files
        if (pendingFiles.length > 1) {
          await processAndAddFiles(pendingFiles.slice(1), 0);
        } else {
          setPendingFiles([]);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '';
        if (errorMessage === 'INCORRECT_PASSWORD' || errorMessage.includes('password')) {
          setPasswordError('Incorrect password. Please try again.');
        } else {
          setPasswordError('Failed to unlock PDF. Please try again.');
        }
      }
    },
    [passwordPrompt, unlockPdf, files, pendingFiles, processAndAddFiles]
  );

  // Handle password cancel
  const handlePasswordCancel = useCallback(() => {
    setPasswordPrompt({ open: false, file: null, fileIndex: -1 });
    setPasswordError(null);
    setPendingFiles([]);
  }, []);

  // Handle file upload (appends files to existing list)
  const handleUpload = useCallback(
    async (uploadedFiles: FileList | File[]) => {
      setError(null);
      setPasswordError(null);
      const fileArray = Array.from(uploadedFiles);

      // Check total file count limit
      if (files.length + fileArray.length > MAX_FILES) {
        setError(`Maximum ${MAX_FILES} files allowed. You already have ${files.length} file(s).`);
        return;
      }

      // Validate all files
      const validationResults = fileArray.map((file) => ({
        file,
        validation: validatePdfFile(file),
      }));

      const invalidFiles = validationResults.filter((r) => !r.validation.valid);
      if (invalidFiles.length > 0) {
        const firstError = invalidFiles[0].validation.error || 'Invalid file type.';
        setError(firstError);
        return;
      }

      // Check total size limit
      const currentTotalSize = files.reduce((sum, f) => sum + f.size, 0);
      const newFilesTotalSize = fileArray.reduce((sum, f) => sum + f.size, 0);
      if (currentTotalSize + newFilesTotalSize > MAX_TOTAL_SIZE) {
        setError(
          `Total file size exceeds limit of ${formatFileSize(
            MAX_TOTAL_SIZE
          )}. Please remove some files.`
        );
        return;
      }

      // Process files (check for encryption and prompt for password if needed)
      await processAndAddFiles(fileArray, 0);
    },
    [validatePdfFile, files, MAX_FILES, MAX_TOTAL_SIZE, formatFileSize, processAndAddFiles]
  );

  // Alias for clarity - same function, different name
  const handleFilesAdded = handleUpload;

  // Handle file removal
  const handleRemove = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setError(null);
  }, []);

  // Handle reorder (for drag and drop)
  const handleReorder = useCallback((newOrder: FileWithMetadata[]) => {
    setFiles(newOrder);
  }, []);

  // Merge PDFs
  const handleMerge = useCallback(async () => {
    // Prevent multiple simultaneous merges
    if (isProcessing) {
      return;
    }

    if (files.length === 0) {
      setError('Please upload at least one PDF file.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setMergedPdfUrl(null);

    try {
      // Update progress: Preparing
      setProgress({
        currentFile: 0,
        totalFiles: files.length,
        currentFileName: '',
        percentage: 0,
        status: 'preparing',
      });

      // Show preparing state for 0.5s
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Create a new PDF document
      const mergedPdf = await PDFDocument.create();

      // Process each file sequentially to avoid memory issues
      for (let i = 0; i < files.length; i++) {
        const fileWithMeta = files[i];
        const percentage = Math.round(((i + 1) / files.length) * 90); // 90% for processing, 10% for saving

        // Update progress: Processing file
        setProgress({
          currentFile: i + 1,
          totalFiles: files.length,
          currentFileName: fileWithMeta.name,
          percentage,
          status: 'processing',
        });

        try {
          // Read file as ArrayBuffer
          const arrayBuffer = await fileWithMeta.file.arrayBuffer();

          // Load the PDF
          const pdf = await PDFDocument.load(arrayBuffer);

          // Copy all pages from the loaded PDF
          const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

          // Add each page to the merged document
          pages.forEach((page) => mergedPdf.addPage(page));

          // Show progress for at least 0.5s per file (minimum visibility) after processing
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (err) {
          console.error(`Error processing ${fileWithMeta.name}:`, err);
          throw new Error(
            `Failed to process "${fileWithMeta.name}". The file may be corrupted or encrypted.`
          );
        }
      }

      // Update progress: Saving
      setProgress({
        currentFile: files.length,
        totalFiles: files.length,
        currentFileName: 'merged-document.pdf',
        percentage: 95,
        status: 'saving',
      });

      // Show saving state for 0.5s
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Save the merged PDF
      const pdfBytes = await mergedPdf.save();

      // Create blob and URL
      // Type assertion needed for pdf-lib's Uint8Array type
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      // Update progress: Complete
      setProgress({
        currentFile: files.length,
        totalFiles: files.length,
        currentFileName: 'merged-document.pdf',
        percentage: 100,
        status: 'complete',
      });

      // Show 100% completion for 1s before transitioning to success
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMergedPdfUrl(url);
      setIsSuccess(true);
      setProgress(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred while merging PDFs.';
      setError(errorMessage);
      setIsSuccess(false);
      setProgress(null);
    } finally {
      setIsProcessing(false);
    }
  }, [files, isProcessing]);

  // Reset everything
  const reset = useCallback(() => {
    // Clean up blob URL to prevent memory leaks
    if (mergedPdfUrl) {
      URL.revokeObjectURL(mergedPdfUrl);
    }

    setFiles([]);
    setIsProcessing(false);
    setIsSuccess(false);
    setMergedPdfUrl(null);
    setError(null);
    setProgress(null);
  }, [mergedPdfUrl]);

  // Memoized total file size
  const totalSize = useMemo(() => {
    return files.reduce((sum, f) => sum + f.size, 0);
  }, [files]);

  // Cleanup blob URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (mergedPdfUrl) {
        URL.revokeObjectURL(mergedPdfUrl);
      }
    };
  }, [mergedPdfUrl]);

  return {
    files,
    isProcessing,
    isSuccess,
    mergedPdfUrl,
    error,
    progress,
    totalSize,
    handleUpload,
    handleFilesAdded,
    handleRemove,
    handleReorder,
    handleMerge,
    reset,
    formatFileSize,
    // Password handling
    passwordPrompt,
    passwordError,
    handlePasswordSubmit,
    handlePasswordCancel,
  };
}
