'use client';

import { useState, useRef, useEffect } from 'react';
import { Crop, RefreshCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { ToolSidebar } from '@/components/shared/ToolSidebar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import ReactCrop, {
  type Crop as ReactCropType,
  makeAspectCrop,
  centerCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { cn } from '@/lib/utils';
import type { CropScope } from '@/hooks/use-crop-pdf';

interface CropWorkspaceProps {
  file: File;
  pageCount: number;
  crop: ReactCropType | null;
  scaleFactor: number;
  pageDetails: { width: number; height: number } | null;
  scope: CropScope;
  currentPageIndex: number;
  isProcessing: boolean;
  setCrop: (crop: ReactCropType | null) => void;
  onImageLoad: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onScopeChange: (scope: CropScope) => void;
  onCurrentPageChange: (index: number) => void;
  onReset: () => void;
  onCrop: () => void;
  formatFileSize: (bytes: number) => string;
}

export function CropWorkspace({
  file,
  pageCount,
  crop,
  scaleFactor,
  pageDetails,
  scope,
  currentPageIndex,
  isProcessing,
  setCrop,
  onImageLoad,
  onScopeChange,
  onCurrentPageChange,
  onReset,
  onCrop,
  formatFileSize,
}: CropWorkspaceProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Render PDF page to image
  useEffect(() => {
    let isMounted = true;
    let resizeObserver: ResizeObserver | null = null;

    const renderPage = async () => {
      try {
        const container = containerRef.current;
        if (!container) return;

        setIsLoading(true);

        // Wait for container to have dimensions
        let containerRect = container.getBoundingClientRect();
        if (containerRect.width === 0 || containerRect.height === 0) {
          await new Promise((resolve) => setTimeout(resolve, 200));
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
        const page = await pdf.getPage(currentPageIndex + 1);

        // Calculate scale to fill container while maintaining aspect ratio
        const padding = 32; // p-4 = 16px on each side
        const availableWidth = Math.max(containerRect.width - padding, 400);
        const availableHeight = Math.max(containerRect.height - padding, 600);

        const viewport = page.getViewport({ scale: 1 });
        const scaleX = availableWidth / viewport.width;
        const scaleY = availableHeight / viewport.height;
        // Use the smaller scale to ensure image fits within container (maintains aspect ratio)
        const scale = Math.min(scaleX, scaleY, 3.0); // Cap at 3x for performance
        const scaledViewport = page.getViewport({ scale });

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        // Render page to canvas
        const context = canvas.getContext('2d');
        if (!context || !isMounted) return;

        await page.render({
          canvasContext: context,
          viewport: scaledViewport,
          canvas: canvas,
        }).promise;

        if (!isMounted) return;

        // Convert canvas to image data URL
        const dataUrl = canvas.toDataURL('image/png');
        setImageUrl(dataUrl);
        setIsLoading(false);
      } catch (error) {
        console.error('Error rendering PDF page:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up ResizeObserver to re-render when container resizes
    if (containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        renderPage();
      });
      resizeObserver.observe(containerRef.current);
      renderPage();
    }

    return () => {
      isMounted = false;
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      // Clean up image URL
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [file, currentPageIndex]);

  // Cleanup image URL on unmount
  useEffect(() => {
    return () => {
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  // Handle crop change
  const handleCropChange = (newCrop: ReactCropType) => {
    setCrop(newCrop);
  };

  // Handle image load
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;

    // Create a default crop that covers the entire image
    const defaultCrop = centerCrop(
      makeAspectCrop(
        {
          unit: 'px',
          width: img.width,
          height: img.height,
        },
        img.width / img.height,
        img.width,
        img.height
      ),
      img.width,
      img.height
    );

    setCrop(defaultCrop);

    // Call the parent's onImageLoad to calculate scale factor
    onImageLoad(e);
  };

  return (
    <div className="flex h-full gap-4 lg:flex-row flex-col">
      {/* Left Area - Interactive Crop Stage */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground">Crop Preview</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Draw a selection box to crop the PDF page
          </p>
        </div>

        {/* PDF Preview with Crop Overlay */}
        <div
          ref={containerRef}
          className="flex-1 relative border rounded-lg overflow-hidden bg-muted/20 p-4">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading page...</p>
              </div>
            </div>
          ) : imageUrl ? (
            <div className="absolute inset-4 flex items-center justify-center overflow-hidden">
              <ReactCrop
                crop={crop || undefined}
                onChange={handleCropChange}
                aspect={undefined}
                minWidth={50}
                minHeight={50}
                style={{ maxWidth: '100%', maxHeight: '100%' }}>
                <img
                  ref={imgRef}
                  src={imageUrl}
                  alt={`Page ${currentPageIndex + 1}`}
                  onLoad={handleImageLoad}
                  style={{
                    display: 'block',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                  }}
                />
              </ReactCrop>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">Failed to load page</p>
            </div>
          )}
        </div>

        {/* Page Navigation */}
        {pageCount > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCurrentPageChange(currentPageIndex - 1)}
              disabled={currentPageIndex === 0}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPageIndex + 1} of {pageCount}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCurrentPageChange(currentPageIndex + 1)}
              disabled={currentPageIndex === pageCount - 1}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Right Sidebar - Controls */}
      <ToolSidebar
        title="Crop PDF"
        subtitle={`${formatFileSize(file.size)} • ${pageCount} page${pageCount !== 1 ? 's' : ''}`}
        actionButton={{
          label: isProcessing ? 'Cropping...' : 'Crop PDF',
          onClick: onCrop,
          disabled: !crop || isProcessing,
          icon: <Crop className="h-4 w-4" />,
        }}
        secondaryButton={{
          label: 'Reset',
          onClick: onReset,
          icon: <RefreshCcw className="h-4 w-4" />,
        }}>
        {/* Scope Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Apply to</Label>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => onScopeChange('current_page')}
              className={cn(
                'w-full flex items-center justify-between p-3 rounded-lg border transition-colors text-left',
                scope === 'current_page'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              )}>
              <span className="text-sm font-medium text-foreground">Current Page Only</span>
              <div
                className={cn(
                  'h-4 w-4 rounded-full border-2 flex items-center justify-center',
                  scope === 'current_page'
                    ? 'border-primary bg-primary'
                    : 'border-muted-foreground/30 bg-background'
                )}>
                {scope === 'current_page' && (
                  <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                )}
              </div>
            </button>
            <button
              type="button"
              onClick={() => onScopeChange('all_pages')}
              className={cn(
                'w-full flex items-center justify-between p-3 rounded-lg border transition-colors text-left',
                scope === 'all_pages'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              )}>
              <span className="text-sm font-medium text-foreground">All Pages</span>
              <div
                className={cn(
                  'h-4 w-4 rounded-full border-2 flex items-center justify-center',
                  scope === 'all_pages'
                    ? 'border-primary bg-primary'
                    : 'border-muted-foreground/30 bg-background'
                )}>
                {scope === 'all_pages' && (
                  <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Crop Info */}
        {crop && pageDetails && (
          <div className="space-y-2 pt-4 border-t">
            <Label className="text-sm font-semibold">Crop Area</Label>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                Position: ({Math.round(crop.x)}, {Math.round(crop.y)})
              </p>
              <p>
                Size: {Math.round(crop.width)} × {Math.round(crop.height)} px
              </p>
              <p className="pt-2 text-xs">
                PDF: {Math.round(crop.x * scaleFactor)} × {Math.round(crop.y * scaleFactor)} pts
              </p>
            </div>
          </div>
        )}
      </ToolSidebar>
    </div>
  );
}
