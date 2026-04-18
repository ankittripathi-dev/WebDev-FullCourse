'use client';

import { motion, AnimatePresence } from 'motion/react';
import { FileDropzone } from '@/components/shared/FileDropzone';
import { UnlockWorkspace } from '@/components/tools/unlock/UnlockWorkspace';
import { ToolSuccess } from '@/components/shared/ToolSuccess';
import { ToolProgress } from '@/components/shared/ToolProgress';
import { useUnlockPdf } from '@/hooks/use-unlock-pdf';

export default function UnlockPdfPage() {
  const {
    file,
    pageCount,
    password,
    isLocked,
    status,
    isProcessing,
    isSuccess,
    result,
    error,
    progress,
    handleUpload,
    setPassword,
    handleUnlock,
    handleReset,
    formatFileSize,
  } = useUnlockPdf();

  return (
    <div className="w-full h-[90vh] sm:h-[90vh] flex flex-col overflow-hidden">
      {/* Error Message */}
      <AnimatePresence>
        {error && status !== 'error_password' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="shrink-0 border-b border-destructive bg-destructive/10 text-destructive p-3 sm:p-4">
            <p className="font-medium text-sm sm:text-base">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View 1: Upload State */}
      <AnimatePresence mode="wait">
        {!file && !isSuccess && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-auto">
            <FileDropzone
              onFilesSelected={(files) => {
                if (files.length > 0) {
                  handleUpload(files[0]);
                }
              }}
              accept="application/pdf"
              multiple={false}
              title="Unlock PDF"
              subtitle="Remove password protection from your PDF file. Select a PDF file to get started."
            />
          </motion.div>
        )}

        {/* View 2: Workspace State */}
        {file && !isSuccess && !isProcessing && (
          <motion.div
            key="workspace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-hidden p-2 sm:p-4">
            <UnlockWorkspace
              file={file}
              pageCount={pageCount}
              password={password}
              isLocked={isLocked}
              status={status}
              isProcessing={isProcessing}
              onPasswordChange={setPassword}
              onUnlock={handleUnlock}
              formatFileSize={formatFileSize}
            />
          </motion.div>
        )}

        {/* View 2.5: Progress State */}
        {isProcessing && progress && (
          <motion.div
            key="progress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-auto">
            <ToolProgress progress={progress} title="Unlocking PDF" />
          </motion.div>
        )}

        {/* View 3: Success State */}
        {isSuccess && result && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-auto">
            <ToolSuccess
              title="PDF Unlocked Successfully!"
              description={
                isLocked
                  ? 'Password protection has been removed from your PDF file.'
                  : 'Your PDF file is ready to download.'
              }
              fileUrl={result.url}
              fileName={result.filename}
              fileCount={1}
              onReset={handleReset}
              resetLabel="Unlock Another PDF"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

