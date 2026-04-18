'use client';

import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface PasswordPromptProps {
  open: boolean;
  fileName: string;
  onPasswordSubmit: (password: string) => void;
  onCancel: () => void;
  error?: string;
}

export function PasswordPrompt({
  open,
  fileName,
  onPasswordSubmit,
  onCancel,
  error,
}: PasswordPromptProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length > 0) {
      onPasswordSubmit(password);
      setPassword('');
    }
  };

  const handleCancel = () => {
    setPassword('');
    onCancel();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <Lock className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-lg sm:text-xl">Password Required</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                This PDF file is password protected. Please enter the password to continue.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* File Info */}
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground mb-1">File:</p>
            <p className="text-sm font-semibold text-foreground break-all">{fileName}</p>
          </div>

          {/* Password Form */}
          <form
            onSubmit={handleSubmit}
            id="password-form"
            className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="pdf-password"
                className="text-sm font-medium">
                PDF Password
              </Label>
              <div className="relative">
                <Input
                  id="pdf-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter PDF password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      handleCancel();
                    }
                  }}
                  className={cn(
                    'pr-10',
                    error ? 'border-destructive focus-visible:ring-destructive' : ''
                  )}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {error && <p className="text-xs text-destructive mt-1">{error}</p>}
            </div>
          </form>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="password-form"
            disabled={password.length === 0}>
            Unlock PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
