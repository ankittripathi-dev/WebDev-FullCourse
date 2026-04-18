'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import { usePdfPassword } from './use-pdf-password';

export type SplitMode = 'range' | 'pages' | 'size';

export interface RangeItem {
  from: number;
  to: number;
}

export interface RangeConfig {
  mode: 'custom' | 'fixed';
  customRanges: RangeItem[]; // e.g., [{from: 1, to: 5}, {from: 7, to: 10}]
  fixedStep: number; // Split every X pages
}

export interface PagesConfig {
  mode: 'all' | 'select';
  selectedPages: number[]; // Page numbers (1-indexed)
  mergeOutput: boolean; // If true, merge selected pages into one PDF
}

export interface SizeConfig {
  maxSize: number; // Maximum size in bytes
  unit: 'KB' | 'MB';
  allowCompression: boolean;
}

export interface SplitResult {
  url: string;
  filename: string;
  pageCount: number;
}

export interface SplitProgress {
  currentFile: number;
  totalFiles: number;
  currentFileName: string;
  percentage: number;
  status: 'preparing' | 'processing' | 'saving' | 'complete';
}

export function useSplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [splitMode, setSplitMode] = useState<SplitMode>('range');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [splitResults, setSplitResults] = useState<SplitResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<SplitProgress | null>(null);

  // Password handling
  const { checkEncryption, unlockPdf, loadPdfWithPassword } = usePdfPassword();
  const [passwordPrompt, setPasswordPrompt] = useState<{
    open: boolean;
    file: File | null;
  }>({ open: false, file: null });
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Mode-specific configs
  const [rangeConfig, setRangeConfig] = useState<RangeConfig>({
    mode: 'custom',
    customRanges: [{ from: 1, to: 1 }],
    fixedStep: 5,
  });

  const [pagesConfig, setPagesConfig] = useState<PagesConfig>({
    mode: 'all',
    selectedPages: [],
    mergeOutput: false,
  });

  const [sizeConfig, setSizeConfig] = useState<SizeConfig>({
    maxSize: 1024, // 1MB default
    unit: 'MB',
    allowCompression: false,
  });

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
        setSplitResults([]);

        // Auto-set default max size based on file size (80% of original, rounded)
        const fileSizeBytes = selectedFile.size;
        const fileSizeKB = fileSizeBytes / 1024;
        const fileSizeMB = fileSizeBytes / (1024 * 1024);

        if (fileSizeMB < 1) {
          // File is less than 1MB, use KB
          // Calculate 80% and round to nearest integer
          const defaultMaxSizeKB = Math.max(1, Math.round(fileSizeKB * 0.8));
          setSizeConfig({
            maxSize: defaultMaxSizeKB,
            unit: 'KB',
            allowCompression: false,
          });
        } else {
          // File is 1MB or larger, use MB
          // Calculate 80% and round to 1 decimal place
          const defaultMaxSizeMB = Math.max(0.1, Math.round(fileSizeMB * 0.8 * 10) / 10);
          setSizeConfig({
            maxSize: defaultMaxSizeMB,
            unit: 'MB',
            allowCompression: false,
          });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load PDF file.';
        setError(errorMessage);
      }
    },
    [validatePdfFile, loadPdfInfo]
  );

  // Parse range string (e.g., "1-5" or "7")
  const parseRange = useCallback((rangeStr: string): number[] => {
    const trimmed = rangeStr.trim();
    if (!trimmed) return [];

    // Single page (e.g., "5")
    if (!trimmed.includes('-')) {
      const page = parseInt(trimmed, 10);
      if (isNaN(page) || page < 1) return [];
      return [page];
    }

    // Range (e.g., "1-5")
    const [start, end] = trimmed.split('-').map((s) => parseInt(s.trim(), 10));
    if (isNaN(start) || isNaN(end) || start < 1 || end < start) return [];

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }, []);

  // Split by Range
  const splitByRange = useCallback(
    async (pdfFile: File): Promise<SplitResult[]> => {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const results: SplitResult[] = [];

      if (rangeConfig.mode === 'fixed') {
        // Fixed step: Split every X pages
        const step = rangeConfig.fixedStep;
        let currentPage = 1;

        while (currentPage <= pageCount) {
          const endPage = Math.min(currentPage + step - 1, pageCount);
          const newPdf = await PDFDocument.create();
          const pages = await newPdf.copyPages(
            sourcePdf,
            Array.from({ length: endPage - currentPage + 1 }, (_, i) => currentPage + i - 1)
          );
          pages.forEach((page) => newPdf.addPage(page));

          const pdfBytes = await newPdf.save();
          const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);

          results.push({
            url,
            filename: `pages-${currentPage}-${endPage}.pdf`,
            pageCount: endPage - currentPage + 1,
          });

          currentPage = endPage + 1;
        }
      } else {
        // Custom ranges
        for (let i = 0; i < rangeConfig.customRanges.length; i++) {
          const range = rangeConfig.customRanges[i];
          const from = Math.max(1, Math.min(range.from, pageCount));
          const to = Math.max(from, Math.min(range.to, pageCount));

          if (from < 1 || to < from) continue;

          // Create array of pages from range
          const pages: number[] = [];
          for (let p = from; p <= to; p++) {
            pages.push(p);
          }

          if (pages.length === 0) continue;

          const newPdf = await PDFDocument.create();
          const pageIndices = pages.map((p) => p - 1); // Convert to 0-indexed
          const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
          copiedPages.forEach((page) => newPdf.addPage(page));

          const pdfBytes = await newPdf.save();
          const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);

          const rangeName = pages.length === 1 ? `page-${from}.pdf` : `pages-${from}-${to}.pdf`;

          results.push({
            url,
            filename: rangeName,
            pageCount: pages.length,
          });
        }
      }

      return results;
    },
    [rangeConfig, pageCount]
  );

  // Split by Pages
  const splitByPages = useCallback(
    async (pdfFile: File): Promise<SplitResult[]> => {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const results: SplitResult[] = [];

      if (pagesConfig.mode === 'all') {
        // Extract all pages into separate files
        for (let i = 0; i < pageCount; i++) {
          const newPdf = await PDFDocument.create();
          const [page] = await newPdf.copyPages(sourcePdf, [i]);
          newPdf.addPage(page);

          const pdfBytes = await newPdf.save();
          const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);

          results.push({
            url,
            filename: `page-${i + 1}.pdf`,
            pageCount: 1,
          });
        }
      } else {
        // Selected pages
        const selectedPages = pagesConfig.selectedPages
          .filter((p) => p >= 1 && p <= pageCount)
          .sort((a, b) => a - b);

        if (selectedPages.length === 0) {
          throw new Error('Please select at least one page to extract.');
        }

        if (pagesConfig.mergeOutput) {
          // Merge selected pages into one PDF
          const newPdf = await PDFDocument.create();
          const pageIndices = selectedPages.map((p) => p - 1); // Convert to 0-indexed
          const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
          copiedPages.forEach((page) => newPdf.addPage(page));

          const pdfBytes = await newPdf.save();
          const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);

          results.push({
            url,
            filename: `extracted-pages-${selectedPages[0]}-${
              selectedPages[selectedPages.length - 1]
            }.pdf`,
            pageCount: selectedPages.length,
          });
        } else {
          // Create separate PDF for each selected page
          for (const pageNum of selectedPages) {
            const newPdf = await PDFDocument.create();
            const [page] = await newPdf.copyPages(sourcePdf, [pageNum - 1]);
            newPdf.addPage(page);

            const pdfBytes = await newPdf.save();
            const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            results.push({
              url,
              filename: `page-${pageNum}.pdf`,
              pageCount: 1,
            });
          }
        }
      }

      return results;
    },
    [pagesConfig, pageCount]
  );

  // Split by Size (Greedy Approximation)
  const splitBySize = useCallback(
    async (pdfFile: File): Promise<SplitResult[]> => {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const results: SplitResult[] = [];
      const maxSizeBytes = sizeConfig.maxSize * (sizeConfig.unit === 'KB' ? 1024 : 1024 * 1024);

      let currentPdf = await PDFDocument.create();
      let currentPages: number[] = [];
      let chunkIndex = 1;

      for (let i = 0; i < pageCount; i++) {
        // If current chunk is empty, check if single page exceeds limit first
        if (currentPages.length === 0) {
          // Check if a single page exceeds the limit
          const singlePagePdf = await PDFDocument.create();
          const [singlePage] = await singlePagePdf.copyPages(sourcePdf, [i]);
          singlePagePdf.addPage(singlePage);
          const singlePageBytes = await singlePagePdf.save();
          const singlePageSize = new Blob([singlePageBytes as unknown as BlobPart]).size;

          if (singlePageSize > maxSizeBytes) {
            // Single page exceeds limit - create PDF with just this page
            const oversizedPdf = await PDFDocument.create();
            const [oversizedPage] = await oversizedPdf.copyPages(sourcePdf, [i]);
            oversizedPdf.addPage(oversizedPage);

            const oversizedBytes = await oversizedPdf.save();
            const oversizedBlob = new Blob([oversizedBytes as unknown as BlobPart], {
              type: 'application/pdf',
            });
            const oversizedUrl = URL.createObjectURL(oversizedBlob);

            results.push({
              url: oversizedUrl,
              filename: `split-part-${chunkIndex}.pdf`,
              pageCount: 1,
            });

            chunkIndex++;
            // Reset for next chunk (currentPdf and currentPages already empty)
            continue;
          } else {
            // Page fits, add to current chunk
            currentPages.push(i);
            continue;
          }
        }

        // Current chunk has pages - test if adding this page would exceed limit
        const testPdf = await PDFDocument.create();
        const testPageIndices = [...currentPages, i];
        const testPages = await testPdf.copyPages(sourcePdf, testPageIndices);
        testPages.forEach((page) => testPdf.addPage(page));

        const testBytes = await testPdf.save();
        const testSize = new Blob([testBytes as unknown as BlobPart]).size;

        if (testSize > maxSizeBytes) {
          // Adding this page would exceed limit - save current chunk first
          const finalPages = await currentPdf.copyPages(sourcePdf, currentPages);
          finalPages.forEach((page) => currentPdf.addPage(page));

          const pdfBytes = await currentPdf.save();
          const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);

          results.push({
            url,
            filename: `split-part-${chunkIndex}.pdf`,
            pageCount: currentPages.length,
          });

          // Start new chunk with this page
          currentPdf = await PDFDocument.create();
          currentPages = [i];
          chunkIndex++;
        } else {
          // Page fits in current chunk - add it
          currentPages.push(i);
        }
      }

      // Save remaining pages
      if (currentPages.length > 0) {
        const finalPages = await currentPdf.copyPages(sourcePdf, currentPages);
        finalPages.forEach((page) => currentPdf.addPage(page));

        const pdfBytes = await currentPdf.save();
        const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        results.push({
          url,
          filename: `split-part-${chunkIndex}.pdf`,
          pageCount: currentPages.length,
        });
      }

      return results;
    },
    [sizeConfig, pageCount]
  );

  // Main split function
  const handleSplit = useCallback(async () => {
    if (!file) {
      setError('Please upload a PDF file first.');
      return;
    }

    // Validate page count
    if (pageCount === 0) {
      setError('The PDF file has no pages. Please upload a valid PDF file.');
      return;
    }

    // Prevent multiple simultaneous splits
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSplitResults([]);

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

      let results: SplitResult[] = [];
      let estimatedTotalFiles = 1;

      // Estimate total files for progress tracking
      switch (splitMode) {
        case 'range':
          // Validate range config
          if (rangeConfig.mode === 'custom') {
            const hasValidRange = rangeConfig.customRanges.some(
              (r) => r.from >= 1 && r.to >= r.from && r.from <= pageCount
            );
            if (!hasValidRange) {
              throw new Error('Please add at least one valid page range.');
            }
            estimatedTotalFiles = rangeConfig.customRanges.length;
          } else if (rangeConfig.fixedStep < 1 || rangeConfig.fixedStep > pageCount) {
            throw new Error(`Fixed step must be between 1 and ${pageCount} pages.`);
          } else {
            estimatedTotalFiles = Math.ceil(pageCount / rangeConfig.fixedStep);
          }
          break;

        case 'pages':
          if (pagesConfig.mode === 'select' && pagesConfig.selectedPages.length === 0) {
            throw new Error('Please select at least one page to extract.');
          }
          if (pagesConfig.mode === 'all') {
            estimatedTotalFiles = pageCount;
          } else if (pagesConfig.mergeOutput) {
            estimatedTotalFiles = 1;
          } else {
            estimatedTotalFiles = pagesConfig.selectedPages.length;
          }
          break;

        case 'size':
          if (sizeConfig.maxSize <= 0) {
            throw new Error('Maximum size must be greater than 0.');
          }
          // Estimate based on file size (rough estimate)
          const fileSizeBytes = file.size;
          const maxSizeBytes = sizeConfig.maxSize * (sizeConfig.unit === 'KB' ? 1024 : 1024 * 1024);
          estimatedTotalFiles = Math.max(1, Math.ceil(fileSizeBytes / maxSizeBytes));
          break;
      }

      // Update progress: Processing
      setProgress({
        currentFile: 0,
        totalFiles: estimatedTotalFiles,
        currentFileName: file.name,
        percentage: 10,
        status: 'processing',
      });

      // Show processing state for 0.3s
      await new Promise((resolve) => setTimeout(resolve, 300));

      switch (splitMode) {
        case 'range':
          results = await splitByRange(file);
          break;

        case 'pages':
          results = await splitByPages(file);
          break;

        case 'size':
          results = await splitBySize(file);
          break;
      }

      if (results.length === 0) {
        throw new Error('No PDFs were created. Please check your split configuration.');
      }

      // Update progress: Saving
      setProgress({
        currentFile: results.length,
        totalFiles: results.length,
        currentFileName: `${results.length} file${results.length !== 1 ? 's' : ''} created`,
        percentage: 95,
        status: 'saving',
      });

      // Show saving state for 0.5s
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update progress: Complete
      setProgress({
        currentFile: results.length,
        totalFiles: results.length,
        currentFileName: `${results.length} file${results.length !== 1 ? 's' : ''} created`,
        percentage: 100,
        status: 'complete',
      });

      // Show 100% completion for 1s before transitioning to success
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSplitResults(results);
      setIsSuccess(true);
      setProgress(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred while splitting the PDF.';
      setError(errorMessage);
      setIsSuccess(false);
      setProgress(null);
    } finally {
      setIsProcessing(false);
    }
  }, [
    file,
    pageCount,
    splitMode,
    rangeConfig,
    pagesConfig,
    sizeConfig,
    isProcessing,
    splitByRange,
    splitByPages,
    splitBySize,
  ]);

  // Reset everything
  const reset = useCallback(() => {
    // Clean up blob URLs
    splitResults.forEach((result) => {
      URL.revokeObjectURL(result.url);
    });

    setFile(null);
    setPageCount(0);
    setIsProcessing(false);
    setIsSuccess(false);
    setSplitResults([]);
    setError(null);
    setProgress(null);
    setRangeConfig({
      mode: 'custom',
      customRanges: [{ from: 1, to: 1 }],
      fixedStep: 5,
    });
    setPagesConfig({
      mode: 'all',
      selectedPages: [],
      mergeOutput: false,
    });
    setSizeConfig({
      maxSize: 1024,
      unit: 'MB',
      allowCompression: false,
    });
  }, [splitResults]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      splitResults.forEach((result) => {
        URL.revokeObjectURL(result.url);
      });
    };
  }, [splitResults]);

  // Toggle page selection (for Pages mode)
  const togglePageSelection = useCallback((pageNumber: number) => {
    setPagesConfig((prev) => {
      const isSelected = prev.selectedPages.includes(pageNumber);
      return {
        ...prev,
        selectedPages: isSelected
          ? prev.selectedPages.filter((p) => p !== pageNumber)
          : [...prev.selectedPages, pageNumber].sort((a, b) => a - b),
      };
    });
  }, []);

  // Add custom range input
  const addCustomRange = useCallback(() => {
    setRangeConfig((prev) => ({
      ...prev,
      customRanges: [...prev.customRanges, { from: 1, to: 1 }],
    }));
  }, []);

  // Remove custom range input
  const removeCustomRange = useCallback((index: number) => {
    setRangeConfig((prev) => ({
      ...prev,
      customRanges: prev.customRanges.filter((_, i) => i !== index),
    }));
  }, []);

  // Update custom range from/to values
  const updateCustomRange = useCallback(
    (index: number, field: 'from' | 'to', value: number) => {
      setRangeConfig((prev) => {
        const newRanges = [...prev.customRanges];
        const currentRange = newRanges[index];

        // Handle invalid values - be lenient while typing
        // Only clamp if value is way out of bounds to allow free typing
        let newValue: number;
        if (isNaN(value) || value < 1) {
          newValue = 1;
        } else if (value > pageCount * 10) {
          // Only clamp if value is way too large (10x page count)
          // This allows typing numbers like "2", "25", etc. without interference
          newValue = pageCount;
        } else {
          newValue = value;
        }

        newRanges[index] = {
          ...currentRange,
          [field]: newValue,
        };

        // Ensure 'to' is not less than 'from'
        if (field === 'from' && newRanges[index].to < newRanges[index].from) {
          newRanges[index].to = newRanges[index].from;
        }
        if (field === 'to' && newRanges[index].to < newRanges[index].from) {
          newRanges[index].from = newRanges[index].to;
        }

        return { ...prev, customRanges: newRanges };
      });
    },
    [pageCount]
  );

  // Handle mode change with state reset
  const handleModeChange = useCallback((newMode: SplitMode) => {
    setSplitMode(newMode);

    // Reset mode-specific states when switching tabs
    if (newMode === 'range') {
      // Reset pages config
      setPagesConfig({
        mode: 'all',
        selectedPages: [],
        mergeOutput: false,
      });
      // Reset size config
      setSizeConfig({
        maxSize: 1024,
        unit: 'MB',
        allowCompression: false,
      });
    } else if (newMode === 'pages') {
      // Reset range config
      setRangeConfig({
        mode: 'custom',
        customRanges: [{ from: 1, to: 1 }],
        fixedStep: 5,
      });
      // Reset size config
      setSizeConfig({
        maxSize: 1024,
        unit: 'MB',
        allowCompression: false,
      });
    } else if (newMode === 'size') {
      // Reset range config
      setRangeConfig({
        mode: 'custom',
        customRanges: [{ from: 1, to: 1 }],
        fixedStep: 5,
      });
      // Reset pages config
      setPagesConfig({
        mode: 'all',
        selectedPages: [],
        mergeOutput: false,
      });
    }
  }, []);

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
        setSplitResults([]);

        // Auto-set default max size
        const fileSizeBytes = unlockedFile.size;
        const fileSizeKB = fileSizeBytes / 1024;
        const fileSizeMB = fileSizeBytes / (1024 * 1024);

        if (fileSizeMB < 1) {
          const defaultMaxSizeKB = Math.max(1, Math.round(fileSizeKB * 0.8));
          setSizeConfig({
            maxSize: defaultMaxSizeKB,
            unit: 'KB',
            allowCompression: false,
          });
        } else {
          const defaultMaxSizeMB = Math.max(0.1, Math.round(fileSizeMB * 0.8 * 10) / 10);
          setSizeConfig({
            maxSize: defaultMaxSizeMB,
            unit: 'MB',
            allowCompression: false,
          });
        }

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
    [passwordPrompt, unlockPdf, loadPdfInfo, setSizeConfig]
  );

  // Handle password cancel
  const handlePasswordCancel = useCallback(() => {
    setPasswordPrompt({ open: false, file: null });
    setPasswordError(null);
  }, []);

  return {
    file,
    pageCount,
    splitMode,
    setSplitMode: handleModeChange,
    rangeConfig,
    setRangeConfig,
    pagesConfig,
    setPagesConfig,
    sizeConfig,
    setSizeConfig,
    isProcessing,
    isSuccess,
    splitResults,
    error,
    progress,
    handleUpload,
    handleSplit,
    reset,
    formatFileSize,
    togglePageSelection,
    addCustomRange,
    removeCustomRange,
    updateCustomRange,
    // Password handling
    passwordPrompt,
    passwordError,
    handlePasswordSubmit,
    handlePasswordCancel,
  };
}
