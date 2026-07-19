"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { EduLinearLoader } from "@/components/elements"; // Hakikisha path ni sahihi
import { cn } from "@/lib/utils/helper";

interface EduMainModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  title?: string;
  titleClassName?: string;
  children: React.ReactNode;
  size?: "md" | "lg" | "xl" | "2xl";
  className?: string;
}

export function EduMainModal({
  isOpen,
  onClose,
  isLoading = false,
  title,
  children,
  size = "lg",
  className,
  titleClassName
}: EduMainModalProps) {

  const sizeClasses = {
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
    "2xl": "max-w-7xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 sm:p-6">

          {/* 1. SECURE BACKDROP (Haina 'onClick={onClose}' - Haijifungi hapa) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bgbackground/80 backdrop-blur-md"
          />

          {/* 2. Main CONTAINER */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn("relative w-full", sizeClasses[size],
              "bg-card border border-[var(--)] rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden",
              className

            )}
          >
            {/* TITLE & CLOSING BUTTON AREA */}
            {title ? (
              <div className="flex items-center justify-between p-4">
                <h3 className={cn("text-xl font-semibold", titleClassName)}>{title}</h3>
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="p-2 rounded-full bg-card hover:bg-red-500/20 hover:text-red-500 text-muted-foreground transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <X size={20} />
                </button>
              </div>

            ) : (

              // CLOSE BUTTON (THE ONLY WAY OUT) WHEN NO TITLE
              <div className="absolute top-4 right-4 z-[60]">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="p-2 rounded-full bg-card hover:bg-red-500/20 hover:text-red-500 text-muted transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {/* CONTENT WRAPPER */}
            
              {children}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}