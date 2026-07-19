"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils/helper";
import { Search, LucideIcon, X, AlertCircle } from "lucide-react";

interface BasicInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "onError"> {
  label: string;
  icon?: LucideIcon;
  variant?: "neon" | "flat";
  size?: "sm" | "md" | "lg";
  labelStrategy?: "floating" | "fixed" | "none";
  isRequired?: boolean;
  onError?: (err: string) => void;
  isSearch?: boolean;
  restriction?: "numbers-only" | "letters-only" | "alpha-numeric" | "ids" | "alpha-numeric-space";
  textTransform?: "uppercase" | "lowercase" | "capitalize" | "none";
  onClear?: () => void;
}

export const EduBasicInput = ({
  label,
  icon: StaticIcon,
  variant = "flat",
  size = "lg",
  labelStrategy = "floating",
  isRequired,
  onError,
  isSearch,
  restriction,
  textTransform = "none",
  onClear,
  className,
  value: controlledValue,
  onChange,
  ...props
}: BasicInputProps) => {
  const [internalValue, setInternalValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [localError, setLocalError] = useState(""); // 1. Local error state

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const hasContent = String(value || "").length > 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;

    // RESTRICTIONS Logic
    if (restriction === "numbers-only") raw = raw.replace(/[^0-9]/g, "");
    if (restriction === "letters-only") raw = raw.replace(/[^a-zA-Z\s]/g, "");
    if (restriction === "alpha-numeric") raw = raw.replace(/[^a-zA-Z0-9]/g, "");
    if (restriction === "alpha-numeric-space") raw = raw.replace(/[^a-zA-Z0-9\s]/g, "");
    if (restriction === "ids") raw = raw.replace(/[^a-zA-Z0-9\/\-\.]/g, "");
    
    // TRANSFORMATIONS Logic
    if (textTransform === "uppercase") raw = raw.toUpperCase();
    if (textTransform === "lowercase") raw = raw.toLowerCase();
    if (textTransform === "capitalize") {
       raw = raw.charAt(0).toUpperCase() + raw.slice(1);
    }

    if (controlledValue !== undefined) {
      if (onChange) onChange({ ...e, target: { ...e.target, value: raw } } as any);
    } else {
      setInternalValue(raw);
      if (onChange) {
         e.target.value = raw;
         onChange(e);
      }
    }
  };

  // 2. VALIDATION ON BLUR (Kama ilivyo kwenye Email)
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    let errorMsg = "";
    const val = String(value || "").trim();

    if (isRequired && !val) {
      errorMsg = `${label} is required`;
    }

    if (errorMsg) {
      setLocalError(errorMsg);
      onError?.(errorMsg);
    } else {
      setLocalError("");
      onError?.("");
    }

    if (props.onBlur) props.onBlur(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (localError) setLocalError(""); // Futa error user akianza kuandika
    if (props.onFocus) props.onFocus(e);
  };

  const sizeClasses = {
    sm: "h-9 text-xs pl-9 pr-3",
    md: "h-11 text-sm pl-11 pr-3",
    lg: "h-14 text-[15px] pl-12 pr-4",
  };

  // 3. VARIANT LOGIC ILIYOBORESHWA (Pamoja na Error State)
  const getVariantClasses = () => {
    const isNeon = variant === "neon";
    
    if (localError) return "border-destructive border-2 animate-shake"; // Shake animation
    
    if (isFocused || hasContent) {
      return isNeon 
        ? "border-primary border-2 shadow-[0_0_8px_rgba(var(--primary-rgb),0.15)]" 
        : "border-muted border-2";
    }
    
    return "border-slate-500/20 border-[1.5px] hover:border-slate-500/40";
  };

  const DisplayIcon = isSearch ? Search : StaticIcon;

  return (
    <div className={cn("relative w-full group mb-2 bg-inherit text-left font-sans", className)}>
      
      {/* FIXED LABEL STRATEGY */}
      {labelStrategy === "fixed" && (
        <span className={cn(
            "block mb-1.5 text-[11px] font-bold tracking-wider transition-all duration-300",
            localError ? "text-destructive" : isFocused ? "text-primary" : "text-muted"
        )}>
          {label} {isRequired && <span className="text-red-500">*</span>}
        </span>
      )}

      <div className="relative flex items-center bg-inherit">
        {DisplayIcon && (
          <div className={cn("absolute left-4 z-50 pointer-events-none transition-all duration-300", 
            localError ? "text-destructive" : isFocused ? "text-primary scale-110" : "text-muted")}>
            {localError ? <AlertCircle size={18} /> : <DisplayIcon size={18} />}
          </div>
        )}

        <input
          {...props}
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          spellCheck={false}
          autoComplete="off"
          className={cn(
            "peer w-full bg-transparent outline-none transition-all duration-300 z-40 text-foreground",
            getVariantClasses(),
            sizeClasses[size],
            size === "lg" ? "rounded-lg" : size === "md" ? "rounded-md" : "rounded-sm",
            (!DisplayIcon || (localError && !DisplayIcon)) && "pl-4"
          )}
        />

        {/* FLOATING LABEL STRATEGY */}
        {labelStrategy === "floating" && (
          <label className={cn(
            "absolute px-1.5 pointer-events-none transition-all duration-200 z-50 bg-inherit",
            (isFocused || hasContent) 
              ? cn(
                  "-top-2.5 left-3 text-[11px] font-bold tracking-wider",
                  localError ? "text-destructive" : (variant === "neon" ? "text-primary" : "text-foreground")
                ) 
              : cn("top-1/2 -translate-y-1/2 text-muted", DisplayIcon ? "left-11" : "left-4")
          )}>
            {localError ? localError : label} {isRequired && !localError && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}

        {/* ACTIONS (CLEAR OR ERROR INDICATOR) */}
        <div className="absolute right-4 z-50 flex items-center gap-2">
          {value && isSearch && !localError && (
            <button 
              type="button"
              onClick={() => { setInternalValue(""); if (onClear) onClear(); }}
              className="text-muted hover:text-red-500 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};