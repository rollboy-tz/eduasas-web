"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, X, LucideIcon } from "lucide-react";
import { 
  useFloating, 
  autoUpdate, 
  offset, 
  flip, 
  shift, 
  arrow, 
  useInteractions, 
  useClick, 
  useDismiss, 
  useRole,
  limitShift // Tumeongeza hii ili kuzuia kadi isivuke mipaka
} from "@floating-ui/react";
import { cn } from "@/lib/utils/helper";

interface EduFloatingGuideProps {
  title: string;
  children: React.ReactNode;
  buttonText?: string;
  titleClassName?: string;
  triggerIcon?: LucideIcon;
  headerIcon?: LucideIcon;
  buttonClassName?: string;
  cardClassName?: string;
  variant?: "primary" | "warning" | "info";
}

export function EduFloatingGuide({
  title,
  children,
  buttonText = "How it works?",
  triggerIcon: TriggerIcon = Info,
  headerIcon: HeaderIcon = Info,
  buttonClassName,
  titleClassName = "", // Nimeiacha tupu ili isichafue bg kwa default
  cardClassName,
  variant = "primary",
}: EduFloatingGuideProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(10), // Nafasi kidogo toka kwenye button
      flip({
        fallbackAxisSideDirection: 'start', // Inajaribu kupindua pande zote
      }),
      shift({ 
        padding: 16, // Inahakikisha kadi haigusi ukingo wa simu/screen (16px gap)
        limiter: limitShift(), // Hii inazuia kadi "isikimbie" mbali na trigger button
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const variantStyles = {
    primary: "text-primary bg-primary/10 border-primary/20",
    warning: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    info: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  };

  return (
    <>
      {/* 1. TRIGGER BUTTON */}
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        className={cn(
          "flex items-center gap-2 p-5 rounded-md border text-sm transition-all",
          variantStyles[variant],
          buttonClassName
        )}
      >
        <TriggerIcon size={12} />
        {buttonText}
      </button>

      {/* 2. INTELLIGENT FLOATING CARD */}
      <AnimatePresence>
        {isOpen && (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-[100]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 5 }}
              className={cn(
                "w-[calc(100vw-32px)] md:w-[380px] p-2 rounded-2xl border border-white/10 bg-[var(--card-bg)] shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl",
                cardClassName
              )}
            >
              {/* Header Content */}
              <div className={cn("flex items-start justify-between mb-4", titleClassName)} >
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", variantStyles[variant])}>
                    <HeaderIcon size={18} />
                  </div>
                  <h5 className="font-bold text-sm text-primary">{title}</h5>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="text-white/30 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body Content */}
              <div className="text-[11px] text-muted leading-relaxed max-h-[70vh] overflow-y-auto">
                {children}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}