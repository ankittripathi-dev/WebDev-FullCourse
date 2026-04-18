'use client';

import { useEffect, useRef, useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PagePreviewProps {
  file: File;
  pageNumber: number;
  isSelected?: boolean;
  rangeLabel?: string; // e.g., "Range 1", "Range 2"
  onClick?: () => void;
  className?: string;
}

export function PagePreview({
  file,
  pageNumber,
  isSelected = false,
  rangeLabel,
  onClick,
  className,
}: PagePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadPage = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        // Cancel any existing render task
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
          renderTaskRef.current = null;
        }

        // Clear canvas
        const canvas = canvasRef.current;
        if (canvas) {
          const context = canvas.getContext('2d');
          if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
          }
        }

        // Dynamically import pdf.js
        const pdfjsLib = await import('pdfjs-dist');

        // Set worker source
        if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
        }

        // Read file as array buffer
        const arrayBuffer = await file.arrayBuffer();

        if (!isMounted) return;

        // Load PDF
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        if (!isMounted) return;

        // Get specific page
        const page = await pdf.getPage(pageNumber);

        // Calculate scale for thumbnail (max 150px width)
        const viewport = page.getViewport({ scale: 1 });
        const scale = Math.min(150 / viewport.width, 200 / viewport.height);
        const scaledViewport = page.getViewport({ scale });

        // Set canvas dimensions
        if (!canvas || !isMounted) return;

        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        // Render page to canvas
        const context = canvas.getContext('2d');
        if (!context || !isMounted) return;

        // Create render task and store reference
        const renderTask = page.render({
          canvasContext: context,
          viewport: scaledViewport,
          canvas: canvas,
        });

        renderTaskRef.current = renderTask;

        // Wait for render to complete
        await renderTask.promise;

        // Clear render task reference after completion
        if (isMounted) {
          renderTaskRef.current = null;
          setIsLoading(false);
        }
      } catch (error: any) {
        // Ignore cancellation errors
        if (
          error?.name === 'RenderingCancelledException' ||
          error?.message?.includes('cancelled')
        ) {
          return;
        }
        console.error(`Error loading page ${pageNumber}:`, error);
        if (isMounted) {
          setHasError(true);
          setIsLoading(false);
          renderTaskRef.current = null;
        }
      }
    };

    loadPage();

    return () => {
      isMounted = false;
      // Cancel any ongoing render task
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }
    };
  }, [file, pageNumber]);

  return (
    <div
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-lg border bg-background transition-all',
        isSelected
          ? 'border-2 border-primary bg-primary/5 shadow-md'
          : rangeLabel
          ? 'border-2 border-accent bg-accent/5 shadow-sm'
          : 'border hover:border-primary/50 hover:shadow-sm',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}>
      {/* Range Label Badge */}
      {rangeLabel && (
        <div className="absolute left-2 top-2 z-10 rounded-md bg-accent px-2 py-1 text-[10px] font-bold text-accent-foreground shadow-md">
          {rangeLabel}
        </div>
      )}

      {/* Page Number Badge */}
      <div
        className={cn(
          'absolute z-10 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shadow-sm',
          rangeLabel ? 'right-2 top-2' : 'left-2 top-2',
          isSelected
            ? 'bg-primary text-primary-foreground'
            : rangeLabel
            ? 'bg-accent text-accent-foreground'
            : 'bg-background/80 text-foreground backdrop-blur-sm'
        )}>
        {pageNumber}
      </div>

      {/* Selection Checkmark */}
      {isSelected && (
        <div className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}

      {/* Thumbnail Area */}
      <div className="relative flex aspect-3/4 items-center justify-center overflow-hidden bg-muted/30">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
            <FileText className="h-6 w-6 text-muted-foreground/40" />
          </div>
        )}

        <canvas
          ref={canvasRef}
          className={cn(
            'max-h-full max-w-full object-contain',
            (isLoading || hasError) && 'hidden'
          )}
        />
      </div>
    </div>
  );
}
