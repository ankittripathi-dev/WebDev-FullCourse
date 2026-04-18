'use client';

import { motion, AnimatePresence } from 'motion/react';
import { FileDropzone } from '@/components/shared/FileDropzone';
import { PdfToJpgWorkspace } from '@/components/tools/pdf-to-jpg/PdfToJpgWorkspace';
import { ToolSuccess } from '@/components/shared/ToolSuccess';
import { ToolProgress } from '@/components/shared/ToolProgress';
import { PasswordPrompt } from '@/components/shared/PasswordPrompt';
import { usePdfToJpg } from '@/hooks/use-pdf-to-jpg';

export default function PdfToJpgPage() {
  const {
    file,
    pageCount,
    pages,
    conversionMode,
    imageQuality,
    isProcessing,
    isSuccess,
    result,
    error,
    progress,
    handleUpload,
    rotatePage,
    reorderPages,
    togglePageInclusion,
    setConversionMode,
    setImageQuality,
    handleConvert,
    handleReset,
    formatFileSize,
    passwordPrompt,
    passwordError,
    handlePasswordSubmit,
    handlePasswordCancel,
  } = usePdfToJpg();

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
              title="PDF to JPG"
              subtitle="Convert PDF pages to JPG images or extract embedded images. Select a PDF file to get started."
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
            <PdfToJpgWorkspace
              file={file}
              pageCount={pageCount}
              pages={pages}
              conversionMode={conversionMode}
              imageQuality={imageQuality}
              isProcessing={isProcessing}
              onRotate={rotatePage}
              onReorder={reorderPages}
              onToggleInclusion={togglePageInclusion}
              onConversionModeChange={setConversionMode}
              onImageQualityChange={setImageQuality}
              onConvert={handleConvert}
              onUpload={handleUpload}
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
              title={
                conversionMode === 'convert_pages' ? 'Converting Pages to JPG' : 'Extracting Images'
              }
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
              title={
                conversionMode === 'convert_pages'
                  ? 'Pages Converted Successfully!'
                  : 'Images Extracted Successfully!'
              }
              description={
                conversionMode === 'convert_pages'
                  ? `${pages.filter((p) => p.included).length} JPG ${
                      pages.filter((p) => p.included).length === 1 ? 'file' : 'files'
                    } created`
                  : 'All embedded images have been extracted'
              }
              fileUrl={result.url}
              fileName={result.filename}
              fileCount={1}
              onReset={handleReset}
              resetLabel="Convert Another PDF"
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
