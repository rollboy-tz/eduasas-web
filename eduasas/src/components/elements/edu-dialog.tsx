"use client";

import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/helper";
// Hapa tunatumia components zako za shadcn moja kwa moja
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

interface BaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

export function BaseDialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
  isLoading = false,
}: BaseDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <DialogContent
        // Logic ya kuzuia kufunga wakati wa loading
        onPointerDownOutside={(e) => isLoading && e.preventDefault()}
        onEscapeKeyDown={(e) => isLoading && e.preventDefault()}
        // Responsive classes za shadcn zimeboreshwa hapa
        className={cn(
          "p-0 gap-0 overflow-hidden border-border bg-[var(--card)] shadow-2xl",
          "max-w-full w-full sm:max-w-lg", // Mobile: Full width | PC: Max-lg
          "fixed bottom-0 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2", // Mobile: Bottom | PC: Center
          "rounded-t-[2rem] sm:rounded-[var(--radius)]",
          "h-fit max-h-[92vh] flex flex-col transition-all duration-500",
          className
        )}
      >
        {/* GOOGLE-STYLE LOADER (Ipo juu ya kila kitu) */}
        <div className="absolute top-0 left-0 w-full h-[4px] bg-transparent overflow-hidden z-[100]">
          {isLoading && (
            <div className="relative w-full h-full">
              <div className="absolute h-full bg-primary animate-[google-loader_1.5s_infinite_linear] shadow-[0_0_8px_var(--primary)]" />
            </div>
          )}
        </div>

        {/* CUSTOM CLOSE BUTTON (Kama shadcn default haijakaa unavyotaka) */}
        {!isLoading && (
          <DialogClose className="absolute right-6 top-6 rounded-xl opacity-40 ring-offset-background transition-all hover:opacity-100 hover:bg-[var(--muted)] hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary z-50 p-1.5">
            <X size={20} strokeWidth={3} />
            <span className="sr-only">Funga</span>
          </DialogClose>
        )}

        {/* SCROLLABLE WRAPPER */}
        <div className={cn(
          "flex-1 overflow-y-auto custom-scrollbar transition-all duration-300",
          isLoading ? "opacity-50 pointer-events-none blur-[1px]" : "opacity-100 blur-0"
        )}>
          {/* Header Area */}
          <div className="p-8 pb-4 sm:p-10 sm:pb-6">
            {(title || description) && (
              <DialogHeader className="text-left mb-8 pr-8">
                {title && (
                  <DialogTitle className="text-2xl font-[900] tracking-tighter text-foreground uppercase italic leading-none">
                    {title}
                  </DialogTitle>
                )}
                {description && (
                  <DialogDescription className="text-[11px] font-black text-[var(--icon-muted)] uppercase tracking-[0.2em] opacity-60 mt-2">
                    {description}
                  </DialogDescription>
                )}
              </DialogHeader>
            )}

            {/* Content Area */}
            <div className="relative min-h-[120px]">
              {children}
            </div>
          </div>
        </div>

        {/* FOOTER AREA (Kama ikiwepo) */}
        {footer && (
          <div className="px-8 py-6 sm:px-10 bg-[var(--muted)]/20 border-t border-border/50 flex items-center justify-end gap-3 pb-10 sm:pb-6">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}