'use client';

import { motion, AnimatePresence } from 'motion/react';
import { FileDropzone } from '@/components/shared/FileDropzone';
import { RemoveWorkspace } from '@/components/tools/remove/RemoveWorkspace';
import { ToolSuccess } from '@/components/shared/ToolSuccess';
import { ToolProgress } from '@/components/shared/ToolProgress';
import { PasswordPrompt } from '@/components/shared/PasswordPrompt';
import { useRemovePages } from '@/hooks/use-remove-pages';

export default function RemovePagesPage() {
  const {
    file,
    pageCount,
    pagesToRemove,
    isProcessing,
    isSuccess,
    result,
    error,
    progress,
    handleUpload,
    togglePage,
    handleRangeInput,
    handleShiftClick,
    handleRemove,
    reset,
    formatFileSize,
    getPagesToRemoveString,
    passwordPrompt,
    passwordError,
    handlePasswordSubmit,
    handlePasswordCancel,
  } = useRemovePages();

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
              title="Remove Pages"
              subtitle="Remove unwanted pages from your PDF. Select a PDF to get started."
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
            <RemoveWorkspace
              file={file}
              pageCount={pageCount}
              pagesToRemove={pagesToRemove}
              isProcessing={isProcessing}
              onRemove={handleRemove}
              onTogglePage={togglePage}
              onShiftClick={handleShiftClick}
              onRangeInput={handleRangeInput}
              formatFileSize={formatFileSize}
              getPagesToRemoveString={getPagesToRemoveString}
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
              title="Removing Pages"
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
              title="Pages Removed Successfully!"
              description={`${result.pageCount} ${
                result.pageCount === 1 ? 'page' : 'pages'
              } remaining`}
              fileUrl={result.url}
              fileName={result.filename}
              fileCount={1}
              onReset={reset}
              resetLabel="Remove More Pages"
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
