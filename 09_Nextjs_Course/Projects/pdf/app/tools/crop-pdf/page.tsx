'use client';

import { motion, AnimatePresence } from 'motion/react';
import { FileDropzone } from '@/components/shared/FileDropzone';
import { CropWorkspace } from '@/components/tools/crop/CropWorkspace';
import { ToolSuccess } from '@/components/shared/ToolSuccess';
import { ToolProgress } from '@/components/shared/ToolProgress';
import { PasswordPrompt } from '@/components/shared/PasswordPrompt';
import { useCropPdf } from '@/hooks/use-crop-pdf';

export default function CropPdfPage() {
  const {
    file,
    pageCount,
    crop,
    scaleFactor,
    pageDetails,
    scope,
    currentPageIndex,
    isProcessing,
    isSuccess,
    result,
    error,
    progress,
    handleUpload,
    setCrop,
    onImageLoad,
    setCropScope,
    setCurrentPage,
    reset,
    handleCrop,
    handleReset,
    formatFileSize,
    passwordPrompt,
    passwordError,
    handlePasswordSubmit,
    handlePasswordCancel,
  } = useCropPdf();

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
              title="Crop PDF"
              subtitle="Select an area to crop from your PDF pages. Select a PDF to get started."
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
            <CropWorkspace
              file={file}
              pageCount={pageCount}
              crop={crop}
              scaleFactor={scaleFactor}
              pageDetails={pageDetails}
              scope={scope}
              currentPageIndex={currentPageIndex}
              isProcessing={isProcessing}
              setCrop={setCrop}
              onImageLoad={onImageLoad}
              onScopeChange={setCropScope}
              onCurrentPageChange={setCurrentPage}
              onReset={reset}
              onCrop={handleCrop}
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
              title="Cropping PDF"
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
              title="PDF Cropped Successfully!"
              description={`${result.pageCount} ${
                result.pageCount === 1 ? 'page' : 'pages'
              } cropped`}
              fileUrl={result.url}
              fileName={result.filename}
              fileCount={1}
              onReset={handleReset}
              resetLabel="Crop Another PDF"
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
