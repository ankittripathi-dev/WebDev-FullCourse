'use client';

import { motion, AnimatePresence } from 'motion/react';
import { FileDropzone } from '@/components/shared/FileDropzone';
import { OcrWorkspace } from '@/components/tools/ocr/OcrWorkspace';
import { ToolSuccess } from '@/components/shared/ToolSuccess';
import { PasswordPrompt } from '@/components/shared/PasswordPrompt';
import { useOcrPdf } from '@/hooks/use-ocr-pdf';
import { Progress } from '@/components/ui/progress';

export default function OcrPdfPage() {
  const {
    file,
    pageCount,
    selectedLanguages,
    ocrStatus,
    isProcessing,
    isSuccess,
    result,
    extractedText,
    error,
    ocrProgress,
    handleUpload,
    addLanguage,
    removeLanguage,
    handleOCR,
    handleReset,
    formatFileSize,
    passwordPrompt,
    passwordError,
    handlePasswordSubmit,
    handlePasswordCancel,
  } = useOcrPdf();

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
              title="OCR PDF"
              subtitle="Extract text from scanned PDF images using optical character recognition. Select a PDF to get started."
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
            <OcrWorkspace
              file={file}
              pageCount={pageCount}
              selectedLanguages={selectedLanguages}
              ocrStatus={ocrStatus}
              isProcessing={isProcessing}
              isSuccess={isSuccess}
              extractedText={extractedText}
              ocrProgress={ocrProgress}
              onAddLanguage={addLanguage}
              onRemoveLanguage={removeLanguage}
              onOCR={handleOCR}
              formatFileSize={formatFileSize}
            />
          </motion.div>
        )}

        {/* View 2.5: Progress State */}
        {isProcessing && ocrProgress && (
          <motion.div
            key="progress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-auto flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-2xl space-y-6">
              <div className="rounded-lg border bg-card shadow-sm p-6 sm:p-8">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                      {ocrProgress.status}
                    </h3>
                    {ocrProgress.currentPage && ocrProgress.totalPages && (
                      <p className="text-sm text-muted-foreground">
                        Page {ocrProgress.currentPage} of {ocrProgress.totalPages}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Progress
                      value={ocrProgress.progress}
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      {Math.round(ocrProgress.progress)}% complete
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* View 3: Success State */}
        {isSuccess && result && file && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-hidden p-2 sm:p-4">
            <OcrWorkspace
              file={file}
              pageCount={pageCount}
              selectedLanguages={selectedLanguages}
              ocrStatus={ocrStatus}
              isProcessing={false}
              isSuccess={isSuccess}
              extractedText={extractedText}
              ocrProgress={null}
              onAddLanguage={addLanguage}
              onRemoveLanguage={removeLanguage}
              onOCR={handleOCR}
              formatFileSize={formatFileSize}
            />
            {/* Download Button */}
            <div className="mt-4 flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}>
                <div className="flex gap-3">
                  <motion.a
                    href={result.textUrl}
                    download={result.filename}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors">
                    Download Text File
                  </motion.a>
                  <motion.button
                    onClick={handleReset}
                    className="inline-flex items-center justify-center rounded-md border border-primary/20 bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-primary/5 transition-colors">
                    Process Another PDF
                  </motion.button>
                </div>
              </motion.div>
            </div>
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
