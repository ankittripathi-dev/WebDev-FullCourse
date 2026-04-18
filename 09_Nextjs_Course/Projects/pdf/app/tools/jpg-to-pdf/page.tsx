'use client';

import { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileDropzone } from '@/components/shared/FileDropzone';
import { JpgToPdfWorkspace } from '@/components/tools/jpg-to-pdf/JpgToPdfWorkspace';
import { ToolSuccess } from '@/components/shared/ToolSuccess';
import { ToolProgress } from '@/components/shared/ToolProgress';
import { useJpgToPdf } from '@/hooks/use-jpg-to-pdf';

export default function JpgToPdfPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    files,
    settings,
    isProcessing,
    isSuccess,
    results,
    error,
    progress,
    addFiles,
    removeFile,
    reorderFiles,
    rotateFile,
    updateSettings,
    handleConvert,
    handleReset,
    formatFileSize,
  } = useJpgToPdf();

  const handleAddFiles = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      // Reset input so same file can be selected again
      e.target.value = '';
    }
  };

  return (
    <div className="w-full h-[90vh] sm:h-[90vh] flex flex-col overflow-hidden">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
      />

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
              onFilesSelected={addFiles}
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple={true}
              title="JPG to PDF"
              subtitle="Convert images (JPG, PNG, WebP) to PDF documents. Select images to get started."
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
            <JpgToPdfWorkspace
              files={files}
              settings={settings}
              isProcessing={isProcessing}
              onRemove={removeFile}
              onReorder={reorderFiles}
              onRotate={rotateFile}
              onSettingsChange={updateSettings}
              onAddFiles={handleAddFiles}
              addFiles={addFiles}
              onConvert={handleConvert}
              formatFileSize={formatFileSize}
              fileInputRef={fileInputRef}
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
              title="Converting to PDF"
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
              title="Images Converted Successfully!"
              description={`${results.length} ${
                results.length === 1 ? 'PDF file' : 'PDF files'
              } created`}
              fileUrl={results[0].url}
              fileName={results[0].filename}
              fileCount={results.length}
              results={
                results.length > 1
                  ? results.map((r) => ({ url: r.url, filename: r.filename }))
                  : undefined
              }
              onReset={handleReset}
              resetLabel="Convert More Images"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
