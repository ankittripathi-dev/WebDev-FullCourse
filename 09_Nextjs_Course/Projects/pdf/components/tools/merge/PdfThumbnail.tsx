'use client';

import { useEffect, useRef, useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PdfThumbnailProps {
  file: File;
  className?: string;
}

export function PdfThumbnail({ file, className }: PdfThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadThumbnail = async () => {
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

        // Set worker source - use jsdelivr CDN which is more reliable
        if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
        }

        // Read file as array buffer
        const arrayBuffer = await file.arrayBuffer();

        if (!isMounted) return;

        // Load PDF
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        if (!isMounted) return;

        // Get first page
        const page = await pdf.getPage(1);

        // Calculate scale for thumbnail (max 200px width)
        const viewport = page.getViewport({ scale: 1 });
        const scale = Math.min(200 / viewport.width, 200 / viewport.height);
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
        console.error('Error loading PDF thumbnail:', error);
        if (isMounted) {
          setHasError(true);
          setIsLoading(false);
          renderTaskRef.current = null;
        }
      }
    };

    loadThumbnail();

    return () => {
      isMounted = false;
      // Cancel any ongoing render task
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }
    };
  }, [file]);

  return (
    <div className={cn('relative flex items-center justify-center bg-muted/30', className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <FileText className="h-8 w-8 text-muted-foreground/40" />
        </div>
      )}

      <canvas
        ref={canvasRef}
        className={cn('max-h-full max-w-full object-contain', (isLoading || hasError) && 'hidden')}
      />
    </div>
  );
}
