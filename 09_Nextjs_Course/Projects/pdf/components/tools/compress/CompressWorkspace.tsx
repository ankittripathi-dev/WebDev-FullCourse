'use client';

import { Minimize2, ShieldCheck, FileImage, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToolSidebar } from '@/components/shared/ToolSidebar';
import { cn } from '@/lib/utils';
import type { CompressionLevel } from '@/hooks/use-compress-pdf';
import { PdfThumbnail } from '../merge/PdfThumbnail';

interface CompressWorkspaceProps {
  file: File;
  pageCount: number;
  compressionLevel: CompressionLevel;
  isProcessing: boolean;
  onCompress: () => void;
  onCompressionLevelChange: (level: CompressionLevel) => void;
  formatFileSize: (bytes: number) => string;
  getEstimatedReduction: (level: CompressionLevel) => number;
}

export function CompressWorkspace({
  file,
  pageCount,
  compressionLevel,
  isProcessing,
  onCompress,
  onCompressionLevelChange,
  formatFileSize,
  getEstimatedReduction,
}: CompressWorkspaceProps) {
  const estimatedReduction = getEstimatedReduction(compressionLevel);

  const compressionOptions: Array<{
    level: CompressionLevel;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    badge?: string;
  }> = [
    {
      level: 'extreme',
      title: 'Extreme Compression',
      subtitle: 'Less quality, high compression',
      icon: <Minimize2 className="h-5 w-5 sm:h-6 sm:w-6" />,
    },
    {
      level: 'recommended',
      title: 'Recommended Compression',
      subtitle: 'Good quality, good compression',
      icon: <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />,
      badge: 'Recommended',
    },
    {
      level: 'less',
      title: 'Less Compression',
      subtitle: 'High quality, less compression',
      icon: <FileImage className="h-5 w-5 sm:h-6 sm:w-6" />,
    },
  ];

  return (
    <div className="flex h-full gap-4 lg:flex-row flex-col">
      {/* Left Area - File Info & Preview */}
      <div className="flex-1 flex flex-col items-center justify-center overflow-hidden">
        <div className="w-full max-w-md space-y-6">
          {/* File Thumbnail */}
          <div className="flex justify-center">
            <div className="relative w-48 h-64 sm:w-56 sm:h-80 rounded-xl border-2 border-primary/20 bg-muted/30 overflow-hidden shadow-lg">
              <PdfThumbnail
                file={file}
                className="h-full w-full"
              />
            </div>
          </div>

          {/* File Stats */}
          <div className="space-y-3 rounded-lg border bg-card p-4 sm:p-6">
            <div className="flex justify-between items-center text-sm sm:text-base">
              <span className="text-muted-foreground">Current Size:</span>
              <span className="font-semibold text-foreground">{formatFileSize(file.size)}</span>
            </div>
            <div className="flex justify-between items-center text-sm sm:text-base">
              <span className="text-muted-foreground">Total Pages:</span>
              <span className="font-semibold text-foreground">
                {pageCount} {pageCount === 1 ? 'page' : 'pages'}
              </span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="text-muted-foreground">Estimated Reduction:</span>
                <span className="font-semibold text-primary">~{estimatedReduction}% smaller</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Actual reduction may vary based on PDF content
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Compression Options */}
      <ToolSidebar
        title="Compress PDF"
        subtitle={`${pageCount} ${pageCount === 1 ? 'page' : 'pages'} • ${formatFileSize(
          file.size
        )}`}
        actionButton={{
          label: 'COMPRESS PDF',
          onClick: onCompress,
          disabled: isProcessing,
          isLoading: isProcessing,
          icon: <Zap className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />,
        }}>
        <div className="space-y-4">
          {/* Instructions */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="text-xs sm:text-sm text-foreground">
              Choose a compression level based on your quality and size requirements.
            </p>
          </div>

          {/* Compression Level Options */}
          <div className="space-y-3">
            {compressionOptions.map((option) => {
              const isSelected = compressionLevel === option.level;
              return (
                <button
                  key={option.level}
                  onClick={() => onCompressionLevelChange(option.level)}
                  className={cn(
                    'w-full text-left rounded-lg border-2 p-4 transition-all',
                    'hover:border-primary/40 hover:bg-muted/50',
                    isSelected ? 'border-primary bg-primary/5 shadow-md' : 'border-muted bg-card'
                  )}>
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      )}>
                      {option.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-semibold text-foreground">
                          {option.title}
                        </h3>
                        {option.badge && (
                          <span className="shrink-0 rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-green-600 dark:text-green-400">
                            {option.badge}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                        {option.subtitle}
                      </p>
                      {isSelected && (
                        <div className="mt-2 text-xs font-medium text-primary">
                          Estimated: ~{getEstimatedReduction(option.level)}% reduction
                        </div>
                      )}
                    </div>
                    {/* Radio Indicator */}
                    <div className="shrink-0">
                      <div
                        className={cn(
                          'h-5 w-5 rounded-full border-2 flex items-center justify-center',
                          isSelected
                            ? 'border-primary bg-primary'
                            : 'border-muted-foreground/30 bg-background'
                        )}>
                        {isSelected && (
                          <div className="h-2.5 w-2.5 rounded-full bg-primary-foreground" />
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Info */}
          <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
            <p className="text-xs sm:text-sm font-semibold text-foreground">Note:</p>
            <ul className="space-y-1 text-[10px] sm:text-xs text-muted-foreground">
              <li>• Compression reduces file size by optimizing PDF structure</li>
              <li>• Higher compression may slightly reduce image quality</li>
              <li>• Recommended level balances quality and size</li>
            </ul>
          </div>
        </div>
      </ToolSidebar>
    </div>
  );
}
