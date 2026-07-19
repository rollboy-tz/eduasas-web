"use client";

import React from "react";
import { cn } from "@/lib/utils/helper";
import { LucideIcon } from "lucide-react";
import { EduMainLoader } from "@/components/elements";

/**
 * EDU-BUTTON (v1.1)
 * -----------------------------------------------------------
 * - Text Transform: Capitalized (Default) au Uppercase.
 * - Loading States: Modern spinner with optional pulsing text.
 * - Disabled: Visual & functional handling.
 */

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "ghost" | "outline" | "neon";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  loadingText?: string;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  textTransform?: "uppercase" | "capitalize" | "none"; // New Prop
}

export const EduButton = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  loadingText,
  icon: Icon,
  iconPosition = "left",
  fullWidth = false,
  textTransform = "capitalize", // Default ni Capitalized kulingana na maelekezo yako
  className,
  disabled,
  ...props
}: ButtonProps) => {
  
  // 1. VARIANT STYLES
  const variantClasses = {
    primary: "bg-primary text-white hover:opacity-70 shadow-primary/20 border-none opacity-90",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-red-500/20 border-none",
    neon: "border-2 border-primary text-primary bg-primary/5 shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)] hover:bg-primary hover:text-white",
    outline: "border-2 border-slate-500/20 text-foreground hover:border-primary hover:text-primary",
    ghost: "item-hover border-2 border-muted/50 text-muted-foreground hover:bg-slate-500/10 hover:text-foreground",
  };

  const sizeClasses = {
    sm: "h-10 px-3 text-[11px] gap-2 rounded",
    md: "h-11 px-5 text-[12px] gap-2.5 rounded-md",
    lg: "h-13 px-7 text-[14px] gap-3 rounded-lg",
  };

  // 2. TEXT TRANSFORMATION CLASS
  const transformClass = {
    uppercase: "uppercase tracking-[0.15em]",
    capitalize: "capitalize tracking-normal",
    none: "normal-case tracking-normal",
  }[textTransform];

  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        "relative inline-flex items-center justify-center font-black transition-all overflow-hidden",
        "active:scale-[0.96] transition-transform duration-150 cursor-pointer",
        // DISABLED STATE: Kijivu, cursor inakataa, hakuna shadow
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 disabled:shadow-none",
        variantClasses[variant],
        sizeClasses[size],
        transformClass,
        fullWidth ? "w-full" : "w-auto",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-3">
          <EduMainLoader color="white" size={size === "sm" ? 16 : 18} />
          {loadingText && (
             <span className={cn("animate-pulse", transformClass)}>
                {loadingText}
             </span>
          )}
        </div>
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon size={size === "sm" ? 16 : 18} />}
          <span className="relative z-10">{children}</span>
          {Icon && iconPosition === "right" && <Icon size={size === "sm" ? 16 : 18} />}
        </>
      )}

      {/* Subtle Hover Effect Background */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors pointer-events-none" />
    </button>
  );
};