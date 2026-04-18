'use client';

import { useEffect, useRef, useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageNumbersPagePreviewProps {
  file: File;
  pageNumber: number;
  className?: string;
}

export function PageNumbersPagePreview({
  file,
  pageNumber,
  className,
}: PageNumbersPagePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<any>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // ResizeObserver to track container size changes
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    resizeObserverRef.current = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setContainerSize({ width, height });
        }
      }
    });

    resizeObserverRef.current.observe(container);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    };
  }, []);

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

        // Get container dimensions - use the larger of containerSize or getBoundingClientRect
        // Re-get container rect in case it changed during PDF loading
        containerRect = container.getBoundingClientRect();
        let availableWidth = Math.max(
          containerRect.width,
          containerSize.width || containerRect.width
        );
        let availableHeight = Math.max(
          containerRect.height,
          containerSize.height || containerRect.height
        );

        // Ensure minimum dimensions if container is not yet sized
        if (availableWidth <= 0) availableWidth = 800;
        if (availableHeight <= 0) availableHeight = 1000;

        // Get page viewport at scale 1
        const viewport = page.getViewport({ scale: 1 });

        // Calculate scale to fill container while maintaining aspect ratio
        const scaleX = availableWidth / viewport.width;
        const scaleY = availableHeight / viewport.height;
        // Use the smaller scale to ensure it fits within the container
        const scale = Math.min(scaleX, scaleY, 3.0); // Max scale of 3.0 for better quality

        const scaledViewport = page.getViewport({ scale });

        // Account for device pixel ratio for crisp rendering
        const dpr = window.devicePixelRatio || 1;
        const displayWidth = scaledViewport.width;
        const displayHeight = scaledViewport.height;

        // Set canvas internal size (actual pixels)
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;

        // Set canvas display size (CSS pixels)
        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;
        canvas.style.maxWidth = '100%';
        canvas.style.maxHeight = '100%';
        canvas.style.display = 'block';

        // Get context and scale it to account for device pixel ratio
        const context2d = canvas.getContext('2d');
        if (!context2d || !isMounted) return;

        // Scale the context to account for device pixel ratio
        context2d.scale(dpr, dpr);

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

    // Only load if we have container dimensions or file/pageNumber changed
    if (containerSize.width > 0 && containerSize.height > 0) {
      loadPage();
    } else {
      // Wait a bit for container to size
      const timer = setTimeout(() => {
        if (isMounted) loadPage();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [file, pageNumber, containerSize.width, containerSize.height]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full h-full flex items-center justify-center overflow-hidden',
        className
      )}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10">
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
