'use client';

import { useState } from 'react';
import { RotateCcw, RotateCw, RefreshCcw } from 'lucide-react';
import { ToolSidebar } from '@/components/shared/ToolSidebar';
import { Button } from '@/components/ui/button';
import { PagePreview } from '@/components/tools/split/PagePreview';
import { cn } from '@/lib/utils';
import type { RotateDirection } from '@/hooks/use-rotate-pdf';

interface RotateWorkspaceProps {
  file: File;
  pageCount: number;
  rotations: Record<number, number>;
  isProcessing: boolean;
  onRotatePage: (pageIndex: number, direction: RotateDirection) => void;
  onRotateAll: (direction: RotateDirection) => void;
  onReset: () => void;
  onSave: () => void;
  formatFileSize: (bytes: number) => string;
}

export function RotateWorkspace({
  file,
  pageCount,
  rotations,
  isProcessing,
  onRotatePage,
  onRotateAll,
  onReset,
  onSave,
  formatFileSize,
}: RotateWorkspaceProps) {
  const [hoveredPage, setHoveredPage] = useState<number | null>(null);

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      {/* Left Area: Grid Preview */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 p-2 sm:p-4">
          {Array.from({ length: pageCount }, (_, i) => {
            const pageIndex = i;
            const rotation = rotations[pageIndex] || 0;
            const isHovered = hoveredPage === pageIndex;

            return (
              <div
                key={pageIndex}
                className="group relative"
                onMouseEnter={() => setHoveredPage(pageIndex)}
                onMouseLeave={() => setHoveredPage(null)}>
                {/* Page Card */}
                <div className="relative flex flex-col overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:border-primary hover:shadow-md">
                  {/* Page Number Badge */}
                  <div className="absolute left-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-background/80 text-xs font-bold text-foreground backdrop-blur-sm shadow-sm">
                    {pageIndex + 1}
                  </div>

                  {/* Rotation Indicator Badge */}
                  {rotation !== 0 && (
                    <div className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-sm">
                      {rotation}°
                    </div>
                  )}

                  {/* Thumbnail Area with Rotation */}
                  <div className="relative flex aspect-3/4 items-center justify-center overflow-hidden bg-muted/30">
                    <div
                      className={cn(
                        'w-full h-full flex items-center justify-center transition-transform duration-300 ease-in-out',
                        'transform-gpu' // Use GPU acceleration for smoother rotation
                      )}
                      style={{
                        transform: `rotate(${rotation}deg)`,
                      }}>
                      <PagePreview
                        file={file}
                        pageNumber={pageIndex + 1}
                        className="w-full h-full"
                      />
                    </div>

                    {/* Hover Overlay with Controls */}
                    {isHovered && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
                        <div className="flex gap-2">
                          {/* Rotate Left Button */}
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-10 w-10 rounded-full p-0 shadow-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRotatePage(pageIndex, 'left');
                            }}
                            title="Rotate left (counter-clockwise)">
                            <RotateCcw className="h-5 w-5" />
                          </Button>

                          {/* Rotate Right Button */}
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-10 w-10 rounded-full p-0 shadow-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRotatePage(pageIndex, 'right');
                            }}
                            title="Rotate right (clockwise)">
                            <RotateCw className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Sidebar: Controls */}
      <ToolSidebar
        title="Rotate PDF"
        subtitle="Rotate specific pages or the entire document."
        actionButton={{
          label: 'SAVE ROTATED PDF',
          onClick: onSave,
          disabled: isProcessing,
          isLoading: isProcessing,
        }}
        secondaryButton={
          Object.keys(rotations).length > 0
            ? {
                label: 'Reset All',
                onClick: onReset,
                icon: <RefreshCcw className="h-4 w-4" />,
              }
            : undefined
        }>
        {/* Global Actions */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Rotate All Pages</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex items-center justify-center gap-2"
                onClick={() => onRotateAll('left')}
                disabled={isProcessing}>
                <RotateCcw className="h-5 w-5" />
                <span>Left</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex items-center justify-center gap-2"
                onClick={() => onRotateAll('right')}
                disabled={isProcessing}>
                <RotateCw className="h-5 w-5" />
                <span>Right</span>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-1 border-t pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total pages:</span>
              <span className="font-semibold">{pageCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Pages rotated:</span>
              <span className="font-semibold">
                {Object.keys(rotations).length} / {pageCount}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">File size:</span>
              <span className="font-semibold">{formatFileSize(file.size)}</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-2 border-t pt-4">
            <p className="text-xs text-muted-foreground">
              <strong>Tip:</strong> Hover over any page thumbnail to rotate it individually. Use the
              "Rotate All" buttons to rotate the entire document at once.
            </p>
          </div>
        </div>
      </ToolSidebar>
    </div>
  );
}

