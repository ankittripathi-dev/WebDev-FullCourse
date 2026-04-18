'use client';

import { useState, useEffect } from 'react';
import { Trash2, X as XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToolSidebar } from '@/components/shared/ToolSidebar';
import { cn } from '@/lib/utils';
import { PagePreview } from '../split/PagePreview';

interface RemoveWorkspaceProps {
  file: File;
  pageCount: number;
  pagesToRemove: Set<number>;
  isProcessing: boolean;
  onRemove: () => void;
  onTogglePage: (pageIndex: number) => void;
  onShiftClick: (pageIndex: number) => void;
  onRangeInput: (input: string) => void;
  formatFileSize: (bytes: number) => string;
  getPagesToRemoveString: () => string;
}

export function RemoveWorkspace({
  file,
  pageCount,
  pagesToRemove,
  isProcessing,
  onRemove,
  onTogglePage,
  onShiftClick,
  onRangeInput,
  formatFileSize,
  getPagesToRemoveString,
}: RemoveWorkspaceProps) {
  // Local state for input to allow free typing
  const [inputValue, setInputValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const canRemove = pagesToRemove.size > 0 && pagesToRemove.size < pageCount;

  // Sync input when pages are selected via clicks (but not when input is focused/typing)
  useEffect(() => {
    if (!isInputFocused) {
      const formattedString = getPagesToRemoveString();
      setInputValue(formattedString);
    }
  }, [pagesToRemove, getPagesToRemoveString, isInputFocused]);

  // Handle input change - allow free typing
  const handleInputChange = (value: string) => {
    setInputValue(value);
    // Parse and update selection in real-time
    onRangeInput(value);
  };

  // Sync when pages are clicked (not typed)
  const handlePageClick = (pageNum: number, isShift: boolean) => {
    if (isShift) {
      onShiftClick(pageNum);
    } else {
      onTogglePage(pageNum);
    }
  };

  return (
    <div className="flex h-full gap-4 lg:flex-row flex-col">
      {/* Left Area - Page Preview */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground">Page Preview</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Click pages to mark them for removal. Hold Shift and click to select a range.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((pageNum) => {
              const isMarkedForRemoval = pagesToRemove.has(pageNum);

              return (
                <div
                  key={pageNum}
                  className={cn(
                    'group relative flex flex-col overflow-hidden rounded-lg border bg-background transition-all',
                    isMarkedForRemoval
                      ? 'border-2 border-destructive bg-destructive/5'
                      : 'border hover:border-primary/50 hover:shadow-sm',
                    'cursor-pointer'
                  )}
                  onClick={(e) => {
                    handlePageClick(pageNum, e.shiftKey);
                  }}>
                  {/* Page Preview */}
                  <div className="relative">
                    <div className={cn(isMarkedForRemoval && 'opacity-50')}>
                      <PagePreview
                        file={file}
                        pageNumber={pageNum}
                        isSelected={false}
                      />
                    </div>

                    {/* Gray Overlay for pages to remove */}
                    {isMarkedForRemoval && (
                      <div className="absolute inset-0 z-20 bg-destructive/20 rounded-lg" />
                    )}

                    {/* Red X Overlay */}
                    {isMarkedForRemoval && (
                      <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none rounded-lg">
                        <XIcon
                          className="h-16 w-16 sm:h-20 sm:w-20 text-destructive drop-shadow-lg"
                          strokeWidth={3}
                        />
                      </div>
                    )}

                    {/* Page Number Badge - Positioned to override PagePreview's badge */}
                    <div
                      className={cn(
                        'absolute left-2 top-2 z-40 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shadow-sm',
                        isMarkedForRemoval
                          ? 'bg-destructive text-destructive-foreground'
                          : 'bg-background/80 text-foreground backdrop-blur-sm'
                      )}>
                      {pageNum}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Controls */}
      <ToolSidebar
        title="Remove Pages"
        subtitle={`${pageCount} ${pageCount === 1 ? 'page' : 'pages'} • ${formatFileSize(
          file.size
        )}`}
        actionButton={{
          label: 'REMOVE PAGES',
          onClick: onRemove,
          disabled: !canRemove || isProcessing,
          isLoading: isProcessing,
          icon: <Trash2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />,
        }}>
        <div className="space-y-4">
          {/* Instructions */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="text-xs sm:text-sm text-foreground">
              Click on pages to remove from document. You can use 'Shift' key to set ranges.
            </p>
          </div>

          {/* Stats */}
          <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Total pages:</span>
              <span className="font-semibold text-foreground">{pageCount}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Pages to remove:</span>
              <span className="font-semibold text-destructive">
                {pagesToRemove.size} {pagesToRemove.size === 1 ? 'page' : 'pages'}
              </span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Pages remaining:</span>
              <span className="font-semibold text-foreground">
                {pageCount - pagesToRemove.size}{' '}
                {pageCount - pagesToRemove.size === 1 ? 'page' : 'pages'}
              </span>
            </div>
          </div>

          {/* Input Field */}
          <div className="space-y-2">
            <Label className="text-xs sm:text-sm font-semibold">Pages to remove</Label>
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder="e.g., 1-3, 5, 7-9"
              className="text-xs sm:text-sm"
            />
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Enter page numbers or ranges separated by commas (e.g., "1-3, 5, 7-9")
            </p>
          </div>

          {/* Warning Messages */}
          {pagesToRemove.size === 0 && (
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3">
              <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-400">
                Please select at least one page to remove.
              </p>
            </div>
          )}

          {pagesToRemove.size >= pageCount && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
              <p className="text-xs sm:text-sm text-destructive">
                Cannot remove all pages. At least one page must remain.
              </p>
            </div>
          )}
        </div>
      </ToolSidebar>
    </div>
  );
}
