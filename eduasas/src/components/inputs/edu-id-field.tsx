"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils/helper";
import { Hash, AlertCircle, LucideIcon } from "lucide-react";

/**
 * EDU-ID-FIELD (v6.4)
 * -----------------------------------------------------------
 * - Auto-Hyphen: Inaweka "-" yenyewe baada ya herufi 3.
 * - Validation on Blur: Haipigi kelele mpaka mtumiaji akitoka.
 * - Focus Peace: Inafuta error state pindi mtumiaji anaporudi kuandika.
 * - Clean Icons: Icon ya nje (Static) na Error icon pekee.
 */

type IDCategory = "USER" | "SCHOOL" | "STUDENT" | "STAFF" | "UNKNOWN";

interface IdFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "size"> {
  label: string;
  icon?: LucideIcon;
  variant?: "neon" | "flat";
  size?: "sm" | "md" | "lg";
  labelStrategy?: "floating" | "fixed" | "none";
  isRequired?: boolean;
  onChange?: (val: string) => void;
  allowedTypes?: IDCategory[];
}

export const EduIdField = ({
  label,
  icon: StaticIcon,
  variant = "flat",
  size = "lg",
  labelStrategy = "floating",
  isRequired,
  onChange,
  className,
  placeholder,
  allowedTypes = ["USER", "SCHOOL", "STUDENT", "STAFF"],
  ...props
}: IdFieldProps) => {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showError, setShowError] = useState(false); // Inadhibiti lini error ionekane
  const [detectedType, setDetectedType] = useState<IDCategory>("UNKNOWN");

  const idConfigurations: Record<string, { type: IDCategory; length: number; label: string }> = {
    "EAU-": { type: "USER", length: 13, label: "User ID" },
    "EAS-": { type: "SCHOOL", length: 12, label: "School ID" },
  };

  const config = Object.entries(idConfigurations).find(([prefix]) => value.startsWith(prefix))?.[1];
  
  // Real-time validation message (Lakini inaonyeshwa tu kulingana na showError state)
  const validationMessage = useMemo(() => {
    if (!value) return null;
    if (value.length <= 4) return "Format: ABC-123...";
    if (!config) return "Unknown ID prefix";
    if (!allowedTypes.includes(config.type)) return `Invalid ID for this section`;
    if (value.length !== config.length) return `Incomplete ID format`;
    return null;
  }, [value, config, allowedTypes]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.toUpperCase();
    
    // 1. AUTO-HYPHEN LOGIC: Weka "-" yenyewe baada ya herufi 3
    if (raw.length === 3 && !raw.includes("-")) {
        raw = raw + "-";
    }

    // 2. STRICT FORMATTING: Prefix (A-Z & -) vs Suffix (0-9)
    if (raw.length <= 4) {
      raw = raw.replace(/[^A-Z-]/g, "");
    } else {
      const prefixPart = raw.substring(0, 4);
      const suffixPart = raw.substring(4).replace(/[^0-9]/g, "");
      raw = prefixPart + suffixPart;
    }

    // 3. DETECTION & LENGTH CONTROL
    const configMatch = Object.entries(idConfigurations).find(([p]) => raw.startsWith(p));
    if (configMatch) {
      const settings = configMatch[1];
      setDetectedType(settings.type);
      if (raw.length > settings.length) raw = raw.substring(0, settings.length);
    } else {
      setDetectedType("UNKNOWN");
      if (raw.length > 4) raw = raw.substring(0, 4);
    }

    setValue(raw);
    if (onChange) onChange(raw);
  };

  const onBlurHandler = () => {
    setIsFocused(false);
    // Tunawasha error wakati mtumiaji anatoka
    if (validationMessage) setShowError(true);
  };

  const onFocusHandler = () => {
    setIsFocused(true);
    // Tunasafisha error wakati anarudi kurekebisha
    setShowError(false);
  };

  const getVariantClasses = () => {
    const isNeon = variant === "neon";
    if (showError) return "border-red-500 border-2 animate-shake";
    if (isFocused || value) return isNeon ? "border-primary border-2 shadow-[0_0_8px_rgba(var(--primary-rgb),0.15)]" : "border-[var(--text-muted)] border-2";
    return "border-slate-500/20 border-[1.5px] hover:border-slate-500/40";
  };

  const sizeClasses = {
    sm: "h-9 text-xs pl-9 pr-3",
    md: "h-11 text-sm pl-11 pr-3",
    lg: "h-14 text-[15px] pl-12 pr-4",
  };

  const DisplayIcon = StaticIcon || Hash;

  return (
    <div className={cn("relative w-full group mb-2 bg-inherit text-left", className)}>
      
      {labelStrategy === "fixed" && (
        <span className={cn(
            "block mb-1.5 text-[11px] font-bold tracking-tight transition-all duration-300",
            showError ? "text-red-500" : (isFocused ? "text-primary" : "text-muted")
        )}>
          {showError ? validationMessage : label} {isRequired && <span className="text-red-500">*</span>}
        </span>
      )}

      <div className="relative flex items-center bg-inherit">
        <div className={cn("absolute left-4 z-50 pointer-events-none transition-all duration-300", 
          isFocused ? "text-primary scale-110" : "text-muted")}>
          {showError ? <AlertCircle size={18} className="text-red-500" /> : <DisplayIcon size={18} />}
        </div>

        <input
          {...props}
          value={value}
          onChange={handleInputChange}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          placeholder={labelStrategy === "floating" ? (isFocused ? placeholder : "") : placeholder}
          className={cn(
            "peer w-full bg-transparent outline-none transition-all duration-300 z-40 text-foreground tracking-widest",
            getVariantClasses(),
            sizeClasses[size],
            size === "lg" ? "rounded-xl" : "rounded-md"
          )}
        />

        {labelStrategy === "floating" && (
          <label className={cn(
            "absolute px-1.5 pointer-events-none transition-all duration-200 z-50 bg-inherit",
            (isFocused || value) 
              ? cn("-top-2.5 left-3 text-[11px] font-bold", showError ? "text-red-500" : "text-primary") 
              : "top-1/2 -translate-y-1/2 left-11 text-muted"
          )}>
            {showError ? validationMessage : label} {isRequired && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}

        {/* DETECTOR LABEL */}
        {value.length >= 4 && !showError && (
          <div className="absolute right-4 text-[9px] font-bold opacity-30 uppercase tracking-tighter">
            {config?.label || "ID Detected"}
          </div>
        )}
      </div>
    </div>
  );
};