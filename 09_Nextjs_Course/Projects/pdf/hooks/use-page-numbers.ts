'use client';

import { useState, useCallback, useEffect } from 'react';
import { PDFDocument, rgb, PDFFont } from 'pdf-lib';
import { usePdfPassword } from './use-pdf-password';

export interface PageNumbersProgress {
  currentFile: number;
  totalFiles: number;
  currentFileName: string;
  percentage: number;
  status: 'preparing' | 'processing' | 'saving' | 'complete';
}

export interface PageNumbersResult {
  url: string;
  filename: string;
  pageCount: number;
}

export type PageNumbersMode = 'single' | 'facing';

export type PagePosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'middle-left'
  | 'center'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type FacingPosition = 'outer' | 'inner' | 'center';

export type MarginSize = 'small' | 'recommended' | 'big';

export interface PageNumbersSettings {
  position: PagePosition;
  facingPosition: FacingPosition;
  margin: MarginSize;
  range: { start: number; end: number };
  textTemplate: string;
  format: {
    font: string;
    size: number;
    color: string;
    bold: boolean;
    italic: boolean;
  };
  startFromCover: boolean;
}

export function usePageNumbers() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [mode, setMode] = useState<PageNumbersMode>('single');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [result, setResult] = useState<PageNumbersResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<PageNumbersProgress | null>(null);

  const [settings, setSettings] = useState<PageNumbersSettings>({
    position: 'bottom-center',
    facingPosition: 'outer',
    margin: 'recommended',
    range: { start: 1, end: 1 },
    textTemplate: 'Page {n}',
    format: {
      font: 'Helvetica',
      size: 12,
      color: '#000000',
      bold: false,
      italic: false,
    },
    startFromCover: false,
  });

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
        setIsSuccess(false);
        setResult(null);

        // Set default range to all pages
        setSettings((prev) => ({
          ...prev,
          range: { start: 1, end: pageCount },
        }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load PDF file.';
        setError(errorMessage);
      }
    },
    [validatePdfFile, loadPdfInfoLocal, checkEncryption]
  );

  // Update setting
  const updateSetting = useCallback(
    <K extends keyof PageNumbersSettings>(key: K, value: PageNumbersSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Get margin size in points
  const getMarginSize = useCallback((margin: MarginSize): number => {
    switch (margin) {
      case 'small':
        return 10;
      case 'recommended':
        return 20;
      case 'big':
        return 30;
      default:
        return 20;
    }
  }, []);

  // Get position coordinates for single mode
  const getSinglePositionCoordinates = useCallback(
    (position: PagePosition, pageWidth: number, pageHeight: number, margin: number) => {
      let x = 0;
      let y = 0;

      switch (position) {
        case 'top-left':
          x = margin;
          y = pageHeight - margin;
          break;
        case 'top-center':
          x = pageWidth / 2;
          y = pageHeight - margin;
          break;
        case 'top-right':
          x = pageWidth - margin;
          y = pageHeight - margin;
          break;
        case 'middle-left':
          x = margin;
          y = pageHeight / 2;
          break;
        case 'center':
          x = pageWidth / 2;
          y = pageHeight / 2;
          break;
        case 'middle-right':
          x = pageWidth - margin;
          y = pageHeight / 2;
          break;
        case 'bottom-left':
          x = margin;
          y = margin;
          break;
        case 'bottom-center':
          x = pageWidth / 2;
          y = margin;
          break;
        case 'bottom-right':
          x = pageWidth - margin;
          y = margin;
          break;
      }

      return { x, y };
    },
    []
  );

  // Get position coordinates for facing mode
  const getFacingPositionCoordinates = useCallback(
    (
      facingPosition: FacingPosition,
      isLeftPage: boolean,
      pageWidth: number,
      pageHeight: number,
      margin: number
    ) => {
      let x = 0;
      let y = margin; // Default to bottom

      switch (facingPosition) {
        case 'outer':
          // Outer: Left page = left side, Right page = right side
          x = isLeftPage ? margin : pageWidth - margin;
          break;
        case 'inner':
          // Inner: Left page = right side, Right page = left side
          x = isLeftPage ? pageWidth - margin : margin;
          break;
        case 'center':
          // Center: Both pages center
          x = pageWidth / 2;
          break;
      }

      return { x, y };
    },
    []
  );

  // Determine if page is left (verso) or right (recto) in facing mode
  const isLeftPage = useCallback((pageIndex: number, startFromCover: boolean): boolean => {
    // If startFromCover is true, page 1 is treated as right (cover)
    // Otherwise, page 1 is right, page 2 is left, etc.
    const adjustedIndex = startFromCover ? pageIndex : pageIndex - 1;
    return adjustedIndex % 2 === 1; // Odd = left, Even = right
  }, []);

  // Format page number text
  const formatPageNumberText = useCallback(
    (template: string, pageNumber: number, totalPages: number): string => {
      return template.replace(/{n}/g, pageNumber.toString()).replace(/{p}/g, totalPages.toString());
    },
    []
  );

  // Add page numbers
  const handleAddNumbers = useCallback(async () => {
    if (!file) {
      setError('Please upload a PDF file first.');
      return;
    }

    // Validate range
    if (settings.range.start < 1 || settings.range.start > pageCount) {
      setError(`Start page must be between 1 and ${pageCount}.`);
      return;
    }

    if (settings.range.end < 1 || settings.range.end > pageCount) {
      setError(`End page must be between 1 and ${pageCount}.`);
      return;
    }

    if (settings.range.start > settings.range.end) {
      setError('Start page must be less than or equal to end page.');
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

      // Embed font - handle bold/italic
      let fontName = settings.format.font;
      if (settings.format.bold && !fontName.includes('Bold')) {
        fontName = fontName === 'Helvetica' ? 'Helvetica-Bold' : fontName;
      }
      // Note: pdf-lib doesn't support italic fonts directly, we'll use the base font
      const font = await pdfDoc.embedFont(
        fontName as 'Helvetica' | 'Helvetica-Bold' | 'Times-Roman'
      );

      // Parse color
      const colorHex = settings.format.color.replace('#', '');
      const r = parseInt(colorHex.substring(0, 2), 16) / 255;
      const g = parseInt(colorHex.substring(2, 4), 16) / 255;
      const b = parseInt(colorHex.substring(4, 6), 16) / 255;

      const margin = getMarginSize(settings.margin);
      const totalPages = settings.range.end - settings.range.start + 1;

      // Process each page
      for (let i = settings.range.start - 1; i < settings.range.end; i++) {
        const page = pdfDoc.getPage(i);
        const { width, height } = page.getSize();
        const pageNumber = i - settings.range.start + 1; // Page number in the range (starting from 1)
        const actualPageNumber = i + 1; // Actual page number in the document

        // Format text - use actual page number for {n}, total pages in range for {p}
        const text = formatPageNumberText(settings.textTemplate, actualPageNumber, pageCount);

        // Calculate position
        let x = 0;
        let y = 0;
        let isLeft = false;

        if (mode === 'single') {
          const pos = getSinglePositionCoordinates(settings.position, width, height, margin);
          x = pos.x;
          y = pos.y;
        } else {
          // Facing mode
          isLeft = isLeftPage(actualPageNumber, settings.startFromCover);
          const pos = getFacingPositionCoordinates(
            settings.facingPosition,
            isLeft,
            width,
            height,
            margin
          );
          x = pos.x;
          y = pos.y;
        }

        // Draw page number
        // For right-aligned positions, calculate text width and adjust x
        let finalX = x;

        // Check if this is a right-aligned position
        const isRightAligned =
          (mode === 'single' &&
            (settings.position === 'top-right' ||
              settings.position === 'middle-right' ||
              settings.position === 'bottom-right')) ||
          (mode === 'facing' &&
            ((settings.facingPosition === 'outer' && !isLeft) ||
              (settings.facingPosition === 'inner' && isLeft)));

        if (isRightAligned) {
          // Calculate text width and adjust x so text ends at margin
          const textWidth = font.widthOfTextAtSize(text, settings.format.size);
          finalX = x - textWidth;
        }

        // Check if this is a center-aligned position
        const isCenterAligned =
          (mode === 'single' &&
            (settings.position === 'top-center' ||
              settings.position === 'center' ||
              settings.position === 'bottom-center')) ||
          (mode === 'facing' && settings.facingPosition === 'center');

        if (isCenterAligned) {
          // Calculate text width and center it
          const textWidth = font.widthOfTextAtSize(text, settings.format.size);
          finalX = x - textWidth / 2;
        }

        page.drawText(text, {
          x: finalX,
          y,
          size: settings.format.size,
          font,
          color: rgb(r, g, b),
        });

        // Update progress
        const progressPercent = 30 + ((i - settings.range.start + 1) / totalPages) * 50;
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
      const filename = `${originalName}_numbered.pdf`;

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
      const errorMessage = err instanceof Error ? err.message : 'Failed to add page numbers.';
      setError(errorMessage);
      setIsProcessing(false);
      setProgress(null);
    }
  }, [
    file,
    mode,
    settings,
    pageCount,
    isProcessing,
    getMarginSize,
    getSinglePositionCoordinates,
    getFacingPositionCoordinates,
    isLeftPage,
    formatPageNumberText,
  ]);

  // Reset everything
  const handleReset = useCallback(() => {
    // Clean up blob URL
    if (result?.url) {
      URL.revokeObjectURL(result.url);
    }

    setFile(null);
    setPageCount(0);
    setMode('single');
    setIsProcessing(false);
    setIsSuccess(false);
    setResult(null);
    setError(null);
    setProgress(null);
    setSettings({
      position: 'bottom-center',
      facingPosition: 'outer',
      margin: 'recommended',
      range: { start: 1, end: 1 },
      textTemplate: 'Page {n}',
      format: {
        font: 'Helvetica',
        size: 12,
        color: '#000000',
        bold: false,
        italic: false,
      },
      startFromCover: false,
    });
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
        setIsSuccess(false);
        setResult(null);

        // Set default range to all pages
        setSettings((prev) => ({
          ...prev,
          range: { start: 1, end: pageCount },
        }));

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
    mode,
    settings,
    isProcessing,
    isSuccess,
    result,
    error,
    progress,
    handleUpload,
    setMode,
    updateSetting,
    handleAddNumbers,
    handleReset,
    formatFileSize,
    // Password handling
    passwordPrompt,
    passwordError,
    handlePasswordSubmit,
    handlePasswordCancel,
  };
}
