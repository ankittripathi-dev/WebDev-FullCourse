'use client';

import { useState, useCallback, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import { usePdfPassword } from './use-pdf-password';

export interface PageItem {
  pageIndex: number; // 0-indexed
  rotation: 0 | 90 | 180 | 270;
  included: boolean;
}

export type ConversionMode = 'convert_pages' | 'extract_images';
export type ImageQuality = 'normal' | 'high';

export interface ConvertProgress {
  currentFile: number;
  totalFiles: number;
  currentFileName: string;
  percentage: number;
  status: 'preparing' | 'processing' | 'saving' | 'complete';
}

export interface ConvertResult {
  url: string;
  filename: string;
}

export function usePdfToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [conversionMode, setConversionMode] = useState<ConversionMode>('convert_pages');
  const [imageQuality, setImageQuality] = useState<ImageQuality>('normal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [result, setResult] = useState<ConvertResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<ConvertProgress | null>(null);

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

  // Validate PDF file
  const validatePdfFile = useCallback((file: File): { valid: boolean; error?: string } => {
    const validTypes = ['application/pdf'];
    const validExtensions = ['.pdf'];

    const hasValidType = validTypes.includes(file.type);
    const hasValidExtension = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!hasValidType && !hasValidExtension) {
      return {
        valid: false,
        error: `Invalid file type. Only PDF files are allowed.`,
      };
    }

    if (file.size === 0) {
      return { valid: false, error: `File "${file.name}" is empty.` };
    }

    return { valid: true };
  }, []);

  // Load PDF and get page count
  const loadPdfInfo = useCallback(async (pdfFile: File) => {
    try {
      const pdfjsLib = await import('pdfjs-dist');

      // Set worker source
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      }

      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pageCount = pdf.numPages;
      return { pdf, pageCount };
    } catch (err) {
      throw new Error('Failed to load PDF. The file may be corrupted or encrypted.');
    }
  }, []);

  // Initialize pages array
  const initializePages = useCallback((pageCount: number): PageItem[] => {
    return Array.from({ length: pageCount }, (_, i) => ({
      pageIndex: i,
      rotation: 0,
      included: true,
    }));
  }, []);

  // Handle file upload
  const handleUpload = useCallback(
    async (uploadedFile: File) => {
      setError(null);

      const validation = validatePdfFile(uploadedFile);
      if (!validation.valid) {
        setError(validation.error || 'Invalid file.');
        return;
      }

      try {
        // Check if file is encrypted
        const isEncrypted = await checkEncryption(uploadedFile);

        if (isEncrypted) {
          // Show password prompt
          setPasswordPrompt({ open: true, file: uploadedFile });
          return;
        }

        const { pageCount } = await loadPdfInfo(uploadedFile);

        if (pageCount === 0) {
          setError('The PDF file has no pages. Please upload a valid PDF file.');
          return;
        }

        setFile(uploadedFile);
        setPageCount(pageCount);
        setPages(initializePages(pageCount));
        setIsSuccess(false);
        setResult(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to load PDF. The file may be corrupted or encrypted.';
        setError(errorMessage);
      }
    },
    [validatePdfFile, loadPdfInfo, initializePages]
  );

  // Rotate page
  const rotatePage = useCallback((index: number) => {
    setPages((prev) =>
      prev.map((page, i) => {
        if (i === index) {
          const newRotation = ((page.rotation + 90) % 360) as 0 | 90 | 180 | 270;
          return { ...page, rotation: newRotation };
        }
        return page;
      })
    );
  }, []);

  // Reorder pages
  const reorderPages = useCallback((newOrder: PageItem[]) => {
    setPages(newOrder);
  }, []);

  // Toggle page inclusion
  const togglePageInclusion = useCallback((index: number) => {
    setPages((prev) =>
      prev.map((page, i) => {
        if (i === index) {
          return { ...page, included: !page.included };
        }
        return page;
      })
    );
  }, []);

  // Convert PDF pages to JPG
  const convertPagesToJpg = useCallback(
    async (
      pdfFile: File,
      pages: PageItem[],
      quality: ImageQuality,
      onProgress?: (current: number, total: number, fileName: string) => void
    ): Promise<Blob> => {
      const pdfjsLib = await import('pdfjs-dist');

      // Set worker source
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      }

      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      // Quality settings
      const qualityValue = quality === 'normal' ? 0.75 : 0.95;
      const scale = quality === 'normal' ? 1.5 : 2.5;

      // Get included pages in order
      const includedPages = pages.filter((p) => p.included);

      // Load JSZip dynamically
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      for (let i = 0; i < includedPages.length; i++) {
        const pageItem = includedPages[i];
        const pageNumber = pageItem.pageIndex + 1; // Convert to 1-indexed

        // Update progress
        if (onProgress) {
          onProgress(i + 1, includedPages.length, `page-${i + 1}.jpg`);
        }

        // Get page
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale });

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error('Failed to get canvas context');
        }

        // Render page to canvas
        await page.render({
          canvasContext: context,
          viewport: viewport,
          canvas: canvas,
        }).promise;

        // Apply rotation if needed
        if (pageItem.rotation !== 0) {
          const rotatedCanvas = document.createElement('canvas');
          let rotatedWidth = canvas.width;
          let rotatedHeight = canvas.height;

          // Swap dimensions for 90/270 degree rotations
          if (pageItem.rotation === 90 || pageItem.rotation === 270) {
            [rotatedWidth, rotatedHeight] = [rotatedHeight, rotatedWidth];
          }

          rotatedCanvas.width = rotatedWidth;
          rotatedCanvas.height = rotatedHeight;

          const rotatedContext = rotatedCanvas.getContext('2d');
          if (!rotatedContext) {
            throw new Error('Failed to get rotated canvas context');
          }

          // Translate to center, rotate, translate back
          rotatedContext.translate(rotatedWidth / 2, rotatedHeight / 2);
          rotatedContext.rotate((pageItem.rotation * Math.PI) / 180);
          rotatedContext.translate(-canvas.width / 2, -canvas.height / 2);

          // Draw rotated image
          rotatedContext.drawImage(canvas, 0, 0);

          // Convert to blob
          const blob = await new Promise<Blob>((resolve, reject) => {
            rotatedCanvas.toBlob(
              (b) => {
                if (b) resolve(b);
                else reject(new Error('Failed to create blob'));
              },
              'image/jpeg',
              qualityValue
            );
          });

          // Add to zip
          zip.file(`page-${i + 1}.jpg`, blob);

          // Cleanup canvases
          canvas.width = 0;
          canvas.height = 0;
          rotatedCanvas.width = 0;
          rotatedCanvas.height = 0;
        } else {
          // Convert to blob without rotation
          const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
              (b) => {
                if (b) resolve(b);
                else reject(new Error('Failed to create blob'));
              },
              'image/jpeg',
              qualityValue
            );
          });

          // Add to zip
          zip.file(`page-${i + 1}.jpg`, blob);

          // Cleanup canvas
          canvas.width = 0;
          canvas.height = 0;
        }

        // Small delay to allow UI to update
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      // Generate zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      return zipBlob;
    },
    []
  );

  // Extract images from PDF
  const extractImagesFromPdf = useCallback(async (pdfFile: File): Promise<Blob> => {
    const pdfjsLib = await import('pdfjs-dist');

    // Set worker source
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    }

    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    // Load JSZip dynamically
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    const pageCount = pdf.numPages;
    let imageIndex = 0;

    // Extract images from each page
    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const ops = await page.getOperatorList();

      // Look for image operators
      // Note: pdfjs-dist operator codes may vary by version
      // Using string comparison for compatibility
      for (let i = 0; i < ops.fnArray.length; i++) {
        const op = ops.fnArray[i];
        const args = ops.argsArray[i];

        try {
          // Check for image rendering operators
          // OPS codes: 79 = Do (paintImageXObject), 80 = BI (beginInlineImage)
          const opValue = op as number | string;
          const isImageOp =
            opValue === 79 ||
            opValue === 80 ||
            (typeof opValue === 'string' &&
              (opValue.includes('Image') || opValue.includes('Do') || opValue.includes('BI')));

          if (isImageOp && args && args.length > 0) {
            // Get image object name (for Do operator)
            const imageName = args[0];

            if (imageName) {
              try {
                const imageObj = await page.objs.get(imageName);

                if (imageObj && imageObj.data) {
                  // Determine image type
                  const imageData = imageObj.data;
                  let extension = 'jpg';
                  let mimeType = 'image/jpeg';

                  // Try to detect image type from data
                  if (imageData instanceof Uint8Array) {
                    // Check for PNG signature
                    if (imageData[0] === 0x89 && imageData[1] === 0x50) {
                      extension = 'png';
                      mimeType = 'image/png';
                    }
                    // Check for JPEG signature
                    else if (imageData[0] === 0xff && imageData[1] === 0xd8) {
                      extension = 'jpg';
                      mimeType = 'image/jpeg';
                    }
                  }

                  const blob = new Blob([imageData], { type: mimeType });
                  imageIndex++;
                  zip.file(`image-${imageIndex}.${extension}`, blob);
                }
              } catch (objErr) {
                // Skip images that can't be extracted
                console.warn(`Failed to extract image object from page ${pageNum}:`, objErr);
              }
            }
          }
        } catch (err) {
          // Skip individual image extraction errors
          console.warn(`Error processing operator on page ${pageNum}:`, err);
        }
      }
    }

    // If no images found, throw error
    if (imageIndex === 0) {
      throw new Error('No images found in the PDF. This PDF may not contain embedded images.');
    }

    // Generate zip file
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    return zipBlob;
  }, []);

  // Handle convert
  const handleConvert = useCallback(async () => {
    if (!file) {
      setError('Please upload a PDF file first.');
      return;
    }

    if (pageCount === 0) {
      setError('The PDF file has no pages. Please upload a valid PDF file.');
      return;
    }

    // Check if any pages are included
    if (conversionMode === 'convert_pages') {
      const includedCount = pages.filter((p) => p.included).length;
      if (includedCount === 0) {
        setError('Please include at least one page to convert.');
        return;
      }
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
        totalFiles: conversionMode === 'convert_pages' ? pages.filter((p) => p.included).length : 1,
        currentFileName: file.name,
        percentage: 0,
        status: 'preparing',
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      let zipBlob: Blob;

      if (conversionMode === 'convert_pages') {
        // Convert pages to JPG
        const includedCount = pages.filter((p) => p.included).length;

        setProgress({
          currentFile: 0,
          totalFiles: includedCount,
          currentFileName: file.name,
          percentage: 10,
          status: 'processing',
        });

        await new Promise((resolve) => setTimeout(resolve, 300));

        // Convert with progress updates
        zipBlob = await convertPagesToJpg(file, pages, imageQuality, (current, total, fileName) => {
          const percentage = Math.round((current / total) * 90) + 10; // 10-100%
          setProgress({
            currentFile: current,
            totalFiles: total,
            currentFileName: fileName,
            percentage,
            status: 'processing',
          });
        });

        setProgress({
          currentFile: includedCount,
          totalFiles: includedCount,
          currentFileName: 'pages.zip',
          percentage: 95,
          status: 'saving',
        });
      } else {
        // Extract images
        setProgress({
          currentFile: 0,
          totalFiles: 1,
          currentFileName: file.name,
          percentage: 10,
          status: 'processing',
        });

        await new Promise((resolve) => setTimeout(resolve, 300));

        zipBlob = await extractImagesFromPdf(file);

        setProgress({
          currentFile: 1,
          totalFiles: 1,
          currentFileName: 'images.zip',
          percentage: 95,
          status: 'saving',
        });
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      // Create download URL
      const url = URL.createObjectURL(zipBlob);
      const filename = conversionMode === 'convert_pages' ? 'pages.zip' : 'images.zip';

      setResult({ url, filename });

      // Update progress: Complete
      setProgress({
        currentFile:
          conversionMode === 'convert_pages' ? pages.filter((p) => p.included).length : 1,
        totalFiles: conversionMode === 'convert_pages' ? pages.filter((p) => p.included).length : 1,
        currentFileName: filename,
        percentage: 100,
        status: 'complete',
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSuccess(true);
      setProgress(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred while converting PDF to JPG.';
      setError(errorMessage);
      setIsSuccess(false);
      setProgress(null);
    } finally {
      setIsProcessing(false);
    }
  }, [
    file,
    pageCount,
    pages,
    conversionMode,
    imageQuality,
    isProcessing,
    convertPagesToJpg,
    extractImagesFromPdf,
    setProgress,
  ]);

  // Reset everything
  const handleReset = useCallback(() => {
    // Clean up result URL
    if (result) {
      URL.revokeObjectURL(result.url);
    }

    setFile(null);
    setPageCount(0);
    setPages([]);
    setConversionMode('convert_pages');
    setImageQuality('normal');
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
        setPages(initializePages(pageCount));
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
    conversionMode,
    imageQuality,
    isProcessing,
    isSuccess,
    result,
    error,
    progress,
    handleUpload,
    rotatePage,
    reorderPages,
    togglePageInclusion,
    setConversionMode,
    setImageQuality,
    handleConvert,
    handleReset,
    formatFileSize,
    // Password handling
    passwordPrompt,
    passwordError,
    handlePasswordSubmit,
    handlePasswordCancel,
  };
}
