'use client';

import { motion, AnimatePresence } from 'motion/react';
import { FileDropzone } from '@/components/shared/FileDropzone';
import { ProtectWorkspace } from '@/components/tools/protect/ProtectWorkspace';
import { ToolSuccess } from '@/components/shared/ToolSuccess';
import { ToolProgress } from '@/components/shared/ToolProgress';
import { useProtectPdf } from '@/hooks/use-protect-pdf';

export default function ProtectPdfPage() {
  const {
    file,
    pageCount,
    passwords,
    isProcessing,
    isSuccess,
    result,
    error,
    progress,
    handleUpload,
    setPassword,
    setConfirm,
    handleProtect,
    handleReset,
    formatFileSize,
    validatePasswords,
  } = useProtectPdf();

  return (
    <div className="w-full h-[90vh] sm:h-[90vh] flex flex-col overflow-hidden">
      {/* Error Message */}
      <AnimatePresence>
        {error && (
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
              title="Protect PDF"
              subtitle="Encrypt your PDF file with a password. Select a PDF file to get started."
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
            <ProtectWorkspace
              file={file}
              pageCount={pageCount}
              passwords={passwords}
              isProcessing={isProcessing}
              onPasswordChange={setPassword}
              onConfirmChange={setConfirm}
              onProtect={handleProtect}
              formatFileSize={formatFileSize}
              validatePasswords={validatePasswords}
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
            <ToolProgress
              progress={progress}
              title="Protecting PDF"
            />
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
              title="PDF Protected Successfully!"
              description="Your PDF file has been encrypted with a password. Keep your password safe as it cannot be recovered."
              fileUrl={result.url}
              fileName={result.filename}
              fileCount={1}
              onReset={handleReset}
              resetLabel="Protect Another PDF"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
