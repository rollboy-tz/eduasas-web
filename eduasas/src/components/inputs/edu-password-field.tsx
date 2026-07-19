"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils/helper";
import { Lock, Eye, EyeOff, RefreshCcw } from "lucide-react";
import { capitalize } from "@/lib/utils/string-utils";

/**
 * PASSWORD FIELD (v4.2)
 * ---------------------
 * 1. Variant: 'neon' | 'flat'
 * 2. Size: 'sm' | 'md' | 'lg' (Adaptive Radius)
 * 3. Strategy: 'floating' | 'fixed' | 'none'
 * 4. Logic: Dual-mode (Create/Confirm), Validation, Unlocking.
 */

interface PasswordProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "onError" | "onChange"> {
  label: string;
  variant?: "neon" | "flat";
  size?: "sm" | "md" | "lg";
  labelStrategy?: "floating" | "fixed" | "none";
  isRequired?: boolean;
  isConfirm?: boolean;
  parentValue?: string;
  onChange?: (val: string) => void;
  onError?: (error: string) => void;
  labelClassName?: string;
  onValidate?: (validate: () => boolean) => void;
}

export const PasswordField = React.forwardRef<HTMLInputElement, PasswordProps>(
  ({
    label,
    variant = "flat",
    size = "lg",
    labelStrategy = "floating",
    isRequired = true,
    isConfirm = false,
    onValidate,
    parentValue = "",
    className,
    onChange,
    onError,
    value: propsValue,
    labelClassName,
    ...props
  }, ref) => {
    const [localError, setLocalError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [internalValue, setInternalValue] = useState("");
    const internalRef = useRef<HTMLInputElement>(null);

    const currentValue = propsValue !== undefined ? propsValue : internalValue;
    const hasContent = String(currentValue || "").length > 0;
    const isUnlocked = isConfirm ? (parentValue.length >= 6) : true;

    // RADIUS LOGIC: lg=xl, md/sm=md
    const adaptiveRadius = {
      sm: "rounded-md",
      md: "rounded-md",
      lg: "rounded-xl",
    };

    const sizeClasses = {
      sm: "h-9 text-xs pl-9 pr-10",
      md: "h-11 text-sm pl-11 pr-11",
      lg: "h-14 text-[15px] pl-12 pr-12",
    };

    const combinedRef = (node: HTMLInputElement) => {
      (internalRef as any).current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as any).current = node;
    };

    // Hard validation function for parent form
    const validate = () => {
      if (!isConfirm) return true; // Only confirm password needs this

      if (!parentValue) return true; // skip if parent password empty

      if (!currentValue) {
        setLocalError("Confirm password is required");
        onError?.("Confirm password is required");
        return false;
      }

      if (currentValue !== parentValue) {
        setLocalError("Passwords do not match");
        onError?.("Passwords do not match");
        return false;
      }

      setLocalError("");
      onError?.("");
      return true;
    };

    // Expose validation function to parent immediately
    if (onValidate) onValidate(validate);

    const getValidationError = (val: string) => {
      // Always check required first
      if (isRequired && !val) return `${label} is required`;

      if (isConfirm && !validate()) {
        if (!val) return `${label} is required`; // required for confirm
        if (val !== parentValue) return "Passwords do not match";
        return "";
      }

      if (val.length < 6) return "Min 6 characters required";
      if (!/[A-Z]/.test(val)) return "Must include uppercase";
      if (!/[a-z]/.test(val)) return "Must include lowercase";
      if (!/[0-9]/.test(val)) return "Must include a number";

      return "";
    };



    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      setLocalError("");
      if (props.onFocus) props.onFocus(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value.replace(/\s/g, "");
      setInternalValue(val);
      if (onChange) onChange(val);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      validate();
      const error = getValidationError(String(currentValue))
      setLocalError(error);
      onError?.(error)
      if (props.onBlur) props.onBlur(e);
    };

    const getVariantClasses = () => {
      const isNeon = variant === "neon";
      const isActive = (isFocused || hasContent) && isUnlocked;

      if (localError) return "border-destructive border-2 animate-shake";

      if (isActive) {
        return isNeon ? "border-primary border-2" : "border-[var(--text-muted)] border-2";
      }

      return isNeon
        ? "border-[var(--input-border)] border-[1.5px]"
        : "border-slate-500/30 border-[1.5px] hover:border-slate-500/60";
    };

    return (
      <div className={cn("relative w-full group mb-2 font-sans bg-inherit", !isUnlocked && "opacity-40", className)}>

        {/* FIXED LABEL STRATEGY */}
        {labelStrategy === "fixed" && (
          <span className={cn(
            "block mb-1.5 text-[11px] font-bold tracking-wider bg-inerit",
            localError ? "text-destructive" : "text-muted",
            labelClassName
          )}>
            {label}
          </span>
        )}

        <div className="relative flex items-center bg-inherit">
          <div className={cn(
            "absolute z-20 pointer-events-none transition-all duration-300",
            size === "sm" ? "left-3" : "left-4"
          )}>
            {isConfirm ? (
              <RefreshCcw
                size={size === "sm" ? 14 : 18}
                className={cn(localError ? "text-destructive" : (isFocused || hasContent) ? (variant === "neon" ? "text-primary" : "text-foreground") : "text-muted", isFocused && "animate-spin-slow")}
              />
            ) : (
              <Lock
                size={size === "sm" ? 14 : 18}
                className={cn(localError ? "text-destructive" : (isFocused || hasContent) ? (variant === "neon" ? "text-primary" : "text-foreground") : "text-muted")}
              />
            )}
          </div>

          <input
            {...props}
            ref={combinedRef}
            disabled={!isUnlocked}
            type={showPassword ? "text" : "password"}
            value={currentValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={labelStrategy === "floating" ? " " : props.placeholder}
            className={cn(
              "peer w-full bg-inherit whitespace-nowrap overflow-hidden outline-none transition-all duration-300 z-15 text-foreground shadow-none",
              sizeClasses[size],
              adaptiveRadius[size],
              getVariantClasses(),
              !isUnlocked && "pointer-events-none"
            )}
          />

          <button
            type="button"
            disabled={!isUnlocked}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 z-20 p-1 text-slate-500 hover:text-primary transition-colors disabled:opacity-0"
          >
            {showPassword ? <EyeOff size={size === "sm" ? 14 : 18} /> : <Eye size={size === "sm" ? 14 : 18} />}
          </button>

          {/* FLOATING LABEL STRATEGY */}
          {labelStrategy === "floating" && (
            <label className={cn(
              "absolute px-1.5 pointer-events-none transition-all duration-200 z-20 bg-inherit",
              size === "sm" ? "left-8 text-xs" : "left-11 text-[14px]",
              (isFocused || hasContent)
                ? cn("-top-2 left-3 text-[11px] font-bold tracking-widest", localError ? "text-destructive" : (variant === "neon" ? "text-primary" : "text-foreground"))
                : "top-1/2 -translate-y-1/2 text-muted",
              labelClassName
            )}>
              {localError || (!isUnlocked ? "Set password first" : label)}
            </label>
          )}
        </div>
      </div>
    );
  }
);

PasswordField.displayName = "PasswordField";