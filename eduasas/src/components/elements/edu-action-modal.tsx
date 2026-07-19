"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Info, AlertCircle, CheckCircle2, LucideIcon } from "lucide-react";
import { useEffect } from "react";

type ModalVariant = "info" | "warning" | "error" | "success" | "attention";

// 1. Ongeza hii juu ya component yako
export interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "primary" | "ghost" | "danger" | "neon"; // Hakikisha hizi zinaendana na EduButton yako
  isLoading?: boolean;
}

// 2. Iboreshe interface yako ya sasa
interface EduActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  variant?: ModalVariant;
  closeOnOverlayClick?: boolean;
  actions?: ModalAction[];
}

export function EduActionModal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  variant = "info",
  closeOnOverlayClick = false,
  actions = [],
}: EduActionModalProps) {

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  // Map ya rangi na icons kulingana na Variant
  const variants: Record<ModalVariant, { color: string; icon: LucideIcon; bg: string }> = {
    info: { color: "#3b82f6", icon: Info, bg: "rgba(59, 130, 246, 0.05)" },
    warning: { color: "#f59e0b", icon: AlertTriangle, bg: "rgba(245, 158, 11, 0.05)" },
    error: { color: "#ef4444", icon: AlertCircle, bg: "rgba(239, 68, 68, 0.05)" },
    success: { color: "#10b981", icon: CheckCircle2, bg: "rgba(16, 185, 129, 0.05)" },
    attention: { color: "var(--primary)", icon: AlertTriangle, bg: "rgba(0, 242, 255, 0.05)" },
  };

  const activeVariant = variants[variant];
  const IconComponent = activeVariant.icon;

  const sizeClasses = {
    sm: "max-w-md rounded-[5px]",
    md: "max-w-lg rounded-md",
    lg: "max-w-2xl rounded-md",
    xl: "max-w-4xl rounded-lg",
    full: "max-w-[95vw] h-[95vh] rounded-md",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnOverlayClick ? onClose : undefined}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className={`relative w-full ${sizeClasses[size]} bg-card2 shadow-2xl border border-border2 overflow-hidden`}
          >

            {/* HEADER */}
            <div className="relative p-3 flex items-center justify-between border-b border-border bg-inherit">
              <div className="flex items-center gap-4">
                {/* Small Side Icon */}
                <div
                  className="p-2 rounded-full"
                  style={{ backgroundColor: activeVariant.bg, color: activeVariant.color }} >
                  <IconComponent size={30} strokeWidth={2.5} />
                </div>

                <div className="space-y-0.5">
                  {title && (<h3 className="text-lg font-black"> {title} </h3>)}
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/5 text-muted hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* 1. BODY AREA */}
            <div className="max-h-[70vh] overflow-y-auto custom-scrollbar bg-inherit">
              {children}
            </div>

            {/* 2. ACTIONS AREA (FOOTER) */}
            {actions && actions.length > 0 && (
              <div className="p-4 border-t border-border bg-inherit flex flex-row items-center justify-end gap-3">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    disabled={action.isLoading}
                    onClick={action.onClick}
                    className={`
                          /* Base Styles */
                          relative flex items-center justify-center gap-2 px-5 md:px-3 py-2.5 md:py-1.5 rounded-[5px]
                          text-[13px] font-bold tracking-tight transition-all duration-200
                          active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
          
                          /* Responsive Logic: Kwenye simu flex-1, kwenye desktop auto width */
                          flex-1 md:flex-none md:min-w-[110px]
          
                          /* Variant Styles */
                          ${action.variant === "primary" 
                            ? "bg-primary text-foreground hover:bg-primary/80"
                            : action.variant === "danger"
                            ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
                            : "bg-white/5 text-muted hover:bg-white/10 hover:text-white border border-white/5"
                      }
                    `}
                  >
                    {action.isLoading ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      action.label
                    )}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}