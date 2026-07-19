"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BaseCardProps<T> {
  item: T;
  id: string;
  isSelected: boolean;
  isDragging?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  applyInternalClasses?: boolean;
  variant?: 'default' | 'error' | 'success' | 'warning';
  onToggle: (id: string) => void;
  onLongPress: (id: string) => void;
  renderContent: (props: { 
    item: T; 
    isSelected: boolean; 
    isDragging: boolean; 
    disabled: boolean;
  }) => React.ReactNode; 
}

export function BaseCard<T>({ 
  item, id, isSelected, isDragging = false, disabled = false, applyInternalClasses = false, 
  isLoading = false, variant = 'default', onToggle, onLongPress, renderContent 
}: BaseCardProps<T>) {

  const [timer, setTimer] = React.useState<NodeJS.Timeout | null>(null);

  const startPress = () => setTimer(setTimeout(() => onLongPress(id), 500));
  const cancelPress = () => { if (timer) clearTimeout(timer); };

  const variantStyles = {
    default: "border-slate-200 hover:border-indigo-300",
    error: "border-red-200 bg-red-50/50",
    success: "border-emerald-200 bg-emerald-50/50",
    warning: "border-amber-200 bg-amber-50/50"
  };

  return (
    <motion.div
      layout
      data-selecto-target={id}
      onClick={() => !disabled && onToggle(id)}
      onMouseDown={startPress}
      onMouseUp={cancelPress}
      onTouchStart={startPress}
      onTouchEnd={cancelPress}
      className={
        applyInternalClasses ? `${cn(
        "group flex items-center rounded-lg border p-3 transition-all",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        isSelected ? "border-indigo-500 bg-indigo-50" : variantStyles[variant], 
        isDragging ? "rotate-2 opacity-50 shadow-2xl" : "opacity-100"
      )}` : ""}
    >
      <div className="flex-1">
        {isLoading ? (
          <div className="h-4 w-3/4 animate-shimmer rounded bg-slate-200" />
        ) : (
          renderContent({ item, isSelected, isDragging, disabled })
        )}
      </div>
    </motion.div>
  );
}