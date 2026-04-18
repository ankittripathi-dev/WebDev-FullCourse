'use client';

import { motion, AnimatePresence } from 'motion/react';
import { FileDropzone } from '@/components/shared/FileDropzone';
import { SplitWorkspace } from '@/components/tools/split/SplitWorkspace';
import { ToolSuccess } from '@/components/shared/ToolSuccess';
import { ToolProgress } from '@/components/shared/ToolProgress';
import { PasswordPrompt } from '@/components/shared/PasswordPrompt';
import { useSplitPdf } from '@/hooks/use-split-pdf';

export default function SplitPdfPage() {
  const {
    file,
    pageCount,
    splitMode,
    setSplitMode,
    rangeConfig,
    setRangeConfig,
    pagesConfig,
    setPagesConfig,
    sizeConfig,
    setSizeConfig,
    isProcessing,
    isSuccess,
    splitResults,
    error,
    progress,
    handleUpload,
    handleSplit,
    reset,
    formatFileSize,
    togglePageSelection,
    addCustomRange,
    removeCustomRange,
    updateCustomRange,
    passwordPrompt,
    passwordError,
    handlePasswordSubmit,
    handlePasswordCancel,
  } = useSplitPdf();

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
              title="Split PDF"
              subtitle="Extract specific pages or split your PDF into multiple files. Select a PDF to get started."
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
            <SplitWorkspace
              file={file}
              pageCount={pageCount}
              splitMode={splitMode}
              setSplitMode={setSplitMode}
              rangeConfig={rangeConfig}
              setRangeConfig={setRangeConfig}
              pagesConfig={pagesConfig}
              setPagesConfig={setPagesConfig}
              sizeConfig={sizeConfig}
              setSizeConfig={setSizeConfig}
              isProcessing={isProcessing}
              onSplit={handleSplit}
              formatFileSize={formatFileSize}
              togglePageSelection={togglePageSelection}
              addCustomRange={addCustomRange}
              removeCustomRange={removeCustomRange}
              updateCustomRange={updateCustomRange}
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
              title="Splitting PDF"
            />
          </motion.div>
        )}

        {/* View 3: Success State */}
        {isSuccess && splitResults.length > 0 && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-auto">
            <ToolSuccess
              title="PDF Split Successfully!"
              description={`${splitResults.length} file${
                splitResults.length !== 1 ? 's' : ''
              } created`}
              results={splitResults.map((r) => ({
                url: r.url,
                filename: r.filename,
                pageCount: r.pageCount,
              }))}
              onReset={reset}
              resetLabel="Split Another PDF"
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
