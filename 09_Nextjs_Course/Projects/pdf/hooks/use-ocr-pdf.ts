'use client';

import { useState, useCallback, useEffect } from 'react';
import { createWorker } from 'tesseract.js';
import { usePdfPassword } from './use-pdf-password';

export interface OcrProgress {
  status: string;
  progress: number;
  currentPage?: number;
  totalPages?: number;
}

export interface OcrResult {
  text: string;
  textUrl: string;
  filename: string;
}

export type OcrStatus = 'idle' | 'processing' | 'success' | 'error';

// Common languages for OCR
export const OCR_LANGUAGES = [
  { code: 'eng', name: 'English', flag: '🇺🇸' },
  { code: 'spa', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fra', name: 'French', flag: '🇫🇷' },
  { code: 'deu', name: 'German', flag: '🇩🇪' },
  { code: 'ita', name: 'Italian', flag: '🇮🇹' },
  { code: 'por', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'rus', name: 'Russian', flag: '🇷🇺' },
  { code: 'chi_sim', name: 'Chinese (Simplified)', flag: '🇨🇳' },
  { code: 'jpn', name: 'Japanese', flag: '🇯🇵' },
  { code: 'kor', name: 'Korean', flag: '🇰🇷' },
  { code: 'ara', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hin', name: 'Hindi', flag: '🇮🇳' },
  { code: 'nld', name: 'Dutch', flag: '🇳🇱' },
  { code: 'pol', name: 'Polish', flag: '🇵🇱' },
  { code: 'tur', name: 'Turkish', flag: '🇹🇷' },
  { code: 'vie', name: 'Vietnamese', flag: '🇻🇳' },
];

export function useOcrPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['eng']);
  const [ocrStatus, setOcrStatus] = useState<OcrStatus>('idle');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [result, setResult] = useState<OcrResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ocrProgress, setOcrProgress] = useState<OcrProgress | null>(null);

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
      const pdfjsLib = await import('pdfjs-dist');

      // Set worker source
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      }

      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pages = pdf.numPages;
      return { pdf, pageCount: pages };
    } catch (err) {
      throw new Error('Failed to load PDF. The file may be corrupted or encrypted.');
    }
  }, []);

  // Convert PDF page to canvas - Returns canvas element (more reliable for Tesseract)
  const pdfPageToCanvas = useCallback(
    async (pdf: any, pageNumber: number): Promise<HTMLCanvasElement> => {
      try {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better OCR accuracy

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (!context) {
          throw new Error('Failed to get canvas context');
        }

        // Render page to canvas
        const renderTask = page.render({
          canvasContext: context,
          viewport: viewport,
          canvas: canvas,
        });

        await renderTask.promise;

        return canvas;
      } catch (error) {
        throw new Error(
          `Failed to render PDF page: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
    []
  );

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
        setOcrStatus('idle');
        setIsSuccess(false);
        setResult(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load PDF file.';
        setError(errorMessage);
        setOcrStatus('error');
      }
    },
    [validatePdfFile, loadPdfInfo]
  );

  // Add language
  const addLanguage = useCallback((code: string) => {
    setSelectedLanguages((prev) => {
      if (prev.includes(code)) return prev;
      return [...prev, code];
    });
  }, []);

  // Remove language
  const removeLanguage = useCallback((code: string) => {
    setSelectedLanguages((prev) => {
      const filtered = prev.filter((lang) => lang !== code);
      // Ensure at least one language is selected
      return filtered.length > 0 ? filtered : ['eng'];
    });
  }, []);

  // Handle OCR
  const handleOCR = useCallback(async () => {
    if (!file) {
      setError('Please upload a PDF file first.');
      return;
    }

    // Validate page count
    if (pageCount === 0) {
      setError('The PDF file has no pages. Please upload a valid PDF file.');
      return;
    }

    // Validate languages
    if (selectedLanguages.length === 0) {
      setError('Please select at least one language.');
      return;
    }

    // Prevent multiple simultaneous operations
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);
    setOcrStatus('processing');
    setError(null);
    setResult(null);
    setOcrProgress({
      status: 'Initializing...',
      progress: 0,
      currentPage: 0,
      totalPages: pageCount,
    });

    let worker: any = null;
    const allText: string[] = [];

    try {
      // Load PDF
      const pdfjsLib = await import('pdfjs-dist');

      // Set worker source
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      }

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      // Update progress: Loading language data
      const languageString = selectedLanguages.join('+');
      setOcrProgress({
        status: `Loading language data (${languageString})...`,
        progress: 5,
        currentPage: 0,
        totalPages: pageCount,
      });

      // Initialize Tesseract worker
      worker = await createWorker(languageString);

      // Process each page
      for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
        // Update progress: Processing page
        setOcrProgress({
          status: `Scanning Page ${pageNum} of ${pageCount}...`,
          progress: Math.round((pageNum / pageCount) * 85) + 5, // 5-90%
          currentPage: pageNum,
          totalPages: pageCount,
        });

        try {
          // Convert PDF page to canvas (more reliable than ImageData)
          let canvas: HTMLCanvasElement;
          try {
            canvas = await pdfPageToCanvas(pdf, pageNum);
          } catch (conversionError) {
            // If conversion fails, skip this page
            allText.push(`--- Page ${pageNum} ---\n[Error: Could not convert page to image]\n`);
            continue; // Skip to next page
          }

          // Run OCR on the canvas using blob URL (most reliable method)
          let ocrResult: any = null;
          let recognitionSucceeded = false;

          try {
            // Convert canvas to blob URL (most compatible with Tesseract)
            const blob = await new Promise<Blob>((resolve, reject) => {
              canvas.toBlob(
                (blob) => {
                  if (blob) {
                    resolve(blob);
                  } else {
                    reject(new Error('Failed to convert canvas to blob'));
                  }
                },
                'image/png',
                1.0 // Maximum quality
              );
            });

            const blobUrl = URL.createObjectURL(blob);
            try {
              // Use blob URL - this is the most reliable method for Tesseract
              ocrResult = await worker.recognize(blobUrl);
              recognitionSucceeded = true;
            } catch (blobError: any) {
              // If blob URL fails, try canvas directly as fallback
              try {
                ocrResult = await worker.recognize(canvas);
                recognitionSucceeded = true;
              } catch (canvasError) {
                // Both methods failed
                recognitionSucceeded = false;
                // Don't throw - just mark as failed
              }
            } finally {
              URL.revokeObjectURL(blobUrl);
            }
          } catch (error: any) {
            // Catch any other errors in the recognition process
            recognitionSucceeded = false;
            // Don't throw - just mark as failed
          }

          // Only process result if recognition succeeded
          if (recognitionSucceeded && ocrResult && ocrResult.data && ocrResult.data.text) {
            const { data } = ocrResult;
            // Add page text to results
            allText.push(`--- Page ${pageNum} ---\n${data.text}\n`);
          } else {
            // Recognition failed - add error message
            allText.push(
              `--- Page ${pageNum} ---\n[Error: Could not extract text from this page]\n`
            );
          }
        } catch (pageError: any) {
          // Silently handle page errors - catch all errors to prevent React runtime errors
          // Suppress all errors completely - don't log, don't throw, just continue
          allText.push(`--- Page ${pageNum} ---\n[Error: Could not extract text from this page]\n`);
          // Continue processing other pages - suppress error completely
        }
      }

      // Terminate worker
      if (worker) {
        await worker.terminate();
        worker = null;
      }

      // Update progress: Generating text file
      setOcrProgress({
        status: 'Generating text file...',
        progress: 95,
        currentPage: pageCount,
        totalPages: pageCount,
      });

      // Combine all text
      const extractedText = allText.join('\n');

      // Create text file
      const textBlob = new Blob([extractedText], { type: 'text/plain' });
      const textUrl = URL.createObjectURL(textBlob);

      // Update progress: Complete
      setOcrProgress({
        status: 'Complete',
        progress: 100,
        currentPage: pageCount,
        totalPages: pageCount,
      });

      // Show 100% completion for 1s before transitioning to success
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setResult({
        text: extractedText,
        textUrl,
        filename: 'extracted-text.txt',
      });
      setOcrStatus('success');
      setIsSuccess(true);
      setOcrProgress(null);
    } catch (err) {
      // Terminate worker if it exists
      if (worker) {
        try {
          await worker.terminate();
        } catch (terminateError) {
          console.error('Error terminating worker:', terminateError);
        }
        worker = null;
      }

      // Check if we have partial results - if so, save them instead of showing error
      if (allText && allText.length > 0) {
        // We have partial results, save them as success
        const extractedText = allText.join('\n');
        const textBlob = new Blob([extractedText], { type: 'text/plain' });
        const textUrl = URL.createObjectURL(textBlob);

        setResult({
          text: extractedText,
          textUrl,
          filename: 'extracted-text.txt',
        });
        setOcrStatus('success');
        setIsSuccess(true);
        setOcrProgress(null);
        setError(null); // Clear error since we have partial success
      } else {
        // No results at all, show error
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'An error occurred while performing OCR. Please try again.';
        setError(errorMessage);
        setOcrStatus('error');
        setIsSuccess(false);
        setOcrProgress(null);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [file, pageCount, selectedLanguages, isProcessing, pdfPageToCanvas]);

  // Reset everything (full reset)
  const handleReset = useCallback(() => {
    // Clean up blob URL
    if (result?.textUrl) {
      URL.revokeObjectURL(result.textUrl);
    }

    setFile(null);
    setPageCount(0);
    setSelectedLanguages(['eng']);
    setOcrStatus('idle');
    setIsProcessing(false);
    setIsSuccess(false);
    setResult(null);
    setError(null);
    setOcrProgress(null);
  }, [result]);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (result?.textUrl) {
        URL.revokeObjectURL(result.textUrl);
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
        setOcrStatus('idle');
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
    selectedLanguages,
    ocrStatus,
    isProcessing,
    isSuccess,
    result,
    extractedText: result?.text || '',
    error,
    ocrProgress,
    handleUpload,
    addLanguage,
    removeLanguage,
    handleOCR,
    handleReset,
    formatFileSize,
    // Password handling
    passwordPrompt,
    passwordError,
    handlePasswordSubmit,
    handlePasswordCancel,
  };
}

// Suppress unhandled promise rejections from Tesseract
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && typeof event.reason === 'object') {
      const errorMessage = event.reason.message || String(event.reason);
      if (
        errorMessage.includes('read image') ||
        errorMessage.includes('readImage') ||
        errorMessage.includes('Error attempting to read image')
      ) {
        // Suppress Tesseract image reading errors
        event.preventDefault();
        console.warn('Suppressed Tesseract error:', errorMessage);
      }
    }
  });
}
