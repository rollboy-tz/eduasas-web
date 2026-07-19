"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils/helper";
import { Mail } from "lucide-react";
import { cleanEmail, getEmailSuggestion, capitalize } from "@/lib/utils/string-utils";

/**
 * EMAIL FIELD (v4.3 - Border-Cutter & Non-Uppercase)
 */

interface EduEmailFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "onError" | "onChange"> {
  label: string;
  variant?: "neon" | "flat";
  size?: "sm" | "md" | "lg"; 
  labelStrategy?: "floating" | "fixed" | "none";
  isRequired?: boolean;
  onChange?: (value: string) => void;
  onError?: (error: string) => void;
  labelClassName?: string;
}

export const EduEmailField = React.forwardRef<HTMLInputElement, EduEmailFieldProps>(
  ({ 
    label, 
    variant = "flat", 
    size = "lg", 
    labelStrategy = "floating",
    isRequired = true, 
    className, 
    onChange, 
    onError, 
    value: propsValue, 
    onKeyDown,
    labelClassName,
    ...props 
  }, ref) => {
    const [localError, setLocalError] = useState("");
    const [suggestion, setSuggestion] = useState<string | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    
    const [internalValue, setInternalValue] = useState("");
    const internalRef = useRef<HTMLInputElement>(null);

    const currentValue = propsValue !== undefined ? propsValue : internalValue;
    const hasContent = String(currentValue || "").length > 0;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    const sizeClasses = {
      sm: "h-9 text-xs pl-9 pr-3",
      md: "h-11 text-sm pl-11 pr-3",
      lg: "h-14 text-[15px] pl-12 pr-4",
    };

    const combinedRef = (node: HTMLInputElement) => {
      (internalRef as any).current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as any).current = node;
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      if (localError) setLocalError(""); 
      if (props.onFocus) props.onFocus(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = cleanEmail(e.target.value);
      val = val.replace(/[^a-z0-9@._-]/g, "");
      if ((val.match(/@/g) || []).length > 1) return;

      if (val.includes("@")) {
        setSuggestion(getEmailSuggestion(val));
      } else {
        setSuggestion(null);
      }

      setInternalValue(val);
      if (onChange) onChange(val);
    };

    const applySuggestion = useCallback(() => {
      if (suggestion && internalRef.current) {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
        setter?.call(internalRef.current, suggestion);
        internalRef.current.dispatchEvent(new Event("input", { bubbles: true }));
        setInternalValue(suggestion);
        setSuggestion(null);
        setLocalError("");
      }
    }, [suggestion]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if ((e.key === "Tab" || e.key === "ArrowRight") && suggestion) {
        e.preventDefault();
        applySuggestion();
      }
      if (onKeyDown) onKeyDown(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      const val = String(currentValue || "").trim();
      let error = "";
      if (isRequired && !val) {
        error = `${capitalize(label)} is required`;
      } else if (val && !emailRegex.test(val)) {
        error = `Enter a valid ${label.toLowerCase()}`;
      }

      if(error.length > 0) {
        setLocalError(error);
        onError?.(error); // Send error string outside
      } else {
        setLocalError("");
        onError?.("");
      }
      if (props.onBlur) props.onBlur(e);
    };

    const getVariantClasses = () => {
      const isNeon = variant === "neon";
      const isInputActive = isFocused || hasContent;

      if (localError) return "border-destructive border-2 animate-shake";
      
      if (isInputActive) {
        return isNeon 
          ? "border-primary border-2" 
          : "border-border border-2";
      }
      
      return isNeon 
        ? "border-border border-[1.5px]" 
        : "border-slate-500/30 border-[1.5px] hover:border-slate-500/60";
    };

    return (
      <div className={cn("relative w-full group mb-2 font-sans text-left bg-inherit", className)}>
        
        {/* FIXED LABEL STRATEGY */}
        {labelStrategy === "fixed" && (
          <span className={cn(
            "block mb-1.5 text-[11px] font-bold tracking-wider", // ONDOA UPPERCASE HAPA
            localError ? "text-destructive" : "text-muted",
            labelClassName
          )}>
            {label}
          </span>
        )}

        <div className="relative flex items-center bg-inherit">
          {/* ICON: Tabaka la juu z-20 */}
          <div className={cn(
            "absolute pointer-events-none z-20 transition-all duration-300",
            size === "sm" ? "left-3" : "left-4"
          )}>
            <Mail 
              size={size === "sm" ? 14 : 18} 
              className={cn(
                localError ? "text-destructive" : (isFocused || hasContent) ? (variant === "neon" ? "text-primary" : "text-foreground") : "text-muted"
              )} 
            />
          </div>

          {/* SUGGESTION: Tabaka la chini z-10 */}
          {isFocused && suggestion && (
            <div className={cn(
              "absolute top-1/2 -translate-y-1/2 text-muted opacity-70 pointer-events-none select-none z-20 whitespace-pre",
              size === "sm" ? "left-9.5 text-xs" : size === "md" ? "left-11.5 text-sm" : "left-12.5 text-[15px]"
            )}>
              <span className="opacity-0">{String(currentValue || "")}</span>
              {suggestion.slice(String(currentValue || "").length)}
            </div>
          )}

          {/* INPUT: Tabaka la kati z-20 (Lazima iwe bg-transparent ili kuona z-10) */}
          <input
            {...props}
            ref={combinedRef}
            type="email"
            value={currentValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            spellCheck={false}
            autoComplete="off"
            placeholder={labelStrategy === "floating" ? " " : props.placeholder} 
            className={cn(
              "peer w-full bg-transparent outline-none transition-all duration-300 z-15 text-foreground shadow-none whitespace-nowrap overflow-hidden",
              size === "lg" ? "rounded-lg" : size === "md" ? "rounded-md" : "rounded-sm",
              sizeClasses[size],
              getVariantClasses()
            )}
          />

          {/* FLOATING LABEL: Tabaka la juu z-30 na Card-BG ili kukata border */}
          {labelStrategy === "floating" && (
            <label className={cn(
              "absolute px-1.5 pointer-events-none transition-all duration-200 z-25",
              "bg-inherit", // DAWA: Card background ili kuficha border
              size === "sm" ? "left-8 text-xs" : "left-11 text-[14px]",
              (isFocused || hasContent) 
                ? cn(
                    "-top-2.5 left-3 text-[11px] font-bold tracking-widest", // ONDOA UPPERCASE
                    localError ? "text-destructive" : (variant === "neon" ? "text-primary" : "text-foreground")
                  )
                : "top-1/2 -translate-y-1/2 text-muted",
              labelClassName
            )}>
              {localError ? localError : label}
            </label>
          )}
        </div>
      </div>
    );
  }
);

EduEmailField.displayName = "EduEmailField";