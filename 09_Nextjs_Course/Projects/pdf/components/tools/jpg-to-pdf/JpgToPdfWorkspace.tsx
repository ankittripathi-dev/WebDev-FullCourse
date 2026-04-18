'use client';

import { useRef, useCallback, useState, useMemo, useEffect } from 'react';
import { FileImage, X, RotateCw, GripHorizontal } from 'lucide-react';
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
import { UploadCloud } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { ImageFile, JpgToPdfSettings } from '@/hooks/use-jpg-to-pdf';
import { Monitor, Smartphone, FileText } from 'lucide-react';

// --- Sub-Component: Sortable Image Item ---
function SortableImageItem({
  imageFile,
  index,
  onRemove,
  onRotate,
  formatFileSize,
  settings,
}: {
  imageFile: ImageFile;
  index: number;
  onRemove: (id: string) => void;
  onRotate: (id: string) => void;
  formatFileSize: (bytes: number) => string;
  settings: JpgToPdfSettings;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: imageFile.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  // Calculate rotation transform for preview
  const rotationStyle = {
    transform: `rotate(${imageFile.rotation}deg)`,
    transition: 'transform 0.3s ease',
  };

  // Calculate page dimensions for preview
  const getPageDimensions = () => {
    if (settings.pageSize === 'fit') {
      return null;
    }
    const dimensions = {
      a4: { width: 595.28, height: 841.89 },
      letter: { width: 612, height: 792 },
    };
    const { width, height } = dimensions[settings.pageSize];
    return settings.orientation === 'landscape'
      ? { width: height, height: width }
      : { width, height };
  };

  const getMarginSize = () => {
    switch (settings.margin) {
      case 'none':
        return 0;
      case 'small':
        return 8;
      case 'big':
        return 16;
      default:
        return 0;
    }
  };

  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgNaturalWidth, setImgNaturalWidth] = useState(0);
  const [imgNaturalHeight, setImgNaturalHeight] = useState(0);

  // Calculate effective dimensions after rotation
  let effectiveWidth = imgNaturalWidth;
  let effectiveHeight = imgNaturalHeight;
  if (imageFile.rotation === 90 || imageFile.rotation === 270) {
    effectiveWidth = imgNaturalHeight;
    effectiveHeight = imgNaturalWidth;
  }

  const pageDims = getPageDimensions();
  const margin = getMarginSize();

  // Calculate preview layout
  let containerAspect = 3 / 4; // Default aspect ratio
  let showPageBorder = false;

  if (settings.pageSize === 'fit') {
    // Fit to image aspect ratio
    if (effectiveWidth > 0 && effectiveHeight > 0) {
      containerAspect = effectiveWidth / effectiveHeight;
    }
    showPageBorder = false;
  } else if (pageDims) {
    // Use page aspect ratio
    containerAspect = pageDims.width / pageDims.height;
    showPageBorder = true;
  }

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, touchAction: 'none' }}
      className="group relative flex flex-col overflow-hidden rounded-xl border bg-background shadow-sm transition-all hover:border-primary hover:shadow-md">
      {/* Position Badge */}
      <div className="absolute left-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-md">
        {index + 1}
      </div>

      {/* Image Preview Area */}
      <div
        className="relative flex items-center justify-center overflow-hidden bg-muted/30"
        style={{ aspectRatio: containerAspect }}>
        {/* Page Border (if not fit) */}
        {showPageBorder && (
          <div
            className="absolute inset-0 border-2 border-primary/30 bg-white/50"
            style={{
              margin: `${margin}px`,
            }}
          />
        )}

        {/* Image Preview with rotation */}
        <img
          src={imageFile.previewUrl}
          alt={imageFile.file.name}
          style={rotationStyle}
          className="h-full w-full object-contain"
          onLoad={(e) => {
            const img = e.currentTarget;
            setImgNaturalWidth(img.naturalWidth);
            setImgNaturalHeight(img.naturalHeight);
            setImgLoaded(true);
          }}
        />

        {/* Drag Handle (Apply Listeners Here) - Same as MergeWorkspace */}
        <div
          {...attributes}
          {...listeners}
          style={{ touchAction: 'none' }}
          className="absolute inset-0 flex cursor-grab items-center justify-center opacity-30 sm:opacity-0 transition-opacity active:cursor-grabbing group-hover:opacity-100 sm:group-hover:opacity-100">
          <GripHorizontal className="h-6 w-6 sm:h-8 sm:w-8 text-foreground/50" />
        </div>

        {/* Rotate Button - Centered Overlay */}
        <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity pointer-events-none group-hover:opacity-100">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onRotate(imageFile.id);
            }}
            className="pointer-events-auto rounded-full bg-background/90 p-2 text-foreground shadow-md backdrop-blur-sm transition-all hover:bg-primary hover:text-primary-foreground"
            title="Rotate image">
            <RotateCw className="h-4 w-4" />
          </button>
        </div>

        {/* Delete Button - Top Right */}
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(imageFile.id);
          }}
          className="absolute right-2 top-2 z-10 rounded-full bg-background/80 p-1.5 text-muted-foreground opacity-0 shadow-sm backdrop-blur-sm transition-all hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100"
          title="Remove image">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Metadata */}
      <div className="border-t bg-card p-3">
        <p
          className="truncate text-sm font-semibold text-foreground"
          title={imageFile.file.name}>
          {imageFile.file.name}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{formatFileSize(imageFile.file.size)}</p>
        {imageFile.rotation !== 0 && (
          <p className="mt-1 text-xs text-primary">Rotated {imageFile.rotation}°</p>
        )}
      </div>
    </div>
  );
}

interface JpgToPdfWorkspaceProps {
  files: ImageFile[];
  settings: JpgToPdfSettings;
  isProcessing: boolean;
  onRemove: (id: string) => void;
  onReorder: (newOrder: ImageFile[]) => void;
  onRotate: (id: string) => void;
  onSettingsChange: <K extends keyof JpgToPdfSettings>(key: K, value: JpgToPdfSettings[K]) => void;
  onAddFiles: () => void;
  addFiles: (files: FileList | File[]) => void;
  onConvert: () => void;
  formatFileSize: (bytes: number) => string;
  fileInputRef?: React.RefObject<HTMLInputElement | null>;
}

export function JpgToPdfWorkspace({
  files,
  settings,
  isProcessing,
  onRemove,
  onReorder,
  onRotate,
  onSettingsChange,
  onAddFiles,
  addFiles,
  onConvert,
  formatFileSize,
  fileInputRef: externalFileInputRef,
}: JpgToPdfWorkspaceProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const internalFileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = externalFileInputRef || internalFileInputRef;

  // Detect touch device
  const isTouchDevice = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  // Sensors configuration - Use distance for desktop like MergeWorkspace
  const activationConstraint = useMemo(
    () =>
      isTouchDevice
        ? {
            delay: 200, // Mobile: 200ms hold before drag starts
            tolerance: 5, // Allow 5px movement during delay
          }
        : {
            distance: 8, // Desktop: 8px movement for immediate drag
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
        const oldIndex = files.findIndex((f) => f.id === active.id);
        const newIndex = files.findIndex((f) => f.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newOrder = arrayMove(files, oldIndex, newIndex);
          onReorder(newOrder);
        }
      }

      setActiveId(null);
    },
    [files, onReorder]
  );

  // Dropzone Logic for adding files
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        // Convert File[] to FileList-like structure for addFiles
        const dataTransfer = new DataTransfer();
        acceptedFiles.forEach((file) => dataTransfer.items.add(file));
        addFiles(dataTransfer.files);
      }
    },
    [addFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    noClick: true,
    noKeyboard: true,
  });

  // Get active file for drag overlay
  const activeFile = useMemo(() => {
    return activeId ? files.find((f) => f.id === activeId) : null;
  }, [activeId, files]);

  // Preload all images to ensure they're available for drag overlay
  useEffect(() => {
    const preloadImages = files.map((file) => {
      const img = new Image();
      img.src = file.previewUrl;
      return img;
    });
    // Keep references to prevent garbage collection
    return () => {
      preloadImages.forEach((img) => {
        img.src = '';
      });
    };
  }, [files]);

  // Sortable context items
  const sortableItems = useMemo(() => files.map((f) => f.id), [files]);

  return (
    <div className="flex h-full gap-4 lg:flex-row flex-col">
      {/* Left Area - Image Grid */}
      <div
        {...getRootProps()}
        className="relative flex-1 flex flex-col outline-none overflow-hidden">
        <input {...getInputProps()} />
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              addFiles(e.target.files);
              e.target.value = '';
            }
          }}
          className="hidden"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
        />

        {/* Drop Overlay */}
        {isDragActive && (
          <div className="absolute inset-0 z-50 flex items-center justify-center rounded-xl border-2 border-dashed border-primary bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary animate-bounce">
                <UploadCloud className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold text-primary">Drop to add images</h3>
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
                {files.map((imageFile, index) => (
                  <SortableImageItem
                    key={imageFile.id}
                    imageFile={imageFile}
                    index={index}
                    onRemove={onRemove}
                    onRotate={onRotate}
                    formatFileSize={formatFileSize}
                    settings={settings}
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
              {activeFile && activeFile.previewUrl ? (
                <div className="cursor-grabbing rotate-2 scale-105 opacity-90 w-40">
                  <div className="flex flex-col overflow-hidden rounded-xl border-2 border-primary bg-background shadow-2xl">
                    <div className="relative flex aspect-3/4 items-center justify-center overflow-hidden bg-muted/30 w-full">
                      <img
                        key={activeFile.id}
                        src={activeFile.previewUrl}
                        alt={activeFile.file.name}
                        className="h-full w-full object-contain"
                        style={{ transform: `rotate(${activeFile.rotation}deg)` }}
                        loading="eager"
                        draggable={false}
                        onLoad={(e) => {
                          // Image loaded successfully
                          e.currentTarget.style.opacity = '1';
                        }}
                        onError={(e) => {
                          // If image fails, try creating a new blob URL from the file
                          const target = e.currentTarget;
                          try {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result) {
                                target.src = event.target.result as string;
                              }
                            };
                            reader.readAsDataURL(activeFile.file);
                          } catch (err) {
                            console.error('Failed to load image in drag overlay:', err);
                            target.style.display = 'none';
                          }
                        }}
                      />
                    </div>
                    <div className="border-t bg-card p-3">
                      <p
                        className="truncate text-sm font-semibold text-foreground"
                        title={activeFile.file.name}>
                        {activeFile.file.name}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatFileSize(activeFile.file.size)}
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
        title="JPG to PDF"
        subtitle={`${files.length} ${files.length === 1 ? 'image' : 'images'} selected`}
        actionButton={{
          label: 'CONVERT TO PDF',
          onClick: onConvert,
          disabled: isProcessing || files.length === 0,
          isLoading: isProcessing,
          icon: <FileImage className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />,
        }}
        secondaryButton={
          files.length > 0
            ? {
                label: 'Add More Images',
                onClick: onAddFiles,
                icon: <FileImage className="mr-2 h-4 w-4" />,
              }
            : undefined
        }>
        <div className="space-y-4">
          {/* Instructions */}
          {files.length === 0 && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
              <p className="text-xs sm:text-sm text-foreground">
                Upload images to convert them to PDF. You can reorder, rotate, and customize the
                layout.
              </p>
            </div>
          )}

          {files.length > 0 && (
            <>
              {/* Page Layout Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <label className="text-sm font-semibold text-foreground">Page Layout</label>
                </div>

                {/* Orientation */}
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Orientation</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onSettingsChange('orientation', 'portrait')}
                      disabled={settings.pageSize === 'fit'}
                      className={cn(
                        'flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all',
                        'hover:border-primary/40 hover:bg-muted/50',
                        settings.orientation === 'portrait'
                          ? 'border-primary bg-primary/5'
                          : 'border-muted bg-card',
                        settings.pageSize === 'fit' && 'opacity-50 cursor-not-allowed'
                      )}>
                      <Monitor className="h-5 w-5" />
                      <span className="text-xs font-medium">Portrait</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onSettingsChange('orientation', 'landscape')}
                      disabled={settings.pageSize === 'fit'}
                      className={cn(
                        'flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all',
                        'hover:border-primary/40 hover:bg-muted/50',
                        settings.orientation === 'landscape'
                          ? 'border-primary bg-primary/5'
                          : 'border-muted bg-card',
                        settings.pageSize === 'fit' && 'opacity-50 cursor-not-allowed'
                      )}>
                      <Smartphone className="h-5 w-5 rotate-90" />
                      <span className="text-xs font-medium">Landscape</span>
                    </button>
                  </div>
                  {settings.pageSize === 'fit' && (
                    <p className="text-xs text-muted-foreground">
                      Orientation is disabled when using "Fit to Image" size.
                    </p>
                  )}
                </div>

                {/* Page Size */}
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Page Size</Label>
                  <Select
                    value={settings.pageSize}
                    onValueChange={(value: 'a4' | 'fit' | 'letter') =>
                      onSettingsChange('pageSize', value)
                    }>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a4">A4</SelectItem>
                      <SelectItem value="letter">US Letter</SelectItem>
                      <SelectItem value="fit">Same as Image (Fit)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Margin */}
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Margin</Label>
                  <Select
                    value={settings.margin}
                    onValueChange={(value: 'none' | 'small' | 'big') =>
                      onSettingsChange('margin', value)
                    }>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Margin</SelectItem>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="big">Big</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Output Options */}
              <div className="space-y-3 rounded-lg border bg-muted/30 p-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <label className="text-sm font-semibold text-foreground">Output Options</label>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="mergeOutput"
                    checked={settings.mergeOutput}
                    onCheckedChange={(checked) => onSettingsChange('mergeOutput', checked === true)}
                  />
                  <label
                    htmlFor="mergeOutput"
                    className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                    Merge all images into one PDF file
                  </label>
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  {settings.mergeOutput
                    ? 'All images will be combined into a single PDF file.'
                    : 'Each image will be converted to a separate PDF file.'}
                </p>
              </div>

              {/* Info */}
              <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
                <p className="text-xs sm:text-sm font-semibold text-foreground">Tips:</p>
                <ul className="space-y-1 text-[10px] sm:text-xs text-muted-foreground">
                  <li>• Drag images to reorder them</li>
                  <li>• Hover over images to rotate or delete</li>
                  <li>• "Fit" page size uses exact image dimensions</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </ToolSidebar>
    </div>
  );
}
