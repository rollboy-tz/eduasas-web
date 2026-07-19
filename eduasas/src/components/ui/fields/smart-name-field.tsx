"use client";

import React, { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils/helper";
import { User, AlertCircle } from "lucide-react";
import { cleanSingleName, cleanFullName, capitalize } from "@/lib/utils/string-utils";

interface NameFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "onChange" | "onError"> {
  label: string;
  variant?: "neon" | "flat";
  size?: "sm" | "md" | "lg";
  labelStrategy?: "floating" | "fixed" | "none";
  onChange?: (val: string) => void;
  onError?: (val: string) => void;
  externalError?: string; // Hii ndio Error inayotoka nje (Prop muhimu)
  isFullname?: boolean;
  isRequired?: boolean;
  labelClassName?: string;
}

export const SmartNameField = React.forwardRef<HTMLInputElement, NameFieldProps>(
  ({
    label,
    variant = "flat",
    size = "lg",
    labelStrategy = "floating",
    isFullname = false,
    isRequired = true,
    externalError, // Tunapokea error kutoka nje
    className,
    onChange,
    onBlur,
    onFocus,
    onError,
    value,
    labelClassName,
    ...props
  }, ref) => {
    const [internalError, setInternalError] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    // Tunatumia logic ya memoized error ili kuzuia kugongana kwa internal na external
    const activeError = externalError || internalError;

    const sizeClasses = {
      sm: "h-9 text-xs pl-9 pr-3",
      md: "h-11 text-sm pl-11 pr-3",
      lg: "h-14 text-[15px] pl-12 pr-4",
    };

    const adaptiveRadius = { sm: "rounded", md: "rounded-md", lg: "rounded-lg" };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value;
      if (val.startsWith(" ")) val = val.trim();
      val = isFullname ? cleanFullName(val) : cleanSingleName(val);

      e.target.value = val;
      if (onChange) onChange(val);
      if (internalError) setInternalError(""); // Futa error ya ndani mtumiaji akianza ku-type
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      const val = e.target.value.trim();

      let error = "";
      if (isRequired && val.length === 0) error = `${capitalize(label)} is required`;
      else if (val.length > 0 && val.length < 2) error = `${capitalize(label)} is too short`;
      else if (isFullname && val.split(" ").filter(n => n.length > 0).length < 2) error = "Please enter full name";

      setInternalError(error);
      onError?.(error);
      if (onBlur) onBlur(e);
    };

    return (
      <div className={cn("relative w-full mb-1", className)}>
        {labelStrategy === "fixed" && (
          <span className="block mb-1 text-[11px] font-bold text-muted uppercase">{label}</span>
        )}

        <div className="relative flex items-center">
          <User className={cn("absolute left-4 z-10 transition-colors", activeError ? "text-destructive" : isFocused ? "text-primary-foreground" : "text-muted-foreground")} size={size === "sm" ? 14 : 18} />

          <input
            {...props}
            ref={ref}
            value={value}
            onFocus={(e) => { setIsFocused(true); onFocus?.(e); }}
            onBlur={handleBlur}
            onChange={handleChange}
            className={cn(
              "w-full bg-inherit outline-none transition-all duration-300 border-[1.5px]",
              sizeClasses[size], adaptiveRadius[size],
              activeError ? "border-destructive focus:border-destructive" : "border-slate-500/30 focus:border-primary-foreground",
              labelStrategy === "floating" && "peer"
            )}
            placeholder={labelStrategy === "floating" ? " " : props.placeholder}
          />

          <label
            className={cn(
              "absolute left-11 transition-all pointer-events-none duration-200", activeError ? "text-destructive" : "text-muted-foreground",
              (isFocused || value || props.defaultValue)
                ? "-top-2 left-3 bg-card px-1 text-[11px] font-bold text-primary-foreground"
                : "top-1/2 -translate-y-1/2 text-sm"
            )}
          >
            {label}
          </label>
        </div>

        {/* ERROR SLOT: Fixed height kuzuia layout shift */}
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

SmartNameField.displayName = "SmartNameField";