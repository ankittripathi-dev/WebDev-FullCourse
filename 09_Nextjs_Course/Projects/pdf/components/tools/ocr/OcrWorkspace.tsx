'use client';

import { useState } from 'react';
import { FileText, Languages, X, Copy, Check, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToolSidebar } from '@/components/shared/ToolSidebar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import type { OcrStatus, OcrProgress } from '@/hooks/use-ocr-pdf';
import { OCR_LANGUAGES } from '@/hooks/use-ocr-pdf';
import { PdfThumbnail } from '../merge/PdfThumbnail';
import { PagePreview } from '../split/PagePreview';
import { Progress } from '@/components/ui/progress';

interface OcrWorkspaceProps {
  file: File;
  pageCount: number;
  selectedLanguages: string[];
  ocrStatus: OcrStatus;
  isProcessing: boolean;
  isSuccess: boolean;
  extractedText?: string;
  ocrProgress?: OcrProgress | null;
  onAddLanguage: (code: string) => void;
  onRemoveLanguage: (code: string) => void;
  onOCR: () => void;
  formatFileSize: (bytes: number) => string;
}

export function OcrWorkspace({
  file,
  pageCount,
  selectedLanguages,
  ocrStatus,
  isProcessing,
  isSuccess,
  extractedText,
  ocrProgress,
  onAddLanguage,
  onRemoveLanguage,
  onOCR,
  formatFileSize,
}: OcrWorkspaceProps) {
  const [isTextCopied, setIsTextCopied] = useState(false);
  const [showTextPreview, setShowTextPreview] = useState(false);

  // Get language info for selected languages
  const getLanguageInfo = (code: string) => {
    return OCR_LANGUAGES.find((lang) => lang.code === code);
  };

  // Copy text to clipboard
  const handleCopyText = async () => {
    if (!extractedText) return;
    try {
      await navigator.clipboard.writeText(extractedText);
      setIsTextCopied(true);
      setTimeout(() => setIsTextCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="flex h-full gap-4 lg:flex-row flex-col">
      {/* Left Area - PDF Preview */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page Grid */}
        {!isSuccess ? (
          <div className="flex-1 overflow-auto p-2 sm:p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-3 sm:gap-4">
              {Array.from({ length: pageCount }).map((_, index) => (
                <div
                  key={index}
                  className="relative">
                  <PagePreview
                    file={file}
                    pageNumber={index + 1}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Text Preview Overlay */
          <div className="flex-1 overflow-auto p-4 sm:p-6">
            <div className="max-w-4xl mx-auto">
              <div className="rounded-lg border bg-card shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between border-b p-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Extracted Text</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {extractedText?.split('\n').length} lines extracted
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyText}
                      className="gap-2">
                      {isTextCopied ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Text Content */}
                <div className="p-4 sm:p-6">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-foreground bg-muted/30 rounded p-4 max-h-[60vh] overflow-auto">
                    {extractedText || 'No text extracted.'}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Controls */}
      <ToolSidebar
        title="OCR PDF"
        subtitle={`${pageCount} ${pageCount === 1 ? 'page' : 'pages'} • ${formatFileSize(
          file.size
        )}`}
        actionButton={{
          label: 'RECOGNIZE TEXT',
          onClick: onOCR,
          disabled: isProcessing || ocrStatus === 'error' || selectedLanguages.length === 0,
          isLoading: isProcessing,
          icon: <FileText className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />,
        }}>
        <div className="space-y-4">
          {/* Instructions */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="text-xs sm:text-sm text-foreground">
              Extract text from scanned PDF images using OCR technology.
            </p>
          </div>

          {/* Language Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-muted-foreground" />
              <label className="text-sm font-semibold text-foreground">Source Languages</label>
            </div>

            {/* Language Selector */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  disabled={isProcessing}>
                  <Search className="mr-2 h-4 w-4 opacity-50" />
                  <span className="text-sm">Search languages...</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[300px] p-0"
                align="start">
                <Command>
                  <CommandInput placeholder="Search languages..." />
                  <CommandList>
                    <CommandEmpty>No language found.</CommandEmpty>
                    <CommandGroup>
                      {OCR_LANGUAGES.map((language) => {
                        const isSelected = selectedLanguages.includes(language.code);
                        return (
                          <CommandItem
                            key={language.code}
                            onSelect={() => {
                              if (isSelected) {
                                onRemoveLanguage(language.code);
                              } else {
                                onAddLanguage(language.code);
                              }
                            }}
                            className={cn(
                              'cursor-pointer',
                              isSelected && 'bg-accent text-accent-foreground'
                            )}>
                            <div className="flex items-center gap-2 flex-1">
                              <span>{language.flag}</span>
                              <span className="flex-1">{language.name}</span>
                              {isSelected && <Check className="h-4 w-4" />}
                            </div>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Selected Languages */}
            {selectedLanguages.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedLanguages.map((code) => {
                  const lang = getLanguageInfo(code);
                  if (!lang) return null;
                  return (
                    <Badge
                      key={code}
                      variant="secondary"
                      className="gap-1.5 px-2 py-1 text-xs">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                      <button
                        onClick={() => onRemoveLanguage(code)}
                        disabled={selectedLanguages.length === 1 || isProcessing}
                        className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          {/* Progress Bar (during processing) */}
          {isProcessing && ocrProgress && (
            <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-medium text-foreground">{ocrProgress.status}</span>
                <span className="font-semibold text-primary">
                  {Math.round(ocrProgress.progress)}%
                </span>
              </div>
              <Progress
                value={ocrProgress.progress}
                className="h-2"
              />
              {ocrProgress.currentPage && ocrProgress.totalPages && (
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Page {ocrProgress.currentPage} of {ocrProgress.totalPages}
                </p>
              )}
            </div>
          )}

          {/* Info */}
          {!isProcessing && (
            <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
              <p className="text-xs sm:text-sm font-semibold text-foreground">Note:</p>
              <ul className="space-y-1 text-[10px] sm:text-xs text-muted-foreground">
                <li>• OCR works best on clear, high-quality scanned documents</li>
                <li>• Processing time depends on page count and image quality</li>
                <li>• Results are extracted as plain text</li>
              </ul>
            </div>
          )}

          {/* Error Message */}
          {ocrStatus === 'error' && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
              <p className="text-xs sm:text-sm text-destructive">
                OCR processing failed. Please try again or check if the PDF contains readable
                images.
              </p>
            </div>
          )}
        </div>
      </ToolSidebar>
    </div>
  );
}
