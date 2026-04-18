'use client';

import { motion, AnimatePresence } from 'motion/react';
import { FileDropzone } from '@/components/shared/FileDropzone';
import { RotateWorkspace } from '@/components/tools/rotate/RotateWorkspace';
import { ToolSuccess } from '@/components/shared/ToolSuccess';
import { ToolProgress } from '@/components/shared/ToolProgress';
import { PasswordPrompt } from '@/components/shared/PasswordPrompt';
import { useRotatePdf } from '@/hooks/use-rotate-pdf';

export default function RotatePdfPage() {
  const {
    file,
    pageCount,
    rotations,
    isProcessing,
    isSuccess,
    result,
    error,
    progress,
    handleUpload,
    rotatePage,
    rotateAll,
    reset,
    handleSave,
    handleReset,
    formatFileSize,
    passwordPrompt,
    passwordError,
    handlePasswordSubmit,
    handlePasswordCancel,
  } = useRotatePdf();

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
              onFilesSelected={handleUpload}
              accept=".pdf"
              multiple={false}
              title="Rotate PDF"
              subtitle="Rotate individual pages or the entire document. Select a PDF to get started."
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
            <RotateWorkspace
              file={file}
              pageCount={pageCount}
              rotations={rotations}
              isProcessing={isProcessing}
              onRotatePage={rotatePage}
              onRotateAll={rotateAll}
              onReset={reset}
              onSave={handleSave}
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
            <ToolProgress progress={progress} title="Rotating PDF" />
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
              title="PDF Rotated Successfully!"
              description={`${result.pageCount} ${result.pageCount === 1 ? 'page' : 'pages'} processed`}
              fileUrl={result.url}
              fileName={result.filename}
              fileCount={1}
              onReset={handleReset}
              resetLabel="Rotate Another PDF"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password Prompt */}
      <PasswordPrompt
        open={passwordPrompt.open}
        fileName={passwordPrompt.file?.name || ''}
        onPasswordSubmit={handlePasswordSubmit}
        onCancel={handlePasswordCancel}
        error={passwordError || undefined}
      />
    </div>
  );
}

