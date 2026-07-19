"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils/helper";
import { Phone, AlertCircle } from "lucide-react";

interface SmartSimplePhoneProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "size"> {
  label: string;
  variant?: "neon" | "flat";
  size?: "sm" | "md" | "lg";
  labelStrategy?: "floating" | "fixed" | "none";
  error?: string;
  isRequired?: boolean;
  onChange?: (value: string) => void;
  defaultCountryCode?: string;
}

export const SmartSimplePhoneField = ({
  label, variant = "flat", size = "lg", labelStrategy = "floating",
  error: externalError, onChange, isRequired = false, className,
  defaultCountryCode = "+255", ...props
}: SmartSimplePhoneProps) => {
  const [value, setValue] = useState(defaultCountryCode);
  const [isFocused, setIsFocused] = useState(false);
  const [localError, setLocalError] = useState("");

  const activeError = externalError || localError;
  const hasRealContent = value.replace(defaultCountryCode, "").length > 0;

  const sizeClasses = {
    sm: "h-9 text-xs pl-10 rounded",
    md: "h-11 text-sm pl-11 rounded-md",
    lg: "h-14 text-[15px] pl-12 rounded-lg",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 1. Ondoa nafasi zote na herufi zisizo namba (isipokuwa +)
    let raw = e.target.value.replace(/[^\d+]/g, "");
    
    // 2. Logic ya sifuri
    if (raw.startsWith(defaultCountryCode + "0") && raw.length > defaultCountryCode.length + 1) {
      raw = defaultCountryCode + raw.slice(defaultCountryCode.length + 1);
    }
    
    if (!raw.startsWith(defaultCountryCode)) raw = defaultCountryCode;
    
    setValue(raw);

    // 3. API CLEANUP: Kama namba ina urefu sawa na code, tuma empty string
    const actualDigits = raw.replace(defaultCountryCode, "");
    if (onChange) {
      onChange(actualDigits.length > 0 ? raw : ""); 
    }
  };

  // Hapa ndipo tunapopangilia kwa nafasi (Visual Formatting pekee)
  const formatPhoneNumber = (raw: string) => {
    const digits = raw.replace(defaultCountryCode, "").replace(/\s/g, "");
    // Hii regex inafanya 787 885 020
    const match = digits.match(/(\d{0,3})(\d{0,3})(\d{0,4})/); 
    if (!match) return digits;
    return [match[1], match[2], match[3]].filter(Boolean).join(" ");
  };

  const handleFocus = () => {
    setIsFocused(true);
    setLocalError(""); // Clear error papo hapo wakati wa focus
  };

  const handleBlur = () => {
    setIsFocused(false);
    
    // VALIDATION LIFECYCLE: Inafanyika hapa tu kwenye Blur
    let validationError = "";
    if (isRequired && !hasRealContent) {
      validationError = `${label} is required`;
    } else if (hasRealContent) {
      const actualDigits = value.replace(defaultCountryCode, "");
      if (actualDigits.length < 9) {
        validationError = "Phone number is too short";
      } else if (actualDigits.length > 9) {
        validationError = "Phone number is too long";
      }
    }
    setLocalError(validationError);
  };

  // PEAK UX: Kama haiko focused na haina namba yoyote zaidi ya +255, input inaonekana tupu ili floating label ishuke chini vizuri bila kugongana na code ya nchi
  const displayValue = (isFocused || hasRealContent) 
    ? `${defaultCountryCode} ${formatPhoneNumber(value)}` 
    : "";

  return (
    <div className="relative w-full mb-1">
      {labelStrategy === "fixed" && (
        <label className="text-[11px] font-bold text-muted-foreground ml-1 mb-1 block">
          {label} {isRequired && <span className="text-destructive">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        <Phone size={size === "sm" ? 14 : 18} className={cn("absolute left-3 z-10 transition-colors", activeError ? "text-destructive" : "text-muted-foreground")} />

        <input
          {...props}
          type="text"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            "w-full border-[1.5px] outline-none transition-all duration-300 z-10 bg-card text-foreground",
            sizeClasses[size],
            variant === "neon" ? "focus:border-primary-foreground" : "focus:border-slate-500",
            activeError ? "border-destructive" : "border-slate-500/30",
            className
          )}
        />

        {labelStrategy === "floating" && (
          <label className={cn(
            "absolute px-1 bg-card transition-all pointer-events-none z-20", 
            activeError ? "text-destructive" : "text-muted-foreground",
            size === "sm" ? "left-9" : "left-10",
            (isFocused || hasRealContent) 
              ? "-top-2.5 left-3 text-[11px] font-bold text-primary-foreground" 
              : "top-1/2 -translate-y-1/2 text-sm"
          )}>
            {label} {isRequired && !isFocused && !hasRealContent && <span className="text-destructive">*</span>}
          </label>
        )}
      </div>

      {/* FIXED CONTAINER YA ERROR (Inazuia Layout Shift sawa na SmartSelect) */}
      <div className="h-5 flex items-center mt-0.5">
        {activeError && (
          <div className="flex items-center gap-1.5 text-destructive animate-in fade-in">
            <AlertCircle size={12} />
            <span className="text-[11px]">{activeError}</span>
          </div>
        )}
      </div>
    </div>
  );
};