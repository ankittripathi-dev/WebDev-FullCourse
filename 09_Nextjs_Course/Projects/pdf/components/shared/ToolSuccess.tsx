'use client';

import { motion } from 'motion/react';
import { CheckCircle2, Download, RotateCcw, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ToolSuccessProps {
  title: string;
  description: string;
  fileUrl?: string;
  fileName?: string;
  fileCount?: number;
  results?: Array<{ url: string; filename: string; pageCount?: number }>;
  onReset: () => void;
  resetLabel?: string;
}

export function ToolSuccess({
  title,
  description,
  fileUrl,
  fileName,
  fileCount,
  results,
  onReset,
  resetLabel = 'Start Over',
}: ToolSuccessProps) {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-6 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl">
        {/* Success Card Container */}
        <div className="relative overflow-hidden border bg-card shadow-xl">
          {/* Decorative Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

          {/* Content */}
          <div className="relative px-4 py-8 sm:px-6 sm:py-12 md:px-12 md:py-16 text-center">
            {/* Animated Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
              className="mb-6 flex justify-center">
              <div className="relative">
                {/* Outer Glow Ring */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
                />
                {/* Icon Container */}
                <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                  <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-primary-foreground" />
                </div>
                {/* Sparkle Effects */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute -right-1 -top-1 sm:-right-2 sm:-top-2">
                  <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-accent" />
                </motion.div>
              </div>
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}>
              <h2 className="mb-2 sm:mb-3 text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                {title}
              </h2>
              <p className="mb-2 text-base sm:text-lg text-muted-foreground">{description}</p>
              {fileCount !== undefined && (
                <p className="mx-auto max-w-md text-xs sm:text-sm text-muted-foreground/80 px-2">
                  {fileCount} {fileCount === 1 ? 'file' : 'files'} processed successfully.
                </p>
              )}
            </motion.div>

            {/* Single File Preview Card */}
            {fileUrl && fileName && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="mx-auto mt-6 sm:mt-8 max-w-xs">
                <div className="flex items-center gap-2 sm:gap-3 border bg-muted/30 p-3 sm:p-4">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center bg-primary/10 text-primary">
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate text-xs sm:text-sm font-semibold text-foreground">
                      {fileName}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Ready to download</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Multiple Results Grid */}
            {results && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="mx-auto mt-6 sm:mt-8 max-w-4xl">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {results.map((result, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="group relative overflow-hidden rounded-lg border bg-muted/30 p-3 sm:p-4 transition-all hover:border-primary hover:shadow-md">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-xs sm:text-sm font-semibold text-foreground">
                            {result.filename}
                          </p>
                          {result.pageCount !== undefined && (
                            <p className="mt-1 text-[10px] sm:text-xs text-muted-foreground">
                              {result.pageCount} {result.pageCount === 1 ? 'page' : 'pages'}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        asChild
                        className="w-full text-xs sm:text-sm">
                        <a href={result.url} download={result.filename}>
                          <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          Download
                        </a>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="mt-6 sm:mt-10 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:justify-center">
              {fileUrl && (
                <Button
                  size="lg"
                  asChild
                  className={cn(
                    ' text-sm sm:text-base font-semibold shadow-lg',
                    'bg-primary hover:scale-105 hover:shadow-primary/25 transition-all'
                  )}>
                  <a href={fileUrl} download={fileName || 'download.pdf'}>
                    <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Download
                  </a>
                </Button>
              )}

              <Button
                size="lg"
                variant="outline"
                onClick={onReset}
                className={cn(
                  ' text-sm sm:text-base font-semibold',
                  'border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/40',
                  'transition-all'
                )}>
                <RotateCcw className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                {resetLabel}
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Additional Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="mt-6 text-center text-xs text-muted-foreground">
          Your files are processed securely in your browser. No data is sent to our servers.
        </motion.p>
      </motion.div>
    </div>
  );
}

