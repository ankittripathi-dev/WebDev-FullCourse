'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ToolSidebarProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actionButton: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    isLoading?: boolean;
    icon?: ReactNode;
  };
  secondaryButton?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
}

export function ToolSidebar({
  title,
  subtitle,
  children,
  actionButton,
  secondaryButton,
}: ToolSidebarProps) {
  return (
    <div className="w-full lg:w-[32rem] shrink-0 flex flex-col">
      <div className="flex flex-col h-full rounded-lg sm:rounded-xl border bg-card shadow-sm overflow-hidden">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Heading */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h2>
            {subtitle && (
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {/* Content */}
          {children}
        </div>

        {/* Fixed Action Buttons at Bottom */}
        <div className="border-t bg-card p-4 sm:p-6 flex flex-col gap-2 sm:gap-3 shrink-0">
          {secondaryButton && (
            <Button
              variant="outline"
              size="lg"
              onClick={secondaryButton.onClick}
              className="w-full text-sm sm:text-base border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/40">
              {secondaryButton.icon}
              {secondaryButton.label}
            </Button>
          )}
          <Button
            size="lg"
            onClick={actionButton.onClick}
            disabled={actionButton.disabled || actionButton.isLoading}
            className={cn(
              'w-full text-sm sm:text-base font-semibold shadow-lg transition-all',
              actionButton.isLoading || actionButton.disabled
                ? 'cursor-not-allowed opacity-80'
                : 'bg-primary hover:scale-[1.02] hover:shadow-primary/25'
            )}>
            {actionButton.isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span className="text-sm sm:text-base">{actionButton.label}...</span>
              </span>
            ) : (
              <>
                {actionButton.icon}
                {actionButton.label}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
