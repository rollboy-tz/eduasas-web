"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils/helper";
import { User } from "lucide-react";
import { cleanSingleName, cleanFullName, capitalize } from "@/lib/utils/string-utils";

/**
 * NAME FIELD (v4.2 - Adaptive & Modular)
 * ---------------------------------------
 * 1. Variant: 'neon' (Blue focus) vs 'flat' (Neutral focus).
 * 2. Size: 'sm', 'md', 'lg' yenye Adaptive Radius.
 * 3. Strategy: 'floating', 'fixed', 'none'.
 * 4. Logic: Inabaki na name cleaning na validation zako.
 */

interface NameFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "onChange" | "onError"> {
  label: string;
  variant?: "neon" | "flat";
  size?: "sm" | "md" | "lg";
  labelStrategy?: "floating" | "fixed" | "none";
  onChange?: (val: string) => void;
  onError?: (val: string) => void;
  isFullname?: boolean;
  isRequired?: boolean;
  labelClassName?: string;
}

export const NameField = React.forwardRef<HTMLInputElement, NameFieldProps>(
  ({
    label,
    variant = "flat",
    size = "lg",
    labelStrategy = "floating",
    isFullname = false,
    isRequired = true,
    className,
    onChange,
    onBlur,
    onFocus,
    onError,
    value,
    labelClassName,
    ...props
  }, ref) => {
    const [localError, setLocalError] = useState("");
    const [hasValue, setHasValue] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // SHERIA YA RADIUS: LG = xl, MD/SM = md
    const adaptiveRadius = {
      sm: "rounded",
      md: "rounded-md",
      lg: "rounded-lg",
    };

    const sizeClasses = {
      sm: "h-9 text-xs pl-9 pr-3",
      md: "h-11 text-sm pl-11 pr-3",
      lg: "h-14 text-[15px] pl-12 pr-4",
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value;
      if (val.startsWith(" ")) val = val.trim();

      if (isFullname) {
        val = cleanFullName(val);
      } else {
        val = cleanSingleName(val);
      }

      e.target.value = val;
      setHasValue(val.length > 0);
      if (onChange) onChange(val);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      setLocalError("");
      if (onFocus) onFocus(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
    
      const val = e.target.value.trim();
      e.target.value = val;
      setHasValue(val.length > 0);
    
      // Determine error message locally
      let error = "";
      if (isRequired && val.length === 0) {
        error = `${capitalize(label)} is required`;
      } else if (val.length > 0 && val.length < 2) {
        error = `${capitalize(label)} is too short`;
      } else if (isFullname && val.split(" ").filter(n => n.length > 0).length < 2) {
        error = "Please enter at least two names";
      }
    
      setLocalError(error);
      onError?.(error);
    
      // Call onBlur if provided
      if (onBlur) onBlur(e);
    };

    const getVariantClasses = () => {
      const isNeon = variant === "neon";
      const isInputActive = isFocused || hasValue;

      if (localError) return "border-destructive border-2 animate-shake";

      if (isInputActive) {
        return isNeon
          ? "border-primary border-2 text-foreground"
          : "border-muted border-2 text-foreground";
      }

      return isNeon
        ? "border-muted border-[1.5px]"
        : "border-slate-500/30 border-[1.5px] hover:border-slate-500/60";
    };

    return (
      <div className={cn("relative w-full group mb-2 font-sans bg-inherit", className)}>

        {/* FIXED LABEL STRATEGY */}
        {labelStrategy === "fixed" && (
          <span className={cn(
            "block mb-1.5 text-[11px] font-bold tracking-wider",
            localError ? "text-destructive" : "text-muted",
            labelClassName
          )}>
            {label}
          </span>
        )}

        <div className="relative flex items-center bg-inherit">
          <div className={cn(
            "absolute z-30 pointer-events-none transition-all duration-300",
            size === "sm" ? "left-3" : "left-4",
            localError ? "text-destructive" : (isFocused || hasValue) ? (variant === "neon" ? "text-primary" : "text-foreground") : "text-muted"
          )}>
            <User size={size === "sm" ? 14 : 18} strokeWidth={2.5} />
          </div>

          <input
            {...props}
            ref={ref}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoComplete={isFullname ? "name" : "given-name"}
            placeholder={labelStrategy === "floating" ? " " : props.placeholder}
            className={cn(
              "peer w-full bg-inherit whitespace-nowrap overflow-hidden outline-none transition-all duration-300 z-20 shadow-none",
              sizeClasses[size],
              adaptiveRadius[size],
              getVariantClasses()
            )}
          />

          {/* FLOATING LABEL STRATEGY */}
          {labelStrategy === "floating" && (
            <label
              className={cn(
                "absolute px-1.5 pointer-events-none transition-all duration-200 select-none z-30 bg-inherit",
                size === "sm" ? "left-8 text-xs" : "left-11 text-[14px]",
                (isFocused || hasValue)
                  ? cn(
                    "-top-2 left-3 text-[11px] font-bold tracking-widest before:content-[''] before:absolute before:inset-0 before:bg-inherit before:-z-10 before:h-[2px] before:top-1/2 before:-translate-y-1/2",
                    localError ? "text-destructive" : (variant === "neon" ? "text-primary" : "text-foreground")
                  )
                  : "top-1/2 -translate-y-1/2 text-muted",
                labelClassName
              )}
            >
              {localError ? localError : label}
            </label>
          )}
        </div>
      </div>
    );
  }
);

NameField.displayName = "NameField";