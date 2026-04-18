'use client';

import { useState } from 'react';
import { Lock, CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToolSidebar } from '@/components/shared/ToolSidebar';
import { PdfThumbnail } from '../merge/PdfThumbnail';
import { cn } from '@/lib/utils';

interface ProtectWorkspaceProps {
  file: File | null;
  pageCount: number;
  passwords: { value: string; confirm: string };
  isProcessing: boolean;
  onPasswordChange: (value: string) => void;
  onConfirmChange: (value: string) => void;
  onProtect: () => void;
  formatFileSize: (bytes: number) => string;
  validatePasswords: () => { valid: boolean; error?: string };
}

export function ProtectWorkspace({
  file,
  pageCount,
  passwords,
  isProcessing,
  onPasswordChange,
  onConfirmChange,
  onProtect,
  formatFileSize,
  validatePasswords,
}: ProtectWorkspaceProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Validate passwords for UI feedback
  const passwordValidation = validatePasswords();
  const passwordsMatch =
    passwords.value.length > 0 &&
    passwords.confirm.length > 0 &&
    passwords.value === passwords.confirm;
  const passwordsMismatch =
    passwords.value.length > 0 &&
    passwords.confirm.length > 0 &&
    passwords.value !== passwords.confirm;

  return (
    <div className="flex h-full gap-4 lg:flex-row flex-col">
      {/* Left Area - Preview */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="relative w-full max-w-md">
          {/* PDF Thumbnail */}
          {file && (
            <div className="relative rounded-xl border bg-card shadow-lg overflow-hidden">
              <div className="aspect-3/4">
                <PdfThumbnail
                  file={file}
                  className="h-full w-full"
                />
              </div>

              {/* Lock Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                    <Lock className="relative h-16 w-16 sm:h-20 sm:w-20 text-primary" />
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-foreground">
                    Protected PDF
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
                {formatFileSize(file.size)} • {pageCount} {pageCount === 1 ? 'page' : 'pages'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Controls */}
      <ToolSidebar
        title="Protect PDF"
        subtitle="Set a password to protect your PDF file."
        actionButton={{
          label: 'PROTECT PDF',
          onClick: onProtect,
          disabled: isProcessing || !passwordValidation.valid,
          isLoading: isProcessing,
          icon: <Lock className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />,
        }}>
        <div className="space-y-4">
          {/* Password Input */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-xs sm:text-sm">
              Type Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter strong password"
                value={passwords.value}
                onChange={(e) => onPasswordChange(e.target.value)}
                className={cn(
                  'pr-10',
                  passwords.value.length > 0 && passwords.value.length < 4
                    ? 'border-destructive focus-visible:ring-destructive'
                    : ''
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {passwords.value.length > 0 && passwords.value.length < 4 && (
              <p className="text-xs text-destructive">
                Password must be at least 4 characters long.
              </p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <Label
              htmlFor="confirm"
              className="text-xs sm:text-sm">
              Repeat Password
            </Label>
            <div className="relative">
              <Input
                id="confirm"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Repeat password"
                value={passwords.confirm}
                onChange={(e) => onConfirmChange(e.target.value)}
                className={cn(
                  'pr-10',
                  passwordsMismatch
                    ? 'border-destructive focus-visible:ring-destructive'
                    : passwordsMatch
                    ? 'border-green-500 focus-visible:ring-green-500'
                    : ''
                )}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {/* Show/Hide Toggle */}
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="text-muted-foreground hover:text-foreground transition-colors">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>

                {/* Validation Icon */}
                {passwordsMatch && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                {passwordsMismatch && <XCircle className="h-4 w-4 text-destructive" />}
              </div>
            </div>
            {passwordsMismatch && (
              <p className="text-xs text-destructive">Passwords do not match.</p>
            )}
            {passwordsMatch && (
              <p className="text-xs text-green-600 dark:text-green-400">Passwords match.</p>
            )}
          </div>

          {/* Security Info */}
          <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
            <div className="flex items-start gap-2">
              <Lock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-semibold text-foreground">
                  Security Features
                </p>
                <ul className="space-y-1 text-[10px] sm:text-xs text-muted-foreground">
                  <li>• 128-bit RC4 encryption</li>
                  <li>• Password required to open</li>
                  <li>• Password required to modify</li>
                  <li>• Processed securely in your browser</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </ToolSidebar>
    </div>
  );
}
