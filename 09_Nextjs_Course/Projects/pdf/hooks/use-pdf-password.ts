'use client';

import { useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';

/**
 * Utility hook for handling password-protected PDFs
 * Provides functions to check encryption and unlock PDFs
 */
export function usePdfPassword() {
  // Check if PDF is encrypted
  const checkEncryption = useCallback(async (pdfFile: File): Promise<boolean> => {
    try {
      // Dynamically import pdfjs-dist to avoid SSR issues
      const pdfjsLib = await import('pdfjs-dist');

      // Set worker source for pdfjs-dist
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      }

      const arrayBuffer = await pdfFile.arrayBuffer();
      // Try to load without password
      await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      // If successful, file is not encrypted
      return false;
    } catch (err) {
      // Check if error is related to encryption
      const errorMessage = err instanceof Error ? err.message.toLowerCase() : '';
      const isEncrypted =
        errorMessage.includes('encrypted') ||
        errorMessage.includes('password') ||
        errorMessage.includes('security handler') ||
        errorMessage.includes('encryption') ||
        errorMessage.includes('needs password');

      return isEncrypted;
    }
  }, []);

  // Unlock PDF with password and return unlocked File
  const unlockPdf = useCallback(async (pdfFile: File, password: string): Promise<File> => {
    try {
      // Dynamically import pdfjs-dist to avoid SSR issues
      const pdfjsLib = await import('pdfjs-dist');

      // Set worker source for pdfjs-dist
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      }

      const arrayBuffer = await pdfFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        password: password,
      });

      const pdf = await loadingTask.promise;
      const pageCount = pdf.numPages;

      // Convert to pdf-lib format by rendering pages
      const pdfDoc = await PDFDocument.create();

      for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.0 });

        // Create canvas to render page
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

        // Convert canvas to image and embed in pdf-lib
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

        // Add page to PDF
        const pdfPage = pdfDoc.addPage([viewport.width, viewport.height]);
        const image = await pdfDoc.embedPng(imageBytes);
        pdfPage.drawImage(image, {
          x: 0,
          y: 0,
          width: viewport.width,
          height: viewport.height,
        });

        // Cleanup canvas
        canvas.width = 0;
        canvas.height = 0;
      }

      // Save unlocked PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], {
        type: 'application/pdf',
      });

      // Create new File object with unlocked content
      const unlockedFile = new File([blob], pdfFile.name, { type: 'application/pdf' });
      return unlockedFile;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message.toLowerCase() : '';
      if (
        errorMessage.includes('encrypted') ||
        errorMessage.includes('password') ||
        errorMessage.includes('incorrect password') ||
        errorMessage.includes('needs password')
      ) {
        throw new Error('INCORRECT_PASSWORD');
      }
      throw new Error('Failed to unlock PDF. The password may be incorrect.');
    }
  }, []);

  // Load PDF with password using pdfjs-dist (for getting page count, etc.)
  const loadPdfWithPassword = useCallback(async (pdfFile: File, password: string) => {
    try {
      // Dynamically import pdfjs-dist to avoid SSR issues
      const pdfjsLib = await import('pdfjs-dist');

      // Set worker source for pdfjs-dist
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      }

      const arrayBuffer = await pdfFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        password: password,
      });

      const pdf = await loadingTask.promise;
      const pageCount = pdf.numPages;

      return { pdf, pageCount };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message.toLowerCase() : '';
      if (
        errorMessage.includes('encrypted') ||
        errorMessage.includes('password') ||
        errorMessage.includes('incorrect password') ||
        errorMessage.includes('needs password')
      ) {
        throw new Error('INCORRECT_PASSWORD');
      }
      throw new Error('Failed to load PDF. The password may be incorrect.');
    }
  }, []);

  return {
    checkEncryption,
    unlockPdf,
    loadPdfWithPassword,
  };
}
