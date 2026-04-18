'use client';

import { motion, AnimatePresence } from 'motion/react';
import { FileDropzone } from '@/components/shared/FileDropzone';
import { ExtractWorkspace } from '@/components/tools/extract/ExtractWorkspace';
import { ToolSuccess } from '@/components/shared/ToolSuccess';
import { ToolProgress } from '@/components/shared/ToolProgress';
import { PasswordPrompt } from '@/components/shared/PasswordPrompt';
import { useExtractPages } from '@/hooks/use-extract-pages';

export default function ExtractPagesPage() {
  const {
    file,
    pageCount,
    selectedPages,
    mergeOutput,
    isProcessing,
    isSuccess,
    results,
    error,
    progress,
    handleUpload,
    togglePage,
    selectAll,
    deselectAll,
    handleRangeInput,
    handleShiftClick,
    handleExtract,
    setMergeOutput,
    reset,
    formatFileSize,
    getSelectedPagesString,
    passwordPrompt,
    passwordError,
    handlePasswordSubmit,
    handlePasswordCancel,
  } = useExtractPages();

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
              title="Extract Pages"
              subtitle="Select specific pages from your PDF to create a new document. Select a PDF to get started."
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
            <ExtractWorkspace
              file={file}
              pageCount={pageCount}
              selectedPages={selectedPages}
              mergeOutput={mergeOutput}
              isProcessing={isProcessing}
              onExtract={handleExtract}
              onTogglePage={togglePage}
              onShiftClick={handleShiftClick}
              onRangeInput={handleRangeInput}
              onSelectAll={selectAll}
              onDeselectAll={deselectAll}
              onMergeOutputChange={setMergeOutput}
              formatFileSize={formatFileSize}
              getSelectedPagesString={getSelectedPagesString}
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
              title="Extracting Pages"
            />
          </motion.div>
        )}

        {/* View 3: Success State */}
        {isSuccess && results.length > 0 && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-auto">
            <ToolSuccess
              title="Pages Extracted Successfully!"
              description={
                mergeOutput
                  ? `${results[0].pageCount} ${
                      results[0].pageCount === 1 ? 'page' : 'pages'
                    } extracted into one file`
                  : `${results.length} file${results.length !== 1 ? 's' : ''} created`
              }
              results={results.map((r) => ({
                url: r.url,
                filename: r.filename,
                pageCount: r.pageCount,
              }))}
              onReset={reset}
              resetLabel="Extract More Pages"
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
