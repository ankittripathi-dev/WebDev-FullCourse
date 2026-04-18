'use client';

import { motion } from 'motion/react';
import { FileText, Loader2, CheckCircle2, Save } from 'lucide-react';
import type { MergeProgress } from '@/hooks/use-merge-pdf';

interface MergeProgressProps {
  progress: MergeProgress;
}

export function MergeProgress({ progress }: MergeProgressProps) {
  const getStatusIcon = () => {
    switch (progress.status) {
      case 'preparing':
        return <Loader2 className="h-6 w-6 animate-spin text-primary" />;
      case 'processing':
        return <FileText className="h-6 w-6 text-primary" />;
      case 'saving':
        return <Save className="h-6 w-6 text-primary" />;
      case 'complete':
        return <CheckCircle2 className="h-6 w-6 text-primary" />;
    }
  };

  const getStatusText = () => {
    switch (progress.status) {
      case 'preparing':
        return 'Preparing to merge...';
      case 'processing':
        return `Processing ${progress.currentFileName}...`;
      case 'saving':
        return 'Saving merged PDF...';
      case 'complete':
        return 'Merge complete!';
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl">
        {/* Progress Card */}
        <div className="relative overflow-hidden border bg-card shadow-xl">
          {/* Decorative Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

          {/* Content */}
          <div className="relative px-6 py-12 sm:px-12 sm:py-16 text-center">
            {/* Animated Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
              className="mb-8 flex justify-center">
              <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-primary/10">
                {getStatusIcon()}
              </div>
            </motion.div>

            {/* Status Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}>
              <h2 className="mb-4 text-2xl sm:text-3xl font-bold text-foreground">Merging PDFs</h2>
              <p className="mb-2 text-base sm:text-lg text-muted-foreground">{getStatusText()}</p>
              {progress.status === 'processing' && (
                <p className="text-sm text-muted-foreground/80">
                  File {progress.currentFile} of {progress.totalFiles}
                </p>
              )}
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="mx-auto mt-8 max-w-md">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">Progress</span>
                <span className="font-semibold text-primary">{progress.percentage}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.percentage}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-primary to-primary/80"
                />
              </div>
            </motion.div>

            {/* File List (if processing) */}
            {progress.status === 'processing' && progress.currentFileName && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="mx-auto mt-8 max-w-md">
                <div className="flex items-center gap-3 border bg-muted/30 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {progress.currentFileName}
                    </p>
                    <p className="text-xs text-muted-foreground">Processing...</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
