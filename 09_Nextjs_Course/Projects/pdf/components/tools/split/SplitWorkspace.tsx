'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Scissors, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToolSidebar } from '@/components/shared/ToolSidebar';
import { cn } from '@/lib/utils';
import type { SplitMode, RangeConfig, PagesConfig, SizeConfig } from '@/hooks/use-split-pdf';
import { PagePreview } from './PagePreview';

// Component for individual range input with local state
function RangeInput({
  range,
  index,
  pageCount,
  updateCustomRange,
  removeCustomRange,
  canRemove,
}: {
  range: { from: number; to: number };
  index: number;
  pageCount: number;
  updateCustomRange: (index: number, field: 'from' | 'to', value: number) => void;
  removeCustomRange: (index: number) => void;
  canRemove: boolean;
}) {
  const [localFrom, setLocalFrom] = useState<string>(String(range.from));
  const [localTo, setLocalTo] = useState<string>(String(range.to));

  // Sync local state when range changes externally
  useEffect(() => {
    setLocalFrom(String(range.from));
    setLocalTo(String(range.to));
  }, [range.from, range.to]);

  return (
    <div className="rounded-lg border border-border bg-card p-3 space-y-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs sm:text-sm font-semibold text-foreground">Range {index + 1}</span>
        {canRemove && (
          <button
            onClick={() => removeCustomRange(index)}
            className="p-1 text-muted-foreground hover:text-destructive transition-colors rounded">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 space-y-1">
          <Label className="text-[10px] sm:text-xs text-muted-foreground">From Page</Label>
          <Input
            type="number"
            value={localFrom}
            onChange={(e) => {
              const val = e.target.value;
              setLocalFrom(val);
              // Update parent state while typing for real-time preview
              // Only update if we have a valid number
              if (val !== '') {
                const numVal = parseInt(val, 10);
                if (!isNaN(numVal) && numVal >= 1) {
                  // Update parent state - let hook handle clamping if needed
                  updateCustomRange(index, 'from', numVal);
                }
              }
            }}
            onBlur={(e) => {
              const val = e.target.value;
              const numVal = parseInt(val, 10);
              if (val === '' || isNaN(numVal) || numVal < 1) {
                updateCustomRange(index, 'from', 1);
              } else if (numVal > pageCount) {
                updateCustomRange(index, 'from', pageCount);
              } else {
                updateCustomRange(index, 'from', numVal);
              }
            }}
            className="text-xs sm:text-sm"
          />
        </div>
        <div className="flex items-center pt-6">
          <span className="text-muted-foreground">-</span>
        </div>
        <div className="flex-1 space-y-1">
          <Label className="text-[10px] sm:text-xs text-muted-foreground">To Page</Label>
          <Input
            type="number"
            value={localTo}
            onChange={(e) => {
              const val = e.target.value;
              setLocalTo(val);
              // Update parent state while typing for real-time preview
              // Only update if we have a valid number
              if (val !== '') {
                const numVal = parseInt(val, 10);
                if (!isNaN(numVal) && numVal >= 1) {
                  // Update parent state - let hook handle clamping if needed
                  updateCustomRange(index, 'to', numVal);
                }
              }
            }}
            onBlur={(e) => {
              const val = e.target.value;
              const numVal = parseInt(val, 10);
              const currentFrom = parseInt(localFrom, 10) || range.from;
              if (val === '' || isNaN(numVal) || numVal < currentFrom) {
                updateCustomRange(index, 'to', currentFrom);
              } else if (numVal > pageCount) {
                updateCustomRange(index, 'to', pageCount);
              } else {
                updateCustomRange(index, 'to', numVal);
              }
            }}
            className="text-xs sm:text-sm"
          />
        </div>
      </div>
      <p className="text-[10px] sm:text-xs text-muted-foreground">
        Pages {range.from} to {range.to} ({range.to - range.from + 1} page
        {range.to - range.from + 1 !== 1 ? 's' : ''})
      </p>
    </div>
  );
}

interface SplitWorkspaceProps {
  file: File;
  pageCount: number;
  splitMode: SplitMode;
  setSplitMode: (mode: SplitMode) => void;
  rangeConfig: RangeConfig;
  setRangeConfig: (config: RangeConfig) => void;
  pagesConfig: PagesConfig;
  setPagesConfig: (config: PagesConfig) => void;
  sizeConfig: SizeConfig;
  setSizeConfig: (config: SizeConfig) => void;
  isProcessing: boolean;
  onSplit: () => void;
  formatFileSize: (bytes: number) => string;
  togglePageSelection: (pageNumber: number) => void;
  addCustomRange: () => void;
  removeCustomRange: (index: number) => void;
  updateCustomRange: (index: number, field: 'from' | 'to', value: number) => void;
}

export function SplitWorkspace({
  file,
  pageCount,
  splitMode,
  setSplitMode,
  rangeConfig,
  setRangeConfig,
  pagesConfig,
  setPagesConfig,
  sizeConfig,
  setSizeConfig,
  isProcessing,
  onSplit,
  formatFileSize,
  togglePageSelection,
  addCustomRange,
  removeCustomRange,
  updateCustomRange,
}: SplitWorkspaceProps) {
  // Force preview refresh on tab switch
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    setPreviewKey((prev) => prev + 1);
  }, [splitMode]);

  const modes: { value: SplitMode; label: string }[] = [
    { value: 'range', label: 'By Range' },
    { value: 'pages', label: 'By Pages' },
    { value: 'size', label: 'By Size' },
  ];

  return (
    <div className="flex h-full gap-4 lg:flex-row flex-col">
      {/* Left Area - Page Preview */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground">Page Preview</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {splitMode === 'pages' && pagesConfig.mode === 'select'
              ? 'Click pages to select them for extraction'
              : 'Preview all pages in your PDF'}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div
            key={previewKey}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((pageNum) => {
              // Determine which range this page belongs to (if in range mode)
              let rangeLabel: string | undefined;
              if (splitMode === 'range' && rangeConfig.mode === 'custom') {
                const rangeIndex = rangeConfig.customRanges.findIndex(
                  (range) => pageNum >= range.from && pageNum <= range.to
                );
                if (rangeIndex !== -1) {
                  rangeLabel = `Range ${rangeIndex + 1}`;
                }
              }

              return (
                <PagePreview
                  key={`${previewKey}-${pageNum}`}
                  file={file}
                  pageNumber={pageNum}
                  isSelected={pagesConfig.selectedPages.includes(pageNum)}
                  rangeLabel={rangeLabel}
                  onClick={
                    splitMode === 'pages' && pagesConfig.mode === 'select'
                      ? () => togglePageSelection(pageNum)
                      : undefined
                  }
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Controls */}
      <ToolSidebar
        title="Split PDF"
        subtitle={`${pageCount} ${pageCount === 1 ? 'page' : 'pages'} • ${formatFileSize(
          file.size
        )}`}
        actionButton={{
          label: 'SPLIT PDF',
          onClick: onSplit,
          disabled: isProcessing,
          isLoading: isProcessing,
          icon: <Scissors className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />,
        }}>
        {/* Mode Tabs */}
        <div className="space-y-2">
          <Label className="text-xs sm:text-sm font-semibold uppercase tracking-wide">
            Split Mode
          </Label>
          <div className="flex gap-2 border-b border-border">
            {modes.map((mode) => (
              <button
                key={mode.value}
                onClick={() => setSplitMode(mode.value)}
                className={cn(
                  'relative flex-1 px-3 py-2 text-xs sm:text-sm font-medium transition-colors',
                  splitMode === mode.value
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}>
                {splitMode === mode.value && (
                  <motion.div
                    layoutId="activeSplitTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{mode.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mode-Specific Controls */}
        <div className="space-y-4">
          {/* Range Mode */}
          {splitMode === 'range' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm font-semibold">Range Type</Label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setRangeConfig({ ...rangeConfig, mode: 'custom' })}
                    className={cn(
                      'flex-1 px-3 py-2 text-xs sm:text-sm rounded-md border transition-colors',
                      rangeConfig.mode === 'custom'
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-foreground border-border hover:bg-muted'
                    )}>
                    Custom
                  </button>
                  <button
                    onClick={() => setRangeConfig({ ...rangeConfig, mode: 'fixed' })}
                    className={cn(
                      'flex-1 px-3 py-2 text-xs sm:text-sm rounded-md border transition-colors',
                      rangeConfig.mode === 'fixed'
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-foreground border-border hover:bg-muted'
                    )}>
                    Fixed Step
                  </button>
                </div>
              </div>

              {rangeConfig.mode === 'custom' ? (
                <div className="space-y-3">
                  <Label className="text-xs sm:text-sm font-semibold">Page Ranges</Label>
                  <div className="space-y-3">
                    {rangeConfig.customRanges.map((range, index) => (
                      <RangeInput
                        key={index}
                        range={range}
                        index={index}
                        pageCount={pageCount}
                        updateCustomRange={updateCustomRange}
                        removeCustomRange={removeCustomRange}
                        canRemove={rangeConfig.customRanges.length > 1}
                      />
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addCustomRange}
                    className="w-full text-xs sm:text-sm">
                    <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Add Range
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm font-semibold">Split every X pages</Label>
                  <Input
                    type="number"
                    min="1"
                    max={pageCount}
                    value={rangeConfig.fixedStep}
                    onChange={(e) =>
                      setRangeConfig({
                        ...rangeConfig,
                        fixedStep: Math.max(1, Math.min(pageCount, parseInt(e.target.value) || 1)),
                      })
                    }
                    className="text-xs sm:text-sm"
                  />
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    This will create {Math.ceil(pageCount / rangeConfig.fixedStep)} PDF file
                    {Math.ceil(pageCount / rangeConfig.fixedStep) !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Pages Mode */}
          {splitMode === 'pages' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm font-semibold">Extract Mode</Label>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setPagesConfig({ ...pagesConfig, mode: 'all', selectedPages: [] })
                    }
                    className={cn(
                      'flex-1 px-3 py-2 text-xs sm:text-sm rounded-md border transition-colors',
                      pagesConfig.mode === 'all'
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-foreground border-border hover:bg-muted'
                    )}>
                    All Pages
                  </button>
                  <button
                    onClick={() => setPagesConfig({ ...pagesConfig, mode: 'select' })}
                    className={cn(
                      'flex-1 px-3 py-2 text-xs sm:text-sm rounded-md border transition-colors',
                      pagesConfig.mode === 'select'
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-foreground border-border hover:bg-muted'
                    )}>
                    Select Pages
                  </button>
                </div>
              </div>

              {pagesConfig.mode === 'select' && (
                <div className="space-y-3">
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                    <p className="text-xs sm:text-sm text-foreground">
                      Click pages on the left to select them.
                    </p>
                    <p className="mt-1 text-[10px] sm:text-xs text-muted-foreground">
                      {pagesConfig.selectedPages.length} page
                      {pagesConfig.selectedPages.length !== 1 ? 's' : ''} selected
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="merge-output"
                      checked={pagesConfig.mergeOutput}
                      onCheckedChange={(checked) =>
                        setPagesConfig({ ...pagesConfig, mergeOutput: checked === true })
                      }
                    />
                    <Label
                      htmlFor="merge-output"
                      className="text-xs sm:text-sm font-normal cursor-pointer">
                      Merge extracted pages into one PDF file?
                    </Label>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Size Mode */}
          {splitMode === 'size' && (
            <div className="space-y-4">
              <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Original file size:</span>
                  <span className="font-semibold text-foreground">{formatFileSize(file.size)}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Total pages:</span>
                  <span className="font-semibold text-foreground">{pageCount}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs sm:text-sm font-semibold">Maximum size per file</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="0.1"
                    step={sizeConfig.unit === 'KB' ? '1' : '0.1'}
                    value={sizeConfig.maxSize}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      const minValue = sizeConfig.unit === 'KB' ? 1 : 0.1;
                      setSizeConfig({
                        ...sizeConfig,
                        maxSize: Math.max(minValue, value),
                      });
                    }}
                    className="flex-1 text-xs sm:text-sm"
                  />
                  <Select
                    value={sizeConfig.unit}
                    onValueChange={(value) => {
                      const newUnit = value as 'KB' | 'MB';
                      // Convert current maxSize to new unit
                      const currentSizeBytes =
                        sizeConfig.maxSize * (sizeConfig.unit === 'KB' ? 1024 : 1024 * 1024);
                      const newMaxSize =
                        newUnit === 'KB'
                          ? Math.max(1, Math.floor(currentSizeBytes / 1024))
                          : Math.max(0.1, Math.round((currentSizeBytes / (1024 * 1024)) * 10) / 10);
                      setSizeConfig({
                        ...sizeConfig,
                        unit: newUnit,
                        maxSize: newMaxSize,
                      });
                    }}
                    disabled={file.size < 1024 * 1024}>
                    <SelectTrigger className="w-[100px] text-xs sm:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KB">KB</SelectItem>
                      <SelectItem
                        value="MB"
                        disabled={file.size < 1024 * 1024}>
                        MB
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  This PDF will be split into files no larger than{' '}
                  {sizeConfig.unit === 'KB'
                    ? Math.round(sizeConfig.maxSize)
                    : parseFloat(sizeConfig.maxSize.toFixed(1))}{' '}
                  {sizeConfig.unit} each.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allow-compression"
                    checked={sizeConfig.allowCompression}
                    onCheckedChange={(checked) =>
                      setSizeConfig({ ...sizeConfig, allowCompression: checked === true })
                    }
                  />
                  <Label
                    htmlFor="allow-compression"
                    className="text-xs sm:text-sm font-normal cursor-pointer">
                    Allow compression
                  </Label>
                  <div className="relative group shrink-0">
                    <Info className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground cursor-help" />
                    <div className="absolute right-0 top-full mt-2 w-44 max-w-[calc(100vw-2rem)] sm:max-w-none p-2 text-[10px] sm:text-xs bg-popover border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      Compressing files reduces their size to help meet the limit, but may lower
                      quality.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ToolSidebar>
    </div>
  );
}
