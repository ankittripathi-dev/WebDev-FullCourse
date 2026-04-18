'use client';

import { useCallback, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
  onFilesSelected: (files: FileList | File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
  title?: string;
  subtitle?: string;
}

export function FileDropzone({
  onFilesSelected,
  accept = '.pdf',
  multiple = true,
  maxFiles,
  className,
  title,
  subtitle,
}: FileDropzoneProps) {
  const [isError, setIsError] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setIsError(false);

      // Check max files limit
      if (maxFiles && acceptedFiles.length > maxFiles) {
        setIsError(true);
        return;
      }

      if (acceptedFiles.length > 0) {
        onFilesSelected(acceptedFiles);
      }
    },
    [maxFiles, onFilesSelected]
  );

  const onDropRejected = useCallback(() => {
    setIsError(true);
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    onDropRejected,
    accept: accept === '.pdf' ? { 'application/pdf': ['.pdf'] } : undefined,
    multiple,
    maxFiles,
    noClick: true,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'w-full h-full min-h-screen flex flex-col items-center justify-center px-4 py-12 outline-none',
        className
      )}>
      <input {...getInputProps()} />
      
      {/* Title and Subtitle */}
      {(title || subtitle) && (
        <div className="mb-6 sm:mb-8 md:mb-12 text-center max-w-2xl px-4 relative z-10">
          {title && (
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2 sm:mb-4">
              <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                {title}
              </span>
            </h1>
          )}
          {subtitle && (
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-2">{subtitle}</p>
          )}
        </div>
      )}

      {/* Dropzone Box */}
      <div
        onClick={open}
        className={cn(
          'relative w-full max-w-2xl flex flex-col items-center justify-center border-2 border-dashed transition-all cursor-pointer',
          'bg-background hover:bg-muted/30 hover:border-primary/50',
          isDragActive && 'bg-primary/5 border-primary shadow-lg scale-105',
          isError && 'border-destructive bg-destructive/5',
          'min-h-[300px] sm:min-h-[400px]'
        )}>

        <div className="flex flex-col items-center gap-4 sm:gap-6 text-center p-6 sm:p-8 md:p-12">
          <motion.div
            animate={{ scale: isDragActive ? 1.15 : 1, y: isDragActive ? -5 : 0 }}
            transition={{ duration: 0.2 }}>
            <div
              className={cn(
                'flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full transition-colors',
                isDragActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
              )}>
              <Upload className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
          </motion.div>

          <div className="space-y-2">
            <p className="text-base sm:text-lg md:text-xl font-semibold text-foreground px-2">
              {isDragActive ? 'Drop files anywhere!' : 'Drop PDF files or click to browse'}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground px-2">
              {multiple ? 'Select multiple PDF files to merge' : 'Select a PDF file'}
              {maxFiles && ` (Max ${maxFiles} files)`}
            </p>
          </div>

          <AnimatePresence>
            {isError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 px-4 py-2 rounded-md">
                <X className="h-4 w-4" />
                <span>Please select valid PDF files only</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Full screen drag overlay indication */}
      {isDragActive && (
        <div className="absolute inset-0 z-0 bg-primary/5 pointer-events-none" />
      )}
    </div>
  );
}
