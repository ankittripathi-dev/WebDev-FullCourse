'use client';

import { motion, AnimatePresence } from 'motion/react';
import { FileDropzone } from '@/components/shared/FileDropzone';
import { MergeWorkspace } from '@/components/tools/merge/MergeWorkspace';
import { ToolSuccess } from '@/components/shared/ToolSuccess';
import { ToolProgress } from '@/components/shared/ToolProgress';
import { PasswordPrompt } from '@/components/shared/PasswordPrompt';
import { useMergePdf } from '@/hooks/use-merge-pdf';

export default function MergePdfPage() {
  const {
    files,
    isProcessing,
    isSuccess,
    mergedPdfUrl,
    error,
    progress,
    handleUpload,
    handleFilesAdded,
    handleRemove,
    handleReorder,
    handleMerge,
    reset,
    formatFileSize,
    passwordPrompt,
    passwordError,
    handlePasswordSubmit,
    handlePasswordCancel,
  } = useMergePdf();

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
        {files.length === 0 && !isSuccess && (
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
              multiple={true}
              title="Merge PDF"
              subtitle="Combine multiple PDF files into one document. Drag and drop to reorder files before merging."
            />
          </motion.div>
        )}

        {/* View 2: Workspace State */}
        {files.length > 0 && !isSuccess && !isProcessing && (
          <motion.div
            key="workspace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-hidden p-2 sm:p-4">
            <MergeWorkspace
              files={files}
              onRemove={handleRemove}
              onReorder={handleReorder}
              onMerge={handleMerge}
              onAddFiles={(files) => handleFilesAdded(files)}
              isProcessing={isProcessing}
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
            <ToolProgress
              progress={progress}
              title="Merging PDFs"
            />
          </motion.div>
        )}

        {/* View 3: Success State */}
        {isSuccess && mergedPdfUrl && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-auto">
            <ToolSuccess
              title="PDFs Merged Successfully!"
              description={`${files.length} ${
                files.length === 1 ? 'file' : 'files'
              } combined into one document`}
              fileUrl={mergedPdfUrl}
              fileName="merged-document.pdf"
              fileCount={files.length}
              onReset={reset}
              resetLabel="Merge Another"
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
