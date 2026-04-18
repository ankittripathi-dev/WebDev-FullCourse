'use client';

import { useState } from 'react';
import { Lock, Unlock, Eye, EyeOff, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToolSidebar } from '@/components/shared/ToolSidebar';
import { PdfThumbnail } from '../merge/PdfThumbnail';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import type { UnlockStatus } from '@/hooks/use-unlock-pdf';

interface UnlockWorkspaceProps {
  file: File | null;
  pageCount: number;
  password: string;
  isLocked: boolean;
  status: UnlockStatus;
  isProcessing: boolean;
  onPasswordChange: (value: string) => void;
  onUnlock: () => void;
  formatFileSize: (bytes: number) => string;
}

export function UnlockWorkspace({
  file,
  pageCount,
  password,
  isLocked,
  status,
  isProcessing,
  onPasswordChange,
  onUnlock,
  formatFileSize,
}: UnlockWorkspaceProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordError = status === 'error_password';
  const canUnlock = !isProcessing && (isLocked ? password.length > 0 : true);

  return (
    <div className="flex h-full gap-4 lg:flex-row flex-col">
      {/* Left Area - Preview */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="relative w-full max-w-md">
          {/* PDF Thumbnail */}
          {file && (
            <div className="relative rounded-xl border bg-card shadow-lg overflow-hidden">
              <div className="aspect-3/4">
                {/* Only show thumbnail if PDF is not locked */}
                {!isLocked ? (
                  <PdfThumbnail
                    file={file}
                    className="h-full w-full"
                  />
                ) : (
                  <div className="h-full w-full bg-muted/30 flex items-center justify-center">
                    <FileText className="h-16 w-16 text-muted-foreground/40" />
                  </div>
                )}
              </div>

              {/* Lock/Unlock Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4">
                  {isLocked ? (
                    <motion.div
                      className="relative"
                      animate={
                        isPasswordError
                          ? {
                              x: [0, -10, 10, -10, 10, 0],
                            }
                          : {}
                      }
                      transition={{
                        duration: 0.5,
                        ease: 'easeInOut',
                      }}>
                      <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                      <Lock className="relative h-16 w-16 sm:h-20 sm:w-20 text-destructive" />
                    </motion.div>
                  ) : (
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full" />
                      <Unlock className="relative h-16 w-16 sm:h-20 sm:w-20 text-green-500" />
                    </div>
                  )}
                  <p className="text-sm sm:text-base font-semibold text-foreground">
                    {isLocked ? 'Locked PDF' : 'Unlocked PDF'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* File Info */}
          {file && (
            <div className="mt-4 text-center">
              <p className="text-sm font-semibold text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatFileSize(file.size)}
                {pageCount > 0 && ` • ${pageCount} ${pageCount === 1 ? 'page' : 'pages'}`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Controls */}
      <ToolSidebar
        title="Unlock PDF"
        subtitle="Remove password security from this file."
        actionButton={
          !isLocked
            ? {
                label: 'DOWNLOAD PDF',
                onClick: onUnlock,
                disabled: isProcessing || !file,
                isLoading: isProcessing,
                icon: <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />,
              }
            : {
                label: status === 'success' ? 'DOWNLOAD UNLOCKED PDF' : 'UNLOCK PDF',
                onClick: onUnlock,
                disabled: !canUnlock,
                isLoading: isProcessing,
                icon:
                  status === 'success' ? (
                    <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Unlock className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  ),
              }
        }>
        <div className="space-y-4">
          {!isLocked ? (
            /* File is NOT Locked */
            <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                  <Unlock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    This file is not password protected.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You can download it directly without entering a password.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* File IS Locked */
            <>
              <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-destructive" />
                  <p className="text-sm font-semibold text-foreground">
                    This document is encrypted.
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">Enter the password to unlock it.</p>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-xs sm:text-sm">
                  PDF Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter PDF Password"
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && canUnlock) {
                        onUnlock();
                      }
                    }}
                    className={cn(
                      'pr-10',
                      isPasswordError ? 'border-destructive focus-visible:ring-destructive' : ''
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {isPasswordError && (
                  <p className="text-xs text-destructive">Incorrect password. Please try again.</p>
                )}
              </div>

              {/* Security Info */}
              <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <Unlock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm font-semibold text-foreground">
                      Unlock Information
                    </p>
                    <ul className="space-y-1 text-[10px] sm:text-xs text-muted-foreground">
                      <li>• Password will be removed from the PDF</li>
                      <li>• Original file remains unchanged</li>
                      <li>• Processed securely in your browser</li>
                      <li>• New unlocked file will be downloaded</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </ToolSidebar>
    </div>
  );
}
