'use client';

import { FileText, Wrench, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToolSidebar } from '@/components/shared/ToolSidebar';
import { cn } from '@/lib/utils';
import type { RepairStatus } from '@/hooks/use-repair-pdf';
import { motion } from 'motion/react';

interface RepairWorkspaceProps {
  file: File;
  pageCount: number;
  repairStatus: RepairStatus;
  isProcessing: boolean;
  isSuccess: boolean;
  onRepair: () => void;
  formatFileSize: (bytes: number) => string;
}

export function RepairWorkspace({
  file,
  pageCount,
  repairStatus,
  isProcessing,
  isSuccess,
  onRepair,
  formatFileSize,
}: RepairWorkspaceProps) {
  // Get status message based on repair status
  const getStatusMessage = (): string => {
    switch (repairStatus) {
      case 'idle':
        return 'Ready to rebuild file structure.';
      case 'processing':
        return 'Analyzing and rebuilding document...';
      case 'success':
        return 'PDF repaired successfully!';
      case 'error':
        return 'File is too damaged to recover.';
      default:
        return 'Ready to rebuild file structure.';
    }
  };

  return (
    <div className="flex h-full gap-4 lg:flex-row flex-col">
      {/* Left Area - Visual Status */}
      <div className="flex-1 flex flex-col items-center justify-center overflow-hidden">
        <div className="w-full max-w-2xl">
          {/* Large Visual Container */}
          <div className="relative flex items-center justify-center rounded-xl border-2 border-muted bg-muted/30 p-8 sm:p-12 md:p-16 min-h-[400px] sm:min-h-[500px]">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="h-full w-full bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
            </div>

            {/* Status Icon */}
            <div className="relative z-10 flex flex-col items-center gap-4">
              {repairStatus === 'idle' && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative">
                  <div className="flex h-32 w-32 sm:h-40 sm:w-40 items-center justify-center rounded-full bg-muted">
                    <FileText className="h-16 w-16 sm:h-20 sm:w-20 text-muted-foreground" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-primary">
                    <Wrench className="h-6 w-6 sm:h-7 sm:w-7 text-primary-foreground" />
                  </div>
                </motion.div>
              )}

              {repairStatus === 'processing' && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="flex h-32 w-32 sm:h-40 sm:w-40 items-center justify-center rounded-full bg-primary/20">
                    <FileText className="h-16 w-16 sm:h-20 sm:w-20 text-primary" />
                  </motion.div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="absolute -bottom-2 -right-2 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-primary">
                    <Wrench className="h-6 w-6 sm:h-7 sm:w-7 text-primary-foreground" />
                  </motion.div>
                  {/* Scanning Line Animation */}
                  <motion.div
                    animate={{
                      y: [-200, 200],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute inset-0 flex items-center justify-center">
                    <div className="h-full w-1 bg-primary/30 blur-sm" />
                  </motion.div>
                </motion.div>
              )}

              {repairStatus === 'success' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
                  <div className="relative">
                    <div className="flex h-32 w-32 sm:h-40 sm:w-40 items-center justify-center rounded-full bg-green-500/20">
                      <FileText className="h-16 w-16 sm:h-20 sm:w-20 text-green-600 dark:text-green-400" />
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                      className="absolute -bottom-2 -right-2 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-green-500">
                      <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                    </motion.div>
                    {/* Success Ring Animation */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1.2, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 rounded-full border-4 border-green-500" />
                  </div>
                </motion.div>
              )}

              {repairStatus === 'error' && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative">
                  <div className="flex h-32 w-32 sm:h-40 sm:w-40 items-center justify-center rounded-full bg-destructive/20">
                    <FileText className="h-16 w-16 sm:h-20 sm:w-20 text-destructive" />
                    {/* Crack Effect */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-full w-0.5 rotate-12 bg-destructive/50" />
                      <div className="h-full w-0.5 -rotate-12 bg-destructive/50" />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-destructive">
                    <AlertCircle className="h-6 w-6 sm:h-7 sm:w-7 text-destructive-foreground" />
                  </div>
                </motion.div>
              )}

              {/* Status Text */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-center">
                <h3
                  className={cn(
                    'text-lg sm:text-xl font-semibold',
                    repairStatus === 'success'
                      ? 'text-green-600 dark:text-green-400'
                      : repairStatus === 'error'
                        ? 'text-destructive'
                        : 'text-foreground'
                  )}>
                  {getStatusMessage()}
                </h3>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Controls */}
      <ToolSidebar
        title="Repair PDF"
        subtitle={`${pageCount} ${pageCount === 1 ? 'page' : 'pages'} • ${formatFileSize(
          file.size
        )}`}
        actionButton={{
          label: 'REPAIR PDF',
          onClick: onRepair,
          disabled: isProcessing || repairStatus === 'error',
          isLoading: isProcessing,
          icon: <Wrench className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />,
        }}>
        <div className="space-y-4">
          {/* Instructions */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="text-xs sm:text-sm text-foreground">
              This tool rebuilds the PDF structure to fix damaged or corrupted files.
            </p>
          </div>

          {/* File Card */}
          <div className="rounded-lg border bg-card p-3 sm:p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-xs sm:text-sm font-semibold text-foreground"
                  title={file.name}>
                  {file.name}
                </p>
                <p className="mt-1 text-[10px] sm:text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
          </div>

          {/* Status Info */}
          <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Status:</span>
              <span
                className={cn(
                  'font-semibold',
                  repairStatus === 'success'
                    ? 'text-green-600 dark:text-green-400'
                    : repairStatus === 'error'
                      ? 'text-destructive'
                      : 'text-foreground'
                )}>
                {repairStatus === 'idle' && 'Ready'}
                {repairStatus === 'processing' && 'Processing...'}
                {repairStatus === 'success' && 'Repaired'}
                {repairStatus === 'error' && 'Error'}
              </span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Total pages:</span>
              <span className="font-semibold text-foreground">{pageCount}</span>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
            <p className="text-xs sm:text-sm font-semibold text-foreground">How it works:</p>
            <ul className="space-y-1 text-[10px] sm:text-xs text-muted-foreground">
              <li>• Rebuilds PDF structure by copying pages to a new document</li>
              <li>• Removes broken metadata and corrupted references</li>
              <li>• May not recover files that are completely unreadable</li>
            </ul>
          </div>

          {/* Error Message */}
          {repairStatus === 'error' && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
              <p className="text-xs sm:text-sm text-destructive">
                The file could not be repaired. It may be too damaged or encrypted.
              </p>
            </div>
          )}
        </div>
      </ToolSidebar>
    </div>
  );
}

