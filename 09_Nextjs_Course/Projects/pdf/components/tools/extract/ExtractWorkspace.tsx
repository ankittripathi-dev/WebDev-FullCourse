'use client';

import { useState, useEffect } from 'react';
import { FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ToolSidebar } from '@/components/shared/ToolSidebar';
import { cn } from '@/lib/utils';
import { PagePreview } from '../split/PagePreview';

interface ExtractWorkspaceProps {
  file: File;
  pageCount: number;
  selectedPages: Set<number>;
  mergeOutput: boolean;
  isProcessing: boolean;
  onExtract: () => void;
  onTogglePage: (pageIndex: number) => void;
  onShiftClick: (pageIndex: number) => void;
  onRangeInput: (input: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onMergeOutputChange: (value: boolean) => void;
  formatFileSize: (bytes: number) => string;
  getSelectedPagesString: () => string;
}

export function ExtractWorkspace({
  file,
  pageCount,
  selectedPages,
  mergeOutput,
  isProcessing,
  onExtract,
  onTogglePage,
  onShiftClick,
  onRangeInput,
  onSelectAll,
  onDeselectAll,
  onMergeOutputChange,
  formatFileSize,
  getSelectedPagesString,
}: ExtractWorkspaceProps) {
  // Local state for input to allow free typing
  const [inputValue, setInputValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const canExtract = selectedPages.size > 0;

  // Sync input when pages are selected via clicks (but not when input is focused/typing)
  useEffect(() => {
    if (!isInputFocused) {
      const formattedString = getSelectedPagesString();
      setInputValue(formattedString);
    }
  }, [selectedPages, getSelectedPagesString, isInputFocused]);

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
            Click pages to select them for extraction. Hold Shift and click to select a range.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((pageNum) => {
              const isSelected = selectedPages.has(pageNum);

              return (
                <div
                  key={pageNum}
                  className="cursor-pointer"
                  onClick={(e) => {
                    handlePageClick(pageNum, e.shiftKey);
                  }}>
                  <PagePreview
                    file={file}
                    pageNumber={pageNum}
                    isSelected={isSelected}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Controls */}
      <ToolSidebar
        title="Extract Pages"
        subtitle={`${pageCount} ${pageCount === 1 ? 'page' : 'pages'} • ${formatFileSize(
          file.size
        )}`}
        actionButton={{
          label: 'EXTRACT PAGES',
          onClick: onExtract,
          disabled: !canExtract || isProcessing,
          isLoading: isProcessing,
          icon: <FileCheck className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />,
        }}>
        <div className="space-y-4">
          {/* Instructions */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="text-xs sm:text-sm text-foreground">
              Select pages to extract. You can use 'Shift' key to set ranges.
            </p>
          </div>

          {/* Stats */}
          <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Total pages:</span>
              <span className="font-semibold text-foreground">{pageCount}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Pages selected:</span>
              <span className="font-semibold text-primary">
                {selectedPages.size} {selectedPages.size === 1 ? 'page' : 'pages'}
              </span>
            </div>
          </div>

          {/* Input Field */}
          <div className="space-y-2">
            <Label className="text-xs sm:text-sm font-semibold">Pages to extract</Label>
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder="e.g., 1, 3, 5 or 1-5"
              className="text-xs sm:text-sm"
            />
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Enter page numbers or ranges separated by commas (e.g., "1-3, 5, 7-9")
            </p>
          </div>

          {/* Select All / Deselect All Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onSelectAll}
              className="flex-1 text-xs sm:text-sm"
              disabled={selectedPages.size === pageCount}>
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDeselectAll}
              className="flex-1 text-xs sm:text-sm"
              disabled={selectedPages.size === 0}>
              Deselect All
            </Button>
          </div>

          {/* Extraction Options */}
          <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="merge-output"
                checked={mergeOutput}
                onCheckedChange={(checked) => onMergeOutputChange(checked === true)}
              />
              <Label
                htmlFor="merge-output"
                className="text-xs sm:text-sm font-normal cursor-pointer">
                Merge extracted pages into one PDF file
              </Label>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              {mergeOutput
                ? 'All selected pages will be combined into a single PDF file.'
                : 'Each selected page will be saved as a separate PDF file.'}
            </p>
          </div>

          {/* Warning Message */}
          {selectedPages.size === 0 && (
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3">
              <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-400">
                Please select at least one page to extract.
              </p>
            </div>
          )}
        </div>
      </ToolSidebar>
    </div>
  );
}
