'use client';

import { useEffect, useRef, useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CropPagePreviewProps {
  file: File;
  pageNumber: number;
  className?: string;
  onSizeChange?: (width: number, height: number) => void;
}

export function CropPagePreview({
  file,
  pageNumber,
  className,
  onSizeChange,
}: CropPagePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout | null = null;

    const loadPage = async () => {
      try {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container || !isMounted) return;

        // Only show loading if canvas is not already rendered
        const needsLoading = canvas.width === 0 || canvas.height === 0;
        if (needsLoading) {
          setIsLoading(true);
        }
        setHasError(false);

        // Cancel any existing render task
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
          renderTaskRef.current = null;
        }

        // Wait for container to be properly sized (only if needed)
        let containerRect = container.getBoundingClientRect();
        if (containerRect.width === 0 || containerRect.height === 0) {
          await new Promise((resolve) => {
            timeoutId = setTimeout(resolve, 100);
          });
          // Re-get container rect after waiting
          containerRect = container.getBoundingClientRect();
        }

        if (!isMounted) return;

        // Only clear canvas if it's a new page or file
        // Don't clear unnecessarily to prevent blinking

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

        // Get container dimensions (accounting for padding)
        // Re-get container rect in case it changed during PDF loading
        containerRect = container.getBoundingClientRect();
        const padding = 16; // p-4 = 16px
        let availableWidth = containerRect.width - padding * 2;
        let availableHeight = containerRect.height - padding * 2;

        // Ensure minimum dimensions if container is not yet sized
        if (availableWidth <= 0) availableWidth = 800;
        if (availableHeight <= 0) availableHeight = 1000;

        // Get page viewport at scale 1
        const viewport = page.getViewport({ scale: 1 });

        // Calculate scale to fit within container while maintaining aspect ratio
        const scaleX = availableWidth / viewport.width;
        const scaleY = availableHeight / viewport.height;
        const scale = Math.min(scaleX, scaleY, 2.0); // Max scale of 2.0 for performance

        const scaledViewport = page.getViewport({ scale });

        // Set canvas dimensions to match scaled viewport
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        // Set canvas CSS to fit container while maintaining aspect ratio
        // Use the actual canvas dimensions but scale with CSS
        canvas.style.width = `${scaledViewport.width}px`;
        canvas.style.height = `${scaledViewport.height}px`;
        canvas.style.maxWidth = '100%';
        canvas.style.maxHeight = '100%';
        canvas.style.display = 'block';

        // Render page to canvas
        const context2d = canvas.getContext('2d');
        if (!context2d || !isMounted) return;

        // Create render task and store reference
        const renderTask = page.render({
          canvasContext: context2d,
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

          // Notify parent of actual rendered size (use container size for coordinate mapping)
          // We use container size because the canvas is scaled to fit within it
          // Use requestAnimationFrame to avoid calling onSizeChange during render
          requestAnimationFrame(() => {
            if (onSizeChange && container && isMounted) {
              const containerRect = container.getBoundingClientRect();
              // Use full container size (the parent already accounts for padding)
              onSizeChange(containerRect.width, containerRect.height);
            }
          });
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
      // Cancel timeout if it exists
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      // Cancel any ongoing render task
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }
    };
  }, [file, pageNumber]); // Removed onSizeChange from dependencies to prevent re-renders

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full h-full flex items-center justify-center', className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <FileText className="h-12 w-12 text-muted-foreground/40" />
          <p className="mt-2 text-sm text-muted-foreground">Failed to load page</p>
        </div>
      )}

      <canvas
        ref={canvasRef}
        style={{
          visibility: isLoading || hasError ? 'hidden' : 'visible',
          opacity: isLoading || hasError ? 0 : 1,
          transition: 'opacity 0.2s ease-in-out',
        }}
        className="max-w-full max-h-full"
      />
    </div>
  );
}
