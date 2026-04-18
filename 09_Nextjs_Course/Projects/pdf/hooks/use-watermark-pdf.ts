'use client';

import { useState, useCallback, useEffect } from 'react';
import { PDFDocument, rgb, degrees, PDFPage, PDFFont, PDFImage } from 'pdf-lib';
import { usePdfPassword } from './use-pdf-password';

export interface WatermarkProgress {
  currentFile: number;
  totalFiles: number;
  currentFileName: string;
  percentage: number;
  status: 'preparing' | 'processing' | 'saving' | 'complete';
}

export interface WatermarkResult {
  url: string;
  filename: string;
  pageCount: number;
}

export type WatermarkMode = 'text' | 'image';

export type WatermarkPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'middle-left'
  | 'center'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type WatermarkLayer = 'over' | 'below';

export interface TextSettings {
  text: string;
  fontSize: number;
  color: string; // hex color
  opacity: number; // 0-100
  rotation: number; // degrees: 0, 45, 90, 180, 270
  position: WatermarkPosition;
}

export interface ImageSettings {
  file: File | null;
  previewUrl: string;
  opacity: number; // 0-100
  rotation: number; // degrees: 0, 45, 90, 180, 270
  scale: number; // 0.1 to 2.0
  position: WatermarkPosition;
}

export interface CommonSettings {
  fromPage: number;
  toPage: number;
  layer: WatermarkLayer;
}

export function useWatermarkPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [mode, setMode] = useState<WatermarkMode>('text');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [result, setResult] = useState<WatermarkResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<WatermarkProgress | null>(null);

  // Text watermark settings
  const [textSettings, setTextSettings] = useState<TextSettings>({
    text: 'Watermark',
    fontSize: 48,
    color: '#000000',
    opacity: 50,
    rotation: 45,
    position: 'center',
  });

  // Image watermark settings
  const [imageSettings, setImageSettings] = useState<ImageSettings>({
    file: null,
    previewUrl: '',
    opacity: 50,
    rotation: 0,
    scale: 0.5,
    position: 'center',
  });

  // Common settings
  const [commonSettings, setCommonSettings] = useState<CommonSettings>({
    fromPage: 1,
    toPage: 1,
    layer: 'over',
  });

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
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();
      return { pdf: pdfDoc, pageCount };
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
        setIsSuccess(false);
        setResult(null);

        // Set default page range to all pages
        setCommonSettings({
          fromPage: 1,
          toPage: pageCount,
          layer: 'over',
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load PDF file.';
        setError(errorMessage);
      }
    },
    [validatePdfFile, loadPdfInfo, checkEncryption]
  );

  // Update text settings
  const updateTextSettings = useCallback(
    <K extends keyof TextSettings>(key: K, value: TextSettings[K]) => {
      setTextSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Update image settings
  const updateImageSettings = useCallback(
    <K extends keyof ImageSettings>(key: K, value: ImageSettings[K]) => {
      setImageSettings((prev) => {
        const updated = { ...prev, [key]: value };
        // If updating file, also update previewUrl
        if (key === 'file' && value) {
          const file = value as File;
          const url = URL.createObjectURL(file);
          return { ...updated, previewUrl: url };
        }
        return updated;
      });
    },
    []
  );

  // Update common settings
  const updateCommonSettings = useCallback(
    <K extends keyof CommonSettings>(key: K, value: CommonSettings[K]) => {
      setCommonSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Set mode
  const setWatermarkMode = useCallback((newMode: WatermarkMode) => {
    setMode(newMode);
  }, []);

  // Get position coordinates
  const getPositionCoordinates = useCallback(
    (position: WatermarkPosition, pageWidth: number, pageHeight: number, watermarkWidth: number, watermarkHeight: number) => {
      const margin = 20;
      let x = 0;
      let y = 0;

      switch (position) {
        case 'top-left':
          x = margin;
          y = pageHeight - watermarkHeight - margin;
          break;
        case 'top-center':
          x = (pageWidth - watermarkWidth) / 2;
          y = pageHeight - watermarkHeight - margin;
          break;
        case 'top-right':
          x = pageWidth - watermarkWidth - margin;
          y = pageHeight - watermarkHeight - margin;
          break;
        case 'middle-left':
          x = margin;
          y = (pageHeight - watermarkHeight) / 2;
          break;
        case 'center':
          x = (pageWidth - watermarkWidth) / 2;
          y = (pageHeight - watermarkHeight) / 2;
          break;
        case 'middle-right':
          x = pageWidth - watermarkWidth - margin;
          y = (pageHeight - watermarkHeight) / 2;
          break;
        case 'bottom-left':
          x = margin;
          y = margin;
          break;
        case 'bottom-center':
          x = (pageWidth - watermarkWidth) / 2;
          y = margin;
          break;
        case 'bottom-right':
          x = pageWidth - watermarkWidth - margin;
          y = margin;
          break;
      }

      return { x, y };
    },
    []
  );

  // Apply watermark
  const handleApplyWatermark = useCallback(async () => {
    if (!file) {
      setError('Please upload a PDF file first.');
      return;
    }

    // Validate settings
    if (mode === 'text' && !textSettings.text.trim()) {
      setError('Please enter watermark text.');
      return;
    }

    if (mode === 'image' && !imageSettings.file) {
      setError('Please upload an image file for watermark.');
      return;
    }

    // Validate page range
    if (commonSettings.fromPage < 1 || commonSettings.fromPage > pageCount) {
      setError(`From page must be between 1 and ${pageCount}.`);
      return;
    }

    if (commonSettings.toPage < 1 || commonSettings.toPage > pageCount) {
      setError(`To page must be between 1 and ${pageCount}.`);
      return;
    }

    if (commonSettings.fromPage > commonSettings.toPage) {
      setError('From page must be less than or equal to To page.');
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

      // Get pages to watermark
      const fromPageIndex = commonSettings.fromPage - 1; // Convert to 0-indexed
      const toPageIndex = commonSettings.toPage - 1;

      let font: PDFFont | null = null;
      let image: PDFImage | null = null;

      // Prepare watermark resources
      if (mode === 'text') {
        // Embed standard font
        font = await pdfDoc.embedFont('Helvetica');
      } else if (mode === 'image' && imageSettings.file) {
        // Embed image
        const imageBytes = await imageSettings.file.arrayBuffer();
        const imageType = imageSettings.file.type;

        if (imageType === 'image/png' || imageSettings.file.name.toLowerCase().endsWith('.png')) {
          image = await pdfDoc.embedPng(imageBytes);
        } else if (
          imageType === 'image/jpeg' ||
          imageType === 'image/jpg' ||
          imageSettings.file.name.toLowerCase().endsWith('.jpg') ||
          imageSettings.file.name.toLowerCase().endsWith('.jpeg')
        ) {
          image = await pdfDoc.embedJpg(imageBytes);
        } else {
          throw new Error('Unsupported image format. Please use PNG or JPG.');
        }
      }

      // Process each page
      const totalPages = toPageIndex - fromPageIndex + 1;
      
      // For "below" layer, process in reverse to avoid index shifting when removing/inserting pages
      const pagesToProcess: number[] = [];
      for (let i = fromPageIndex; i <= toPageIndex; i++) {
        pagesToProcess.push(i);
      }
      const processOrder = commonSettings.layer === 'below' ? pagesToProcess.reverse() : pagesToProcess;
      
      for (const pageIndex of processOrder) {
        const originalPage = pdfDoc.getPage(pageIndex);
        const { width, height } = originalPage.getSize();

        // Calculate position
        let watermarkWidth = 0;
        let watermarkHeight = 0;
        let x = 0;
        let y = 0;

        if (mode === 'text' && font) {
          // Calculate text dimensions
          const textWidth = font.widthOfTextAtSize(textSettings.text, textSettings.fontSize);
          const textHeight = textSettings.fontSize;
          watermarkWidth = textWidth;
          watermarkHeight = textHeight;

          const position = getPositionCoordinates(textSettings.position, width, height, watermarkWidth, watermarkHeight);
          x = position.x;
          y = position.y;
        } else if (mode === 'image' && image) {
          // Calculate image dimensions
          const imageDims = image.scale(imageSettings.scale);
          watermarkWidth = imageDims.width;
          watermarkHeight = imageDims.height;

          const position = getPositionCoordinates(imageSettings.position, width, height, watermarkWidth, watermarkHeight);
          x = position.x;
          y = position.y;
        }

        // Handle layer: "below" requires rendering page to image first
        if (commonSettings.layer === 'below') {
          // For "below" layer, we need to render the original page to an image,
          // then create a new page, draw watermark first, then draw the page image
          const pdfjsLib = await import('pdfjs-dist');
          
          // Set worker source for pdfjs-dist
          if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
            // Use fixed version to match package.json (5.4.449)
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.449/build/pdf.worker.min.mjs`;
          }

          // Load the PDF with pdfjs-dist
          const arrayBufferForRender = await file.arrayBuffer();
          const pdfjsDoc = await pdfjsLib.getDocument({ data: arrayBufferForRender }).promise;
          const pdfjsPage = await pdfjsDoc.getPage(pageIndex + 1); // pdfjs-dist uses 1-indexed
          const viewport = pdfjsPage.getViewport({ scale: 2.0 }); // Higher scale for better quality

          // Create canvas to render page
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          const context = canvas.getContext('2d');
          if (!context) {
            throw new Error('Failed to get canvas context');
          }

          // Render page to canvas
          await pdfjsPage.render({
            canvasContext: context,
            viewport: viewport,
            canvas: canvas,
          }).promise;

          // Convert canvas to image bytes
          const imageBytes = await new Promise<Uint8Array>((resolve, reject) => {
            canvas.toBlob((blob) => {
              if (!blob) {
                reject(new Error('Failed to create blob'));
                return;
              }
              blob.arrayBuffer().then((buf) => {
                resolve(new Uint8Array(buf));
              });
            }, 'image/png');
          });

          // Embed the rendered page as an image
          const pageImage = await pdfDoc.embedPng(imageBytes);

          // Create a new page (we'll replace the original)
          const newPage = pdfDoc.insertPage(pageIndex, [width, height]);
          // Remove the original page (now at pageIndex + 1)
          pdfDoc.removePage(pageIndex + 1);

          // Draw watermark first (below)
          if (mode === 'text' && font) {
            const colorHex = textSettings.color.replace('#', '');
            const r = parseInt(colorHex.substring(0, 2), 16) / 255;
            const g = parseInt(colorHex.substring(2, 4), 16) / 255;
            const b = parseInt(colorHex.substring(4, 6), 16) / 255;
            const opacity = textSettings.opacity / 100;

            newPage.drawText(textSettings.text, {
              x,
              y,
              size: textSettings.fontSize,
              font,
              color: rgb(r, g, b),
              opacity,
              rotate: degrees(textSettings.rotation),
            });
          } else if (mode === 'image' && image) {
            newPage.drawImage(image, {
              x,
              y,
              width: watermarkWidth,
              height: watermarkHeight,
              opacity: imageSettings.opacity / 100,
              rotate: degrees(imageSettings.rotation),
            });
          }

          // Draw the original page content on top
          newPage.drawImage(pageImage, {
            x: 0,
            y: 0,
            width: width,
            height: height,
          });

          // Cleanup canvas
          canvas.width = 0;
          canvas.height = 0;
        } else {
          // "over" layer: draw watermark on top of existing content
          const page = originalPage;

          if (mode === 'text' && font) {
            // Parse color
            const colorHex = textSettings.color.replace('#', '');
            const r = parseInt(colorHex.substring(0, 2), 16) / 255;
            const g = parseInt(colorHex.substring(2, 4), 16) / 255;
            const b = parseInt(colorHex.substring(4, 6), 16) / 255;
            const opacity = textSettings.opacity / 100;

            // Draw text watermark
            page.drawText(textSettings.text, {
              x,
              y,
              size: textSettings.fontSize,
              font,
              color: rgb(r, g, b),
              opacity,
              rotate: degrees(textSettings.rotation),
            });
          } else if (mode === 'image' && image) {
            // Draw image watermark
            page.drawImage(image, {
              x,
              y,
              width: watermarkWidth,
              height: watermarkHeight,
              opacity: imageSettings.opacity / 100,
              rotate: degrees(imageSettings.rotation),
            });
          }
        }

        // Update progress
        const processedCount = processOrder.indexOf(pageIndex) + 1;
        const progressPercent = 30 + (processedCount / totalPages) * 50;
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
      const filename = `${originalName}_watermarked.pdf`;

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
      const errorMessage = err instanceof Error ? err.message : 'Failed to apply watermark.';
      setError(errorMessage);
      setIsProcessing(false);
      setProgress(null);
    }
  }, [
    file,
    mode,
    textSettings,
    imageSettings,
    commonSettings,
    pageCount,
    isProcessing,
    getPositionCoordinates,
  ]);

  // Reset everything
  const handleReset = useCallback(() => {
    // Clean up blob URL
    if (result?.url) {
      URL.revokeObjectURL(result.url);
    }
    // Clean up image preview URL
    if (imageSettings.previewUrl) {
      URL.revokeObjectURL(imageSettings.previewUrl);
    }

    setFile(null);
    setPageCount(0);
    setMode('text');
    setIsProcessing(false);
    setIsSuccess(false);
    setResult(null);
    setError(null);
    setProgress(null);
    setTextSettings({
      text: 'Watermark',
      fontSize: 48,
      color: '#000000',
      opacity: 50,
      rotation: 45,
      position: 'center',
    });
    setImageSettings({
      file: null,
      previewUrl: '',
      opacity: 50,
      rotation: 0,
      scale: 0.5,
      position: 'center',
    });
    setCommonSettings({
      fromPage: 1,
      toPage: 1,
      layer: 'over',
    });
  }, [result, imageSettings.previewUrl]);

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
        setIsSuccess(false);
        setResult(null);

        // Set default page range to all pages
        setCommonSettings({
          fromPage: 1,
          toPage: pageCount,
          layer: 'over',
        });

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

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (result?.url) {
        URL.revokeObjectURL(result.url);
      }
      if (imageSettings.previewUrl) {
        URL.revokeObjectURL(imageSettings.previewUrl);
      }
    };
  }, [result, imageSettings.previewUrl]);

  return {
    file,
    pageCount,
    mode,
    textSettings,
    imageSettings,
    commonSettings,
    isProcessing,
    isSuccess,
    result,
    error,
    progress,
    handleUpload,
    setWatermarkMode,
    updateTextSettings,
    updateImageSettings,
    updateCommonSettings,
    handleApplyWatermark,
    handleReset,
    formatFileSize,
    // Password handling
    passwordPrompt,
    passwordError,
    handlePasswordSubmit,
    handlePasswordCancel,
  };
}

