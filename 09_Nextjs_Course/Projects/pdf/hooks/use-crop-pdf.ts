'use client';

import { useState, useCallback, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import { usePdfPassword } from './use-pdf-password';
import type { Crop, PixelCrop } from 'react-image-crop';

export interface CropProgress {
  currentFile: number;
  totalFiles: number;
  currentFileName: string;
  percentage: number;
  status: 'preparing' | 'processing' | 'saving' | 'complete';
}

export interface CropResult {
  url: string;
  filename: string;
  pageCount: number;
}

export type CropScope = 'all_pages' | 'current_page';

export interface PageDetails {
  width: number; // PDF point width
  height: number; // PDF point height
}

export function useCropPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [crop, setCrop] = useState<Crop | null>(null);
  const [scaleFactor, setScaleFactor] = useState<number>(1);
  const [pageDetails, setPageDetails] = useState<PageDetails | null>(null);
  const [scope, setScope] = useState<CropScope>('all_pages');
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [result, setResult] = useState<CropResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<CropProgress | null>(null);

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

  // Load PDF info and get page dimensions
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
        setCrop(null);
        setScaleFactor(1);
        setPageDetails(null);
        setCurrentPageIndex(0);
        setScope('all_pages');
        setIsSuccess(false);
        setResult(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load PDF file.';
        setError(errorMessage);
      }
    },
    [validatePdfFile, loadPdfInfoLocal, checkEncryption]
  );

  // Handle image load - calculate scale factor
  const onImageLoad = useCallback(
    async (event: React.SyntheticEvent<HTMLImageElement>) => {
      if (!file || !event.currentTarget) return;

      try {
        const img = event.currentTarget;
        const renderedWidth = img.naturalWidth || img.width;
        const renderedHeight = img.naturalHeight || img.height;

        // Load PDF to get original dimensions
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const page = pdfDoc.getPage(currentPageIndex);
        const { width: pdfWidth, height: pdfHeight } = page.getSize();

        // Calculate scale factor: ratio between rendered pixel width and PDF point width
        const scale = pdfWidth / renderedWidth;

        setScaleFactor(scale);
        setPageDetails({ width: pdfWidth, height: pdfHeight });
      } catch (err) {
        console.error('Error calculating scale factor:', err);
      }
    },
    [file, currentPageIndex]
  );

  // Set scope
  const setCropScope = useCallback((newScope: CropScope) => {
    setScope(newScope);
  }, []);

  // Set current page
  const setCurrentPage = useCallback(
    (pageIndex: number) => {
      if (pageIndex >= 0 && pageIndex < pageCount) {
        setCurrentPageIndex(pageIndex);
        // Reset crop when changing pages
        setCrop(null);
      }
    },
    [pageCount]
  );

  // Reset crop box
  const reset = useCallback(() => {
    setCrop(null);
  }, []);

  // Handle crop
  const handleCrop = useCallback(async () => {
    if (!file || !crop || !pageDetails) {
      setError('Please select a crop area first.');
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

      // Step 1: Get crop values (already in pixels from react-image-crop)
      const cropPixels = crop as PixelCrop;
      const screenX = cropPixels.x;
      const screenY = cropPixels.y;
      const screenW = cropPixels.width;
      const screenH = cropPixels.height;

      // Step 2: Convert Screen Pixels to PDF Points
      const pdfX = screenX * scaleFactor;
      const pdfW = screenW * scaleFactor;
      const pdfH = screenH * scaleFactor;

      // Y-Axis Flip: PDF coordinates start at Bottom-Left, Browser starts Top-Left
      // renderedHeight = pageDetails.height / scaleFactor (approximately)
      const renderedHeight = pageDetails.height / scaleFactor;
      const pdfY = pageDetails.height - screenY * scaleFactor - pdfH;

      // Validate crop box
      if (pdfW <= 0 || pdfH <= 0) {
        throw new Error('Invalid crop area. Please select a valid region.');
      }

      if (
        pdfX < 0 ||
        pdfY < 0 ||
        pdfX + pdfW > pageDetails.width ||
        pdfY + pdfH > pageDetails.height
      ) {
        throw new Error('Crop area is outside page boundaries.');
      }

      // Step 3: Apply crop using pdf-lib
      const pagesToCrop =
        scope === 'all_pages' ? Array.from({ length: pageCount }, (_, i) => i) : [currentPageIndex];

      for (let i = 0; i < pagesToCrop.length; i++) {
        const pageIndex = pagesToCrop[i];
        const page = pdfDoc.getPage(pageIndex);
        const { width: pageWidth, height: pageHeight } = page.getSize();

        // For pages with different dimensions, scale the crop box proportionally
        let cropX = pdfX;
        let cropY = pdfY;
        let cropW = pdfW;
        let cropH = pdfH;

        if (pageWidth !== pageDetails.width || pageHeight !== pageDetails.height) {
          const scaleX = pageWidth / pageDetails.width;
          const scaleY = pageHeight / pageDetails.height;
          cropX = pdfX * scaleX;
          cropY = pdfY * scaleY;
          cropW = pdfW * scaleX;
          cropH = pdfH * scaleY;
        }

        // Set crop box and media box
        page.setCropBox(cropX, cropY, cropW, cropH);
        page.setMediaBox(cropX, cropY, cropW, cropH);

        // Update progress
        const progressPercent = 30 + ((i + 1) / pagesToCrop.length) * 50;
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

      // Step 4: Save and download
      const pdfBytes = await pdfDoc.save();

      // Create blob and URL
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      // Generate filename
      const originalName = file.name.replace('.pdf', '');
      const filename = `${originalName}_cropped.pdf`;

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
      const errorMessage = err instanceof Error ? err.message : 'Failed to crop PDF.';
      setError(errorMessage);
      setIsProcessing(false);
      setProgress(null);
    }
  }, [file, crop, scaleFactor, pageDetails, scope, currentPageIndex, pageCount, isProcessing]);

  // Reset everything
  const handleReset = useCallback(() => {
    // Clean up blob URL
    if (result?.url) {
      URL.revokeObjectURL(result.url);
    }

    setFile(null);
    setPageCount(0);
    setCrop(null);
    setScaleFactor(1);
    setPageDetails(null);
    setCurrentPageIndex(0);
    setScope('all_pages');
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
        setCrop(null);
        setScaleFactor(1);
        setPageDetails(null);
        setCurrentPageIndex(0);
        setScope('all_pages');
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
    crop,
    scaleFactor,
    pageDetails,
    scope,
    currentPageIndex,
    isProcessing,
    isSuccess,
    result,
    error,
    progress,
    handleUpload,
    setCrop,
    onImageLoad,
    setCropScope,
    setCurrentPage,
    reset,
    handleCrop,
    handleReset,
    formatFileSize,
    // Password handling
    passwordPrompt,
    passwordError,
    handlePasswordSubmit,
    handlePasswordCancel,
  };
}
