'use client';

import { useRef, useCallback, useState, useMemo } from 'react';
import { FileImage, RotateCw, GripHorizontal, Image as ImageIcon } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { ToolSidebar } from '@/components/shared/ToolSidebar';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { PageItem, ConversionMode, ImageQuality } from '@/hooks/use-pdf-to-jpg';
import { PagePreview } from '../split/PagePreview';

// --- Sub-Component: Sortable Page Item ---
function SortablePageItem({
  pageItem,
  index,
  file,
  onRotate,
  onToggleInclusion,
}: {
  pageItem: PageItem;
  index: number;
  file: File | null;
  onRotate: () => void;
  onToggleInclusion: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `page-${pageItem.pageIndex}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const pageNumber = pageItem.pageIndex + 1;

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, touchAction: 'none' }}
      className="group relative flex flex-col overflow-hidden rounded-xl border bg-background shadow-sm transition-all hover:border-primary hover:shadow-md">
      {/* Position Badge */}
      <div className="absolute left-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-md">
        {index + 1}
      </div>

      {/* Thumbnail Area */}
      <div
        className="relative flex aspect-3/4 items-center justify-center overflow-hidden bg-muted/30 cursor-pointer"
        onClick={(e) => {
          // Only toggle if not clicking on buttons
          if ((e.target as HTMLElement).closest('button')) return;
          onToggleInclusion();
        }}>
        {file && (
          <div
            style={{
              transform: `rotate(${pageItem.rotation}deg)`,
              transition: 'transform 0.3s ease',
            }}
            className="h-full w-full">
            <PagePreview
              file={file}
              pageNumber={pageNumber}
              isSelected={pageItem.included}
              className="h-full w-full"
            />
          </div>
        )}

        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          style={{ touchAction: 'none' }}
          className="absolute inset-0 flex cursor-grab items-center justify-center opacity-30 sm:opacity-0 transition-opacity active:cursor-grabbing group-hover:opacity-100 sm:group-hover:opacity-100">
          <GripHorizontal className="h-6 w-6 sm:h-8 sm:w-8 text-foreground/50" />
        </div>

        {/* Rotate Button */}
        <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity pointer-events-none group-hover:opacity-100">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onRotate();
            }}
            className="pointer-events-auto rounded-full bg-background/90 p-2 text-foreground shadow-md backdrop-blur-sm transition-all hover:bg-primary hover:text-primary-foreground"
            title="Rotate page">
            <RotateCw className="h-4 w-4" />
          </button>
        </div>

        {/* Included/Excluded Indicator */}
        {!pageItem.included && (
          <div className="absolute inset-0 bg-destructive/20 flex items-center justify-center">
            <div className="rounded-full bg-destructive/80 p-2">
              <FileImage className="h-6 w-6 text-destructive-foreground" />
            </div>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="border-t bg-card p-2">
        <p className="text-xs font-semibold text-foreground">Page {pageNumber}</p>
        {pageItem.rotation !== 0 && (
          <p className="mt-1 text-xs text-primary">Rotated {pageItem.rotation}°</p>
        )}
        {!pageItem.included && <p className="mt-1 text-xs text-destructive">Excluded</p>}
      </div>
    </div>
  );
}

interface PdfToJpgWorkspaceProps {
  file: File | null;
  pageCount: number;
  pages: PageItem[];
  conversionMode: ConversionMode;
  imageQuality: ImageQuality;
  isProcessing: boolean;
  onRotate: (index: number) => void;
  onReorder: (newOrder: PageItem[]) => void;
  onToggleInclusion: (index: number) => void;
  onConversionModeChange: (mode: ConversionMode) => void;
  onImageQualityChange: (quality: ImageQuality) => void;
  onConvert: () => void;
  onUpload: (file: File) => void;
  formatFileSize: (bytes: number) => string;
}

export function PdfToJpgWorkspace({
  file,
  pageCount,
  pages,
  conversionMode,
  imageQuality,
  isProcessing,
  onRotate,
  onReorder,
  onToggleInclusion,
  onConversionModeChange,
  onImageQualityChange,
  onConvert,
  onUpload,
  formatFileSize,
}: PdfToJpgWorkspaceProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Detect touch device
  const isTouchDevice = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  // Sensors configuration
  const activationConstraint = useMemo(
    () =>
      isTouchDevice
        ? {
            delay: 200,
            tolerance: 5,
          }
        : {
            distance: 8,
          },
    [isTouchDevice]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag start
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  // Handle drag end
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = pages.findIndex((p) => `page-${p.pageIndex}` === active.id);
        const newIndex = pages.findIndex((p) => `page-${p.pageIndex}` === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newOrder = arrayMove(pages, oldIndex, newIndex);
          onReorder(newOrder);
        }
      }

      setActiveId(null);
    },
    [pages, onReorder]
  );

  // Dropzone Logic for adding files
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        // Replace current file (simple approach for MVP)
        onUpload(acceptedFiles[0]);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    noClick: true,
    noKeyboard: true,
    multiple: false,
  });

  // Get active page for drag overlay
  const activePage = useMemo(() => {
    if (!activeId || !file) return null;
    const pageIndex = parseInt(activeId.replace('page-', ''));
    return pages.find((p) => p.pageIndex === pageIndex) || null;
  }, [activeId, pages, file]);

  // Sortable context items
  const sortableItems = useMemo(() => pages.map((p) => `page-${p.pageIndex}`), [pages]);

  // Calculate stats
  const includedPagesCount = pages.filter((p) => p.included).length;
  const statsText =
    conversionMode === 'convert_pages'
      ? `${includedPagesCount} ${includedPagesCount === 1 ? 'JPG' : 'JPGs'} will be created.`
      : 'All embedded images will be extracted.';

  return (
    <div className="flex h-full gap-4 lg:flex-row flex-col">
      {/* Left Area - Page Grid */}
      <div
        {...getRootProps()}
        className="relative flex-1 flex flex-col outline-none overflow-hidden">
        <input {...getInputProps()} />

        {/* Drop Overlay */}
        {isDragActive && (
          <div className="absolute inset-0 z-50 flex items-center justify-center rounded-xl border-2 border-dashed border-primary bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary animate-bounce">
                <FileImage className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-primary">Drop to replace PDF</h3>
            </div>
          </div>
        )}

        <div
          className="flex-1 overflow-auto p-2 sm:p-4"
          style={{ touchAction: 'pan-y' }}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}>
            <SortableContext
              items={sortableItems}
              strategy={rectSortingStrategy}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-3 sm:gap-4">
                {pages.map((pageItem, index) => (
                  <SortablePageItem
                    key={`page-${pageItem.pageIndex}`}
                    pageItem={pageItem}
                    index={index}
                    file={file}
                    onRotate={() => onRotate(index)}
                    onToggleInclusion={() => onToggleInclusion(index)}
                  />
                ))}
              </div>
            </SortableContext>

            <DragOverlay
              adjustScale={true}
              dropAnimation={{
                sideEffects: defaultDropAnimationSideEffects({
                  styles: { active: { opacity: '0.5' } },
                }),
              }}>
              {activePage && file ? (
                <div className="cursor-grabbing rotate-2 scale-105 opacity-90 w-40">
                  <div className="flex flex-col overflow-hidden rounded-xl border-2 border-primary bg-background shadow-2xl">
                    <div className="relative flex aspect-3/4 items-center justify-center overflow-hidden bg-muted/30 w-full">
                      <PagePreview
                        file={file}
                        pageNumber={activePage.pageIndex + 1}
                        className="h-full w-full"
                      />
                    </div>
                    <div className="border-t bg-card p-3">
                      <p className="text-sm font-semibold text-foreground">
                        Page {activePage.pageIndex + 1}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {/* Right Sidebar - Settings */}
      <ToolSidebar
        title="PDF to JPG"
        subtitle={`${pageCount} ${pageCount === 1 ? 'page' : 'pages'}`}
        actionButton={{
          label: 'CONVERT TO JPG',
          onClick: onConvert,
          disabled: isProcessing || !file || includedPagesCount === 0,
          isLoading: isProcessing,
          icon: <FileImage className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />,
        }}>
        <div className="space-y-4">
          {/* Conversion Mode Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
              <label className="text-sm font-semibold text-foreground">Conversion Mode</label>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {/* Page to JPG Option */}
              <button
                type="button"
                onClick={() => onConversionModeChange('convert_pages')}
                className={cn(
                  'flex flex-col items-start gap-2 rounded-lg border-2 p-3 transition-all text-left',
                  'hover:border-primary/40 hover:bg-muted/50',
                  conversionMode === 'convert_pages'
                    ? 'border-primary bg-primary/5'
                    : 'border-muted bg-card'
                )}>
                <div className="flex items-center gap-2 w-full">
                  <div
                    className={cn(
                      'h-4 w-4 rounded-full border-2 flex items-center justify-center',
                      conversionMode === 'convert_pages'
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground'
                    )}>
                    {conversionMode === 'convert_pages' && (
                      <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                    )}
                  </div>
                  <span className="text-sm font-medium">Page to JPG</span>
                </div>
                <p className="text-xs text-muted-foreground pl-6">
                  Every page of this PDF will be converted into a JPG file.
                </p>
                {conversionMode === 'convert_pages' && (
                  <p className="text-xs font-semibold text-primary pl-6">{statsText}</p>
                )}
              </button>

              {/* Extract Images Option */}
              <button
                type="button"
                onClick={() => onConversionModeChange('extract_images')}
                className={cn(
                  'flex flex-col items-start gap-2 rounded-lg border-2 p-3 transition-all text-left',
                  'hover:border-primary/40 hover:bg-muted/50',
                  conversionMode === 'extract_images'
                    ? 'border-primary bg-primary/5'
                    : 'border-muted bg-card'
                )}>
                <div className="flex items-center gap-2 w-full">
                  <div
                    className={cn(
                      'h-4 w-4 rounded-full border-2 flex items-center justify-center',
                      conversionMode === 'extract_images'
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground'
                    )}>
                    {conversionMode === 'extract_images' && (
                      <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                    )}
                  </div>
                  <span className="text-sm font-medium">Extract Images</span>
                </div>
                <p className="text-xs text-muted-foreground pl-6">
                  All embedded images inside the PDF will be extracted as JPG images.
                </p>
                {conversionMode === 'extract_images' && (
                  <p className="text-xs font-semibold text-primary pl-6">{statsText}</p>
                )}
              </button>
            </div>
          </div>

          {/* Image Quality Section (Only for convert_pages) */}
          {conversionMode === 'convert_pages' && (
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm">Image Quality</Label>
              <Select
                value={imageQuality}
                onValueChange={(value: ImageQuality) => onImageQualityChange(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal (Recommended - Small file size)</SelectItem>
                  <SelectItem value="high">High (Best Quality - Larger file size)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Info Section */}
          <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
            <p className="text-xs sm:text-sm font-semibold text-foreground">Tips:</p>
            <ul className="space-y-1 text-[10px] sm:text-xs text-muted-foreground">
              <li>• Drag pages to reorder them</li>
              <li>• Hover over pages to rotate</li>
              <li>• Click pages to include/exclude them</li>
              {conversionMode === 'convert_pages' && (
                <li>• Reordering affects output filename numbering</li>
              )}
            </ul>
          </div>
        </div>
      </ToolSidebar>
    </div>
  );
}
