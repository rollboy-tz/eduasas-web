"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, X, RefreshCcw, Home } from "lucide-react";

interface EduErrorStateAction {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

interface EduErrorStateProps {
  isOpen: boolean;                // Ni lazima sasa ili kudhibiti overlay
  onClose: () => void;            // Lazima ili kufunga pazia
  title?: string;
  descMsg?: string;
  primaryAction?: EduErrorStateAction;   // Action kuu (mfano: Retry)
  secondaryAction?: EduErrorStateAction; // Action ya pembeni (mfano: Portal)
}

export function EduErrorState({
  isOpen,
  onClose,
  title = "System Workspace Error",
  descMsg = "The requested operation failed to synchronize with the school context. This might be due to a session timeout or network instability.",
  primaryAction,
  secondaryAction,
}: EduErrorStateProps) {
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          
          {/* OVERLAY - Plain & Professional */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0 }}
            className={`relative w-full max-w-md rounded-lg bg-card2 border border-border2 overflow-hidden`}
          >
            {/* HEADER */}
            <div className="relative p-3 flex items-center justify-between bg-inherit">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full" style={{ color: "#ef4444" }}>
                  <AlertCircle size={28} strokeWidth={2.5} />
                </div>

                <div className="space-y-0.5">
                  <h3 className="text-lg font-black tracking-tight uppercase italic">
                    {title}
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/5 text-muted hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* BODY */}
            <div className="max-h-[40vh] overflow-y-auto custom-scrollbar bg-inherit">
              <div className="w-full p-4 pt-0 bg-inherit">
                <p className="text-sm text-foreground/90 leading-relaxed border-l-2 border-red-500/30 pl-4 py-1">
                  {descMsg}
                </p>
              </div>
            </div>

            {/* ACTIONS AREA (FOOTER) */}
            <div className="p-3 bg-inherit flex flex-row items-center justify-end gap-3 border-t border-border2/50">
              
              {/* Secondary Action (Kama ipo) */}
              {secondaryAction && (
                <button
                  onClick={secondaryAction.onClick}
                  className="px-4 py-2 text-[12px] font-bold uppercase tracking-widest text-muted hover:text-foreground transition-all flex items-center gap-2"
                >
                  {secondaryAction.icon && secondaryAction.icon}
                  {secondaryAction.label}
                </button>
              )}

              {/* Primary Action (Default ni Retry logic kama hukupitisha chochote) */}
              <button
                onClick={primaryAction?.onClick || onClose}
                className="px-5 py-2.5 rounded-[5px] bg-primary/20 text-primary border border-primary/30 hover:bg-primary/40 hover:text-white transition-all text-sm font-bold uppercase tracking-tighter flex items-center gap-2"
              >
                {primaryAction?.icon || <RefreshCcw size={16} />}
                {primaryAction?.label || "Attempt Reconnect"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}