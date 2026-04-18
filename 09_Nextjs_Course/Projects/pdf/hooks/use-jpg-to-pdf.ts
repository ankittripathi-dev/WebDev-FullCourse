'use client';

import { useState, useCallback, useEffect } from 'react';
import { PDFDocument, rgb, degrees } from 'pdf-lib';

export interface ImageFile {
  id: string;
  file: File;
  previewUrl: string;
  rotation: 0 | 90 | 180 | 270;
}

export interface JpgToPdfSettings {
  orientation: 'portrait' | 'landscape';
  pageSize: 'a4' | 'fit' | 'letter';
  margin: 'none' | 'small' | 'big';
  mergeOutput: boolean;
}

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

export function useJpgToPdf() {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [settings, setSettings] = useState<JpgToPdfSettings>({
    orientation: 'portrait',
    pageSize: 'a4',
    margin: 'none',
    mergeOutput: true,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [results, setResults] = useState<ConvertResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<ConvertProgress | null>(null);

  // Format file size
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }, []);

  // Maximum file size: 10MB per image
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  // Validate image file
  const validateImageFile = useCallback(
    (file: File): { valid: boolean; error?: string } => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

      const hasValidType = validTypes.includes(file.type);
      const hasValidExtension = validExtensions.some((ext) =>
        file.name.toLowerCase().endsWith(ext)
      );

      if (!hasValidType && !hasValidExtension) {
        return {
          valid: false,
          error: `Invalid file type. Only JPG, PNG, and WebP images are allowed.`,
        };
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

  // Get page dimensions based on size and orientation
  const getPageDimensions = useCallback(
    (pageSize: 'a4' | 'fit' | 'letter', orientation: 'portrait' | 'landscape') => {
      if (pageSize === 'fit') {
        return null; // Will use image dimensions
      }

      const dimensions = {
        a4: { width: 595.28, height: 841.89 }, // A4 in points (72 DPI)
        letter: { width: 612, height: 792 }, // US Letter in points
      };

      const { width, height } = dimensions[pageSize];
      return orientation === 'landscape' ? { width: height, height: width } : { width, height };
    },
    []
  );

  // Get margin size in points
  const getMarginSize = useCallback((margin: 'none' | 'small' | 'big'): number => {
    switch (margin) {
      case 'none':
        return 0;
      case 'small':
        return 20; // ~0.28 inches
      case 'big':
        return 40; // ~0.56 inches
      default:
        return 0;
    }
  }, []);

  // Rotate image on canvas and return as bytes
  const rotateImageOnCanvas = useCallback(
    async (
      file: File,
      rotation: 0 | 90 | 180 | 270
    ): Promise<{ bytes: Uint8Array; width: number; height: number }> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
              throw new Error('Could not get canvas context');
            }

            // Calculate dimensions after rotation
            let width = img.naturalWidth;
            let height = img.naturalHeight;

            if (rotation === 90 || rotation === 270) {
              [width, height] = [height, width];
            }

            canvas.width = width;
            canvas.height = height;

            // Translate to center, rotate, translate back
            ctx.translate(width / 2, height / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.translate(-img.naturalWidth / 2, -img.naturalHeight / 2);

            // Draw rotated image
            ctx.drawImage(img, 0, 0);

            // Convert canvas to blob, then to Uint8Array
            canvas.toBlob(
              (blob) => {
                URL.revokeObjectURL(url);
                if (!blob) {
                  reject(new Error('Failed to create blob from canvas'));
                  return;
                }
                blob.arrayBuffer().then((buffer) => {
                  resolve({
                    bytes: new Uint8Array(buffer),
                    width,
                    height,
                  });
                });
              },
              file.type || 'image/jpeg',
              0.95
            );
          } catch (error) {
            URL.revokeObjectURL(url);
            reject(error);
          }
        };

        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Failed to load image'));
        };

        img.src = url;
      });
    },
    []
  );

  // Add files
  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      setError(null);
      const fileArray = Array.from(newFiles);

      if (fileArray.length === 0) {
        return;
      }

      const validFiles: ImageFile[] = [];

      fileArray.forEach((file) => {
        const validation = validateImageFile(file);
        if (validation.valid) {
          const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const previewUrl = URL.createObjectURL(file);
          validFiles.push({
            id,
            file,
            previewUrl,
            rotation: 0,
          });
        } else {
          setError(validation.error || 'Invalid file.');
        }
      });

      if (validFiles.length > 0) {
        setFiles((prev) => [...prev, ...validFiles]);
      }
    },
    [validateImageFile]
  );

  // Remove file
  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  // Reorder files
  const reorderFiles = useCallback((newOrder: ImageFile[]) => {
    setFiles(newOrder);
  }, []);

  // Rotate file
  const rotateFile = useCallback((id: string) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const newRotation = ((f.rotation + 90) % 360) as 0 | 90 | 180 | 270;
          return { ...f, rotation: newRotation };
        }
        return f;
      })
    );
  }, []);

  // Update settings
  const updateSettings = useCallback(
    <K extends keyof JpgToPdfSettings>(key: K, value: JpgToPdfSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Handle convert
  const handleConvert = useCallback(async () => {
    if (files.length === 0) {
      setError('Please add at least one image file.');
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
      // Update progress: Preparing
      setProgress({
        currentFile: 0,
        totalFiles: files.length,
        currentFileName: '',
        percentage: 0,
        status: 'preparing',
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      if (settings.mergeOutput) {
        // Create single PDF with all images
        const pdfDoc = await PDFDocument.create();

        for (let i = 0; i < files.length; i++) {
          const imageFile = files[i];
          const percentage = Math.round(((i + 1) / files.length) * 90);

          setProgress({
            currentFile: i + 1,
            totalFiles: files.length,
            currentFileName: imageFile.file.name,
            percentage,
            status: 'processing',
          });

          await new Promise((resolve) => setTimeout(resolve, 100));

          // Read image file and apply rotation if needed
          let imageBytes: Uint8Array;
          let imageWidth: number;
          let imageHeight: number;

          if (imageFile.rotation !== 0) {
            // Rotate image on canvas before embedding
            const rotatedImageData = await rotateImageOnCanvas(imageFile.file, imageFile.rotation);
            imageBytes = rotatedImageData.bytes;
            imageWidth = rotatedImageData.width;
            imageHeight = rotatedImageData.height;
          } else {
            // Get dimensions from original image
            const arrayBuffer = await imageFile.file.arrayBuffer();
            imageBytes = new Uint8Array(arrayBuffer);
            const img = new Image();
            const url = URL.createObjectURL(imageFile.file);
            const dimensions = await new Promise<{ width: number; height: number }>(
              (resolve, reject) => {
                img.onload = () => {
                  const dims = {
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                  };
                  URL.revokeObjectURL(url);
                  resolve(dims);
                };
                img.onerror = () => {
                  URL.revokeObjectURL(url);
                  reject(new Error('Failed to load image'));
                };
                img.src = url;
              }
            );
            imageWidth = dimensions.width;
            imageHeight = dimensions.height;
          }

          // Embed image based on type
          let image;
          if (
            imageFile.file.type === 'image/png' ||
            imageFile.file.name.toLowerCase().endsWith('.png')
          ) {
            image = await pdfDoc.embedPng(imageBytes);
          } else {
            image = await pdfDoc.embedJpg(imageBytes);
          }

          const originalWidth = imageWidth;
          const originalHeight = imageHeight;

          // Create page
          let page;
          if (settings.pageSize === 'fit') {
            // Page size = rotated image dimensions
            page = pdfDoc.addPage([imageWidth, imageHeight]);
          } else {
            // Use predefined page size
            const dimensions = getPageDimensions(settings.pageSize, settings.orientation);
            if (!dimensions) {
              throw new Error('Invalid page dimensions');
            }
            page = pdfDoc.addPage([dimensions.width, dimensions.height]);
          }

          // Calculate scale and position
          const margin = getMarginSize(settings.margin);
          const pageWidth = page.getWidth();
          const pageHeight = page.getHeight();

          let scale = 1;
          let x = 0;
          let y = 0;

          if (settings.pageSize === 'fit') {
            // Full size, no scaling
            scale = 1;
            x = 0;
            y = 0;
          } else {
            // Scale to fit within page with margins
            const availableWidth = pageWidth - margin * 2;
            const availableHeight = pageHeight - margin * 2;

            const scaleX = availableWidth / imageWidth;
            const scaleY = availableHeight / imageHeight;
            scale = Math.min(scaleX, scaleY); // Preserve aspect ratio

            const scaledWidth = imageWidth * scale;
            const scaledHeight = imageHeight * scale;

            // Center the image
            x = (pageWidth - scaledWidth) / 2;
            y = (pageHeight - scaledHeight) / 2;
          }

          // Draw image (rotation already applied via canvas if needed)
          page.drawImage(image, {
            x,
            y,
            width: originalWidth * scale,
            height: originalHeight * scale,
          });
        }

        // Update progress: Saving
        setProgress({
          currentFile: files.length,
          totalFiles: files.length,
          currentFileName: 'merged.pdf',
          percentage: 95,
          status: 'saving',
        });

        await new Promise((resolve) => setTimeout(resolve, 500));

        // Save PDF
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        setResults([{ url, filename: 'merged.pdf' }]);
      } else {
        // Create separate PDFs for each image
        const newResults: ConvertResult[] = [];

        for (let i = 0; i < files.length; i++) {
          const imageFile = files[i];
          const percentage = Math.round(((i + 1) / files.length) * 90);

          setProgress({
            currentFile: i + 1,
            totalFiles: files.length,
            currentFileName: imageFile.file.name,
            percentage,
            status: 'processing',
          });

          await new Promise((resolve) => setTimeout(resolve, 100));

          // Create PDF for this image
          const pdfDoc = await PDFDocument.create();

          // Read image file and apply rotation if needed
          let imageBytes: Uint8Array;
          let imageWidth: number;
          let imageHeight: number;

          if (imageFile.rotation !== 0) {
            // Rotate image on canvas before embedding
            const rotatedImageData = await rotateImageOnCanvas(imageFile.file, imageFile.rotation);
            imageBytes = rotatedImageData.bytes;
            imageWidth = rotatedImageData.width;
            imageHeight = rotatedImageData.height;
          } else {
            // Get dimensions from original image
            const arrayBuffer = await imageFile.file.arrayBuffer();
            imageBytes = new Uint8Array(arrayBuffer);
            const img = new Image();
            const url = URL.createObjectURL(imageFile.file);
            const dimensions = await new Promise<{ width: number; height: number }>(
              (resolve, reject) => {
                img.onload = () => {
                  const dims = {
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                  };
                  URL.revokeObjectURL(url);
                  resolve(dims);
                };
                img.onerror = () => {
                  URL.revokeObjectURL(url);
                  reject(new Error('Failed to load image'));
                };
                img.src = url;
              }
            );
            imageWidth = dimensions.width;
            imageHeight = dimensions.height;
          }

          // Embed image
          let image;
          if (
            imageFile.file.type === 'image/png' ||
            imageFile.file.name.toLowerCase().endsWith('.png')
          ) {
            image = await pdfDoc.embedPng(imageBytes);
          } else {
            image = await pdfDoc.embedJpg(imageBytes);
          }

          const originalWidth = imageWidth;
          const originalHeight = imageHeight;

          // Create page
          let page;
          if (settings.pageSize === 'fit') {
            page = pdfDoc.addPage([imageWidth, imageHeight]);
          } else {
            const dimensions = getPageDimensions(settings.pageSize, settings.orientation);
            if (!dimensions) {
              throw new Error('Invalid page dimensions');
            }
            page = pdfDoc.addPage([dimensions.width, dimensions.height]);
          }

          // Calculate scale and position (same logic as merge)
          const margin = getMarginSize(settings.margin);
          const pageWidth = page.getWidth();
          const pageHeight = page.getHeight();

          let scale = 1;
          let x = 0;
          let y = 0;

          if (settings.pageSize === 'fit') {
            scale = 1;
            x = 0;
            y = 0;
          } else {
            const availableWidth = pageWidth - margin * 2;
            const availableHeight = pageHeight - margin * 2;

            const scaleX = availableWidth / imageWidth;
            const scaleY = availableHeight / imageHeight;
            scale = Math.min(scaleX, scaleY);

            const scaledWidth = imageWidth * scale;
            const scaledHeight = imageHeight * scale;

            x = (pageWidth - scaledWidth) / 2;
            y = (pageHeight - scaledHeight) / 2;
          }

          // Draw image (rotation already applied via canvas if needed)
          page.drawImage(image, {
            x,
            y,
            width: originalWidth * scale,
            height: originalHeight * scale,
          });

          // Save PDF
          const pdfBytes = await pdfDoc.save();
          const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);

          const fileName = imageFile.file.name.replace(/\.(jpg|jpeg|png|webp)$/i, '.pdf');
          newResults.push({ url, filename: fileName });
        }

        setResults(newResults);
      }

      // Update progress: Complete
      setProgress({
        currentFile: files.length,
        totalFiles: files.length,
        currentFileName: settings.mergeOutput ? 'merged.pdf' : `${files.length} files`,
        percentage: 100,
        status: 'complete',
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSuccess(true);
      setProgress(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred while converting images to PDF.';
      setError(errorMessage);
      setIsSuccess(false);
      setProgress(null);
    } finally {
      setIsProcessing(false);
    }
  }, [files, settings, isProcessing, getPageDimensions, getMarginSize, rotateImageOnCanvas]);

  // Reset everything
  const handleReset = useCallback(() => {
    // Clean up preview URLs
    files.forEach((file) => {
      URL.revokeObjectURL(file.previewUrl);
    });

    // Clean up result URLs
    results.forEach((result) => {
      URL.revokeObjectURL(result.url);
    });

    setFiles([]);
    setSettings({
      orientation: 'portrait',
      pageSize: 'a4',
      margin: 'none',
      mergeOutput: true,
    });
    setIsProcessing(false);
    setIsSuccess(false);
    setResults([]);
    setError(null);
    setProgress(null);
  }, [files, results]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach((file) => {
        URL.revokeObjectURL(file.previewUrl);
      });
      results.forEach((result) => {
        URL.revokeObjectURL(result.url);
      });
    };
  }, [files, results]);

  return {
    files,
    settings,
    isProcessing,
    isSuccess,
    results,
    error,
    progress,
    addFiles,
    removeFile,
    reorderFiles,
    rotateFile,
    updateSettings,
    handleConvert,
    handleReset,
    formatFileSize,
  };
}
