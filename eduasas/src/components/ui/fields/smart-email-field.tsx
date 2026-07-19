"use client";

import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils/helper";
import { Mail, AlertCircle } from "lucide-react";
import { cleanEmail, getEmailSuggestion, capitalize } from "@/lib/utils/string-utils";

interface SmartEmailFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "onError" | "onChange"> {
  label: string;
  variant?: "neon" | "flat";
  size?: "sm" | "md" | "lg";
  error?: string;
  labelStrategy?: "floating" | "fixed" | "none";
  isRequired?: boolean;
  onChange?: (value: string) => void;
  onError?: (error: string) => void;
  externalError?: string;
  labelClassName?: string;
}

export const SmartEmailField = React.forwardRef<HTMLInputElement, SmartEmailFieldProps>(
  ({
    label, variant = "flat", size = "lg", labelStrategy = "floating",
    isRequired = true, className, onChange, onError, externalError,
    value: propsValue, onKeyDown, labelClassName, ...props
  }, ref) => {
    const localRef = useRef<HTMLInputElement>(null);
    const [internalError, setInternalError] = useState("");
    const [suggestion, setSuggestion] = useState<string | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    
    const activeError = externalError || internalError;
    const hasContent = String(propsValue || "").length > 0;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    const sizeClasses = {
      sm: "h-9 text-xs pl-9 pr-3",
      md: "h-11 text-sm pl-11 pr-3",
      lg: "h-14 text-[15px] pl-12 pr-4",
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // 1. Ondoa nafasi zote (g = global)
      // 2. Ondoa kila kitu kisichokuwa a-z, 0-9, @, ., _, -
      const val = e.target.value
        .replace(/\s+/g, "") 
        .replace(/[^a-z0-9@._-]/gi, ""); 
          
      // Logic ya ku-clean email (kama una utumia utility ya nje)
      const cleanedVal = cleanEmail(val);
    
      if ((cleanedVal.match(/@/g) || []).length > 1) return;
    
      if (cleanedVal.includes("@")) setSuggestion(getEmailSuggestion(cleanedVal));
      else setSuggestion(null);
    
      if (onChange) onChange(cleanedVal);
      if (internalError) setInternalError("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if ((e.key === "Tab" || e.key === "ArrowRight") && suggestion) {
        e.preventDefault();
        if (onChange) onChange(suggestion);
        setSuggestion(null);
      }
      onKeyDown?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      const val = String(propsValue || "").trim();
      let error = "";
      if (isRequired && !val) error = `${capitalize(label)} is required`;
      else if (val && !emailRegex.test(val)) error = `Enter a valid ${label.toLowerCase()}`;

      setInternalError(error);
      onError?.(error);
    };

    return (
      <div className={cn("relative w-full mb-1", className)}>
        {labelStrategy === "fixed" && (
          <span className="block mb-1 text-[11px] font-bold text-muted">{label}</span>
        )}

        <div className="relative flex items-center">
          <Mail className={cn("absolute left-4 z-10 transition-colors", activeError ? "text-destructive" : isFocused ? "text-primary" : "text-muted")} size={size === "sm" ? 14 : 18} />
          
          {/* GHOST SUGGESTION */}
          {isFocused && suggestion && (
            <div className={cn(
              "absolute pointer-events-none select-none text-muted opacity-80 z-20 whitespace-pre",
              size === "sm" ? "left-9 text-xs" : "left-10 text-[15px]"
            )}>
              <span className="opacity-0">{propsValue}</span>
              {suggestion.slice(String(propsValue || "").length)}
            </div>
          )}

          <input
            {...props}
            ref={(node) => {
              // Unganisha na ref inayokuja kutoka nje (kama ipo)
              if (typeof ref === 'function') ref(node);
              else if (ref) (ref as React.RefObject<HTMLInputElement | null>).current = node;
              
              // Unganisha na ref ya ndani kwa ajili ya suggestion
              localRef.current = node;
            }}
            type="email"
            value={propsValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            spellCheck={false}
            autoComplete="off"
            className={cn(
              "w-full bg-inherit outline-none transition-all duration-300 border-[1.5px] z-30 bg-transparent",
              sizeClasses[size],
              size === "lg" ? "rounded-lg" : "rounded-md",
              activeError ? "border-destructive focus:border-destructive" : "border-slate-500/30 focus:border-primary",
              labelStrategy === "floating" && "peer"
            )}
            placeholder={labelStrategy === "floating" ? " " : props.placeholder}
          />

          {labelStrategy === "floating" && (
            <label className={cn(
              "absolute left-11 transition-all pointer-events-none text-muted duration-200 z-35", activeError ? "text-destructive" : "text-muted-foreground",
              (isFocused || hasContent) 
                ? "-top-2.5 left-3 bg-card px-1 text-[11px] font-bold text-primary-foreground"
                : "top-1/2 -translate-y-1/2 text-sm"
            )}>
              {label}
            </label>
          )}
        </div>

        <div className="h-5 mt-0.5 flex items-center">
          {activeError && (
            <div className="flex items-center gap-1.5 text-[11px] text-destructive animate-in fade-in">
              <AlertCircle size={12} />
              <span>{activeError}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

SmartEmailField.displayName = "SmartEmailField";