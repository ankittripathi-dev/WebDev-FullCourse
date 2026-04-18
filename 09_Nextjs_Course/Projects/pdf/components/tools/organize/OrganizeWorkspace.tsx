'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { RotateCw, Trash2, Plus, GripHorizontal, LayoutGrid } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { ToolSidebar } from '@/components/shared/ToolSidebar';
import { cn } from '@/lib/utils';
import type { PageItem } from '@/hooks/use-organize-pdf';
import { PagePreview } from '../split/PagePreview';

// --- Sub-Component: Sortable Page Item ---
function SortablePageItem({
  pageItem,
  index,
  file,
  onRotate,
  onRemove,
  onInsertBefore,
  onInsertAfter,
}: {
  pageItem: PageItem;
  index: number;
  file: File | null;
  onRotate: () => void;
  onRemove: () => void;
  onInsertBefore: () => void;
  onInsertAfter: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: pageItem.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const isBlank = pageItem.type === 'blank';
  const pageNumber = pageItem.type === 'original' ? (pageItem.originalPageIndex ?? 0) + 1 : null;

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, touchAction: 'none' }}
      className="group relative flex flex-col overflow-hidden rounded-xl border bg-background shadow-sm transition-all hover:border-primary hover:shadow-md">
      {/* Position Badge */}
      <div className="absolute left-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-md">
        {index + 1}
      </div>

      {/* Insert Before Button (Left Edge) */}
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onInsertBefore();
        }}
        className="absolute left-0 top-0 z-30 flex h-full w-4 items-center justify-center bg-primary/0 text-primary opacity-0 transition-all hover:bg-primary/10 group-hover:opacity-100 sm:w-6"
        title="Insert blank page before">
        <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
      </button>

      {/* Insert After Button (Right Edge) */}
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onInsertAfter();
        }}
        className="absolute right-0 top-0 z-30 flex h-full w-4 items-center justify-center bg-primary/0 text-primary opacity-0 transition-all hover:bg-primary/10 group-hover:opacity-100 sm:w-6"
        title="Insert blank page after">
        <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
      </button>

      {/* Thumbnail Area */}
      <div className="relative flex aspect-3/4 items-center justify-center overflow-hidden bg-muted/30">
        {isBlank ? (
          // Blank Page Placeholder
          <>
            <div className="flex h-full w-full flex-col items-center justify-center border-2 border-dashed border-muted-foreground/30 bg-muted/20">
              <LayoutGrid className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground/40" />
              <p className="mt-2 text-xs sm:text-sm font-semibold text-muted-foreground">
                Blank Page
              </p>
            </div>

            {/* Drag Handle (for blank pages too) */}
            <div
              {...attributes}
              {...listeners}
              style={{ touchAction: 'none' }}
              className="absolute inset-0 flex cursor-grab items-center justify-center opacity-30 sm:opacity-0 transition-opacity active:cursor-grabbing group-hover:opacity-100 sm:group-hover:opacity-100 z-0">
              <GripHorizontal className="h-6 w-6 sm:h-8 sm:w-8 text-foreground/50" />
            </div>

            {/* Delete Button for Blank Pages - Positioned to avoid + button */}
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="absolute right-2 top-2 z-20 rounded-full bg-background/80 p-1.5 text-muted-foreground opacity-0 shadow-sm backdrop-blur-sm transition-all hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100"
              style={{ marginRight: '0.5rem' }}
              title="Delete blank page">
              <Trash2 className="h-4 w-4" />
            </button>
          </>
        ) : (
          // Original Page Preview
          <>
            {file && pageNumber && (
              <div
                style={{
                  transform: `rotate(${pageItem.rotation}deg)`,
                  transition: 'transform 0.3s ease',
                }}
                className="h-full w-full">
                <PagePreview
                  file={file}
                  pageNumber={pageNumber}
                  isSelected={false}
                />
              </div>
            )}

            {/* Drag Handle - Must be accessible for dragging, lower z-index so buttons can overlay */}
            <div
              {...attributes}
              {...listeners}
              style={{ touchAction: 'none' }}
              className="absolute inset-0 flex cursor-grab items-center justify-center opacity-30 sm:opacity-0 transition-opacity active:cursor-grabbing group-hover:opacity-100 sm:group-hover:opacity-100 z-0">
              <GripHorizontal className="h-6 w-6 sm:h-8 sm:w-8 text-foreground/50" />
            </div>

            {/* Delete Button - Top Right (like merge-pdf), positioned to avoid + button */}
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="absolute right-2 top-2 z-20 rounded-full bg-background/80 p-1.5 text-muted-foreground opacity-0 shadow-sm backdrop-blur-sm transition-all hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100"
              style={{ marginRight: '0.5rem' }}
              title="Delete page">
              <Trash2 className="h-4 w-4" />
            </button>

            {/* Hover Overlay Controls - Rotate only (delete is in top-right) */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 z-10 pointer-events-none">
              {/* Rotate Button */}
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onRotate();
                }}
                className="rounded-full bg-primary p-2 text-primary-foreground shadow-md transition-all hover:scale-110 pointer-events-auto"
                title={`Rotate (${pageItem.rotation}°)`}>
                <RotateCw className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Metadata */}
      <div className="border-t bg-card p-2 sm:p-3">
        {isBlank ? (
          <p className="text-xs sm:text-sm font-semibold text-muted-foreground">Blank Page</p>
        ) : (
          <>
            <p className="text-xs sm:text-sm font-semibold text-foreground">
              Page {pageNumber}
              {pageItem.rotation !== 0 && (
                <span className="ml-1 text-muted-foreground">({pageItem.rotation}°)</span>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// --- Main Component ---
interface OrganizeWorkspaceProps {
  file: File;
  pageCount: number;
  pages: PageItem[];
  isProcessing: boolean;
  onSave: () => void;
  onMovePage: (oldIndex: number, newIndex: number) => void;
  onReorder: (newOrder: PageItem[]) => void;
  onAddBlankPage: (insertIndex: number) => void;
  onRemovePage: (index: number) => void;
  onRotatePage: (index: number) => void;
  onReset: () => void;
  formatFileSize: (bytes: number) => string;
}

export function OrganizeWorkspace({
  file,
  pageCount,
  pages,
  isProcessing,
  onSave,
  onMovePage,
  onReorder,
  onAddBlankPage,
  onRemovePage,
  onRotatePage,
  onReset,
  formatFileSize,
}: OrganizeWorkspaceProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect if device supports touch
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Setup Sensors (Mouse/Touch/Keyboard)
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
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Drag Logic - Memoized to prevent unnecessary re-renders (same as merge-pdf)
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = pages.findIndex((p) => p.id === active.id);
        const newIndex = pages.findIndex((p) => p.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          // Use arrayMove like merge-pdf for consistent behavior
          const newOrder = arrayMove(pages, oldIndex, newIndex);
          // Update pages with new order using handleReorder (like merge-pdf)
          onReorder(newOrder);
        }
      }
      setActiveId(null);
    },
    [pages, onReorder]
  );

  // Get active page item for drag overlay
  const activePage = activeId ? pages.find((p) => p.id === activeId) : null;

  return (
    <div className="flex h-full gap-4 lg:flex-row flex-col">
      {/* Left Area - Page Grid */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground">Organize Pages</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Drag and drop page thumbnails to rearrange them. Hover over pages to see controls.
          </p>
        </div>

        <div
          className="flex-1 overflow-y-auto"
          style={{ touchAction: 'pan-y' }}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}>
            <SortableContext
              items={useMemo(() => pages.map((p) => p.id), [pages])}
              strategy={rectSortingStrategy}>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {pages.map((pageItem, index) => (
                  <SortablePageItem
                    key={pageItem.id}
                    pageItem={pageItem}
                    index={index}
                    file={file}
                    onRotate={() => onRotatePage(index)}
                    onRemove={() => onRemovePage(index)}
                    onInsertBefore={() => onAddBlankPage(index)}
                    onInsertAfter={() => onAddBlankPage(index + 1)}
                  />
                ))}
              </div>
            </SortableContext>

            {/* Drag Overlay (The ghost item following mouse) */}
            <DragOverlay
              adjustScale={true}
              dropAnimation={{
                sideEffects: defaultDropAnimationSideEffects({
                  styles: { active: { opacity: '0.5' } },
                }),
              }}>
              {activePage ? (
                <div className="w-32 sm:w-40 opacity-90">
                  <div className="relative flex flex-col overflow-hidden rounded-xl border-2 border-primary bg-background shadow-lg">
                    <div className="relative flex aspect-3/4 items-center justify-center overflow-hidden bg-muted/30">
                      {activePage.type === 'blank' ? (
                        <div className="flex h-full w-full flex-col items-center justify-center border-2 border-dashed border-muted-foreground/30 bg-muted/20">
                          <LayoutGrid className="h-8 w-8 text-muted-foreground/40" />
                          <p className="mt-2 text-xs font-semibold text-muted-foreground">
                            Blank Page
                          </p>
                        </div>
                      ) : (
                        file &&
                        activePage.originalPageIndex !== undefined && (
                          <div
                            style={{
                              transform: `rotate(${activePage.rotation}deg)`,
                              transition: 'transform 0.3s ease',
                            }}
                            className="h-full w-full">
                            <PagePreview
                              file={file}
                              pageNumber={activePage.originalPageIndex + 1}
                              isSelected={false}
                            />
                          </div>
                        )
                      )}
                    </div>
                    <div className="border-t bg-card p-2">
                      <p className="text-xs font-semibold text-foreground">
                        {activePage.type === 'blank'
                          ? 'Blank Page'
                          : `Page ${(activePage.originalPageIndex ?? 0) + 1}`}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {/* Right Sidebar - Controls */}
      <ToolSidebar
        title="Organize PDF"
        subtitle={`${pages.length} ${pages.length === 1 ? 'page' : 'pages'} • ${formatFileSize(
          file.size
        )}`}
        actionButton={{
          label: 'SAVE PDF',
          onClick: onSave,
          disabled: isProcessing || pages.length === 0,
          isLoading: isProcessing,
          icon: <LayoutGrid className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />,
        }}
        secondaryButton={{
          label: 'Reset All',
          onClick: onReset,
          icon: <RotateCw className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />,
        }}>
        <div className="space-y-4">
          {/* Instructions */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="text-xs sm:text-sm text-foreground">
              Drag and drop page thumbnails to rearrange them. Hover over pages to see controls.
            </p>
          </div>

          {/* Stats */}
          <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Total pages:</span>
              <span className="font-semibold text-foreground">{pages.length}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Original pages:</span>
              <span className="font-semibold text-foreground">
                {pages.filter((p) => p.type === 'original').length}
              </span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Blank pages:</span>
              <span className="font-semibold text-foreground">
                {pages.filter((p) => p.type === 'blank').length}
              </span>
            </div>
          </div>

          {/* Actions Info */}
          <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
            <p className="text-xs sm:text-sm font-semibold text-foreground">Actions:</p>
            <ul className="space-y-1 text-[10px] sm:text-xs text-muted-foreground">
              <li>• Drag pages to reorder</li>
              <li>• Hover to rotate or delete</li>
              <li>• Click + buttons to insert blank pages</li>
            </ul>
          </div>
        </div>
      </ToolSidebar>
    </div>
  );
}
