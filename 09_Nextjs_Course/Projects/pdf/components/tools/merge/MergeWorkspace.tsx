'use client';

import { useRef, useCallback, useState, useEffect, useMemo } from 'react';
import { FileText, X, Plus, GripHorizontal, UploadCloud } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import type { FileWithMetadata } from '@/hooks/use-merge-pdf';
import { PdfThumbnail } from './PdfThumbnail';

// --- Sub-Component: Sortable Grid Item ---
function SortableFileItem({
  file,
  index,
  onRemove,
  formatFileSize,
}: {
  file: FileWithMetadata;
  index: number;
  onRemove: (id: string) => void;
  formatFileSize: (bytes: number) => string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: file.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

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
      <div className="relative flex aspect-3/4 items-center justify-center overflow-hidden bg-muted/30">
        <PdfThumbnail
          file={file.file}
          className="h-full w-full"
        />

        {/* Drag Handle (Apply Listeners Here) */}
        <div
          {...attributes}
          {...listeners}
          style={{ touchAction: 'none' }}
          className="absolute inset-0 flex cursor-grab items-center justify-center opacity-30 sm:opacity-0 transition-opacity active:cursor-grabbing group-hover:opacity-100 sm:group-hover:opacity-100">
          <GripHorizontal className="h-6 w-6 sm:h-8 sm:w-8 text-foreground/50" />
        </div>

        {/* Remove Button */}
        <button
          onPointerDown={(e) => e.stopPropagation()} // Prevent drag start
          onClick={(e) => {
            e.stopPropagation();
            onRemove(file.id);
          }}
          className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 text-muted-foreground opacity-0 shadow-sm backdrop-blur-sm transition-all hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100"
          title="Remove file">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Metadata */}
      <div className="border-t bg-card p-3">
        <p
          className="truncate text-sm font-semibold text-foreground"
          title={file.name}>
          {file.name}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
      </div>
    </div>
  );
}

// --- Main Component ---
interface MergeWorkspaceProps {
  files: FileWithMetadata[];
  onRemove: (id: string) => void;
  onReorder: (newOrder: FileWithMetadata[]) => void;
  onMerge: () => void;
  onAddFiles: (files: File[]) => void;
  isProcessing: boolean;
  formatFileSize: (bytes: number) => string;
}

export function MergeWorkspace({
  files,
  onRemove,
  onReorder,
  onMerge,
  onAddFiles,
  isProcessing,
  formatFileSize,
}: MergeWorkspaceProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect if device supports touch
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // 1. Setup Sensors (Mouse/Touch/Keyboard)
  // Desktop: Use distance (8px movement) for immediate drag
  // Mobile: Use delay (200ms hold) to prevent conflicts with scrolling
  // Memoize activation constraint to prevent unnecessary re-creation
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

  // Call useSensors at top level (Rules of Hooks)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // 2. Drag Logic - Memoized to prevent unnecessary re-renders
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = files.findIndex((f) => f.id === active.id);
        const newIndex = files.findIndex((f) => f.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          onReorder(arrayMove(files, oldIndex, newIndex));
        }
      }
      setActiveId(null);
    },
    [files, onReorder]
  );

  // 3. Dropzone Logic
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) onAddFiles(acceptedFiles);
    },
    [onAddFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    noClick: true,
    noKeyboard: true,
  });

  const activeFile = files.find((f) => f.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}>
      <div className="flex h-full gap-3 sm:gap-4 lg:gap-6 lg:flex-row flex-col">
        {/* Main Content Area */}
        <div
          {...getRootProps()}
          className="relative flex-1 flex flex-col outline-none overflow-hidden">
          <input {...getInputProps()} />
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files?.length) {
                onAddFiles(Array.from(e.target.files));
                e.target.value = '';
              }
            }}
            className="hidden"
            multiple
            accept="application/pdf"
          />

          {/* Drop Overlay */}
          {isDragActive && (
            <div className="absolute inset-0 z-50 flex items-center justify-center rounded-xl border-2 border-dashed border-primary bg-background/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary animate-bounce">
                  <UploadCloud className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold text-primary">Drop to add</h3>
              </div>
            </div>
          )}

          {/* --- GRID WORKSPACE (DND KIT) --- */}
          <div
            className="flex-1 overflow-y-auto"
            style={{ touchAction: 'pan-y' }}>
            <SortableContext
              items={useMemo(() => files.map((f) => f.id), [files])}
              strategy={rectSortingStrategy}>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {files.map((file, index) => (
                  <SortableFileItem
                    key={file.id}
                    file={file}
                    index={index}
                    onRemove={onRemove}
                    formatFileSize={formatFileSize}
                  />
                ))}
              </div>
            </SortableContext>
          </div>

          {/* Drag Overlay (The ghost item following mouse) */}
          <DragOverlay
            adjustScale={true}
            dropAnimation={{
              sideEffects: defaultDropAnimationSideEffects({
                styles: { active: { opacity: '0.5' } },
              }),
            }}>
            {activeFile ? (
              <div className="cursor-grabbing rotate-2 scale-105 opacity-90">
                <div className="flex flex-col overflow-hidden rounded-xl border-2 border-primary bg-background shadow-2xl">
                  <div className="relative flex aspect-3/4 items-center justify-center overflow-hidden bg-muted/30">
                    <PdfThumbnail
                      file={activeFile.file}
                      className="h-full w-full"
                    />
                  </div>
                  <div className="border-t bg-card p-3">
                    <p
                      className="truncate text-sm font-semibold text-foreground"
                      title={activeFile.name}>
                      {activeFile.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatFileSize(activeFile.size)}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </div>

        {/* Right Sidebar */}
        <ToolSidebar
          title="Merge PDF"
          actionButton={{
            label: 'MERGE PDF',
            onClick: onMerge,
            disabled: isProcessing || files.length < 2,
            isLoading: isProcessing,
          }}
          secondaryButton={{
            label: 'Add more files',
            onClick: () => fileInputRef.current?.click(),
            icon: <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />,
          }}>
          {/* Conditional Message */}
          <div className="space-y-2">
            {files.length === 1 ? (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                  Please, select more PDF files by clicking again on{' '}
                  <span className="font-semibold text-primary">'Select PDF files'</span>.
                </p>
                <p className="mt-2 text-[10px] sm:text-xs text-muted-foreground">
                  Select multiple files by maintaining pressed{' '}
                  <kbd className="px-1 sm:px-1.5 py-0.5 rounded bg-background border text-[10px] sm:text-xs font-mono">
                    Ctrl
                  </kbd>
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                  To change the order of your PDFs, drag and drop the files as you want.
                </p>
              </div>
            )}
          </div>

          {/* File Count Badge */}
          <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 sm:px-4 py-2 sm:py-3">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">
              Total Files
            </span>
            <span className="rounded-full bg-primary px-2 sm:px-3 py-1 text-xs sm:text-sm font-bold text-primary-foreground">
              {files.length}
            </span>
          </div>
        </ToolSidebar>
      </div>
    </DndContext>
  );
}
