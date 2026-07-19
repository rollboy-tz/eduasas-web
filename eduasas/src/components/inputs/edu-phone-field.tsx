"use client";

import React, { useState, useId, useEffect } from "react";
import PhoneInputLib, { PhoneInputProps } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { cn } from "@/lib/utils/helper";
import { capitalize } from "@/lib/utils/string-utils";

/**
 * PHONE NUMBER INPUT (v4.2 - Adaptive & Global)
 * --------------------------------------------
 * 1. Variant: 'neon' (Blue focus) vs 'flat' (Neutral focus).
 * 2. Size: 'sm', 'md', 'lg' yenye Adaptive Radius.
 * 3. Strategy: 'floating', 'fixed', 'none'.
 * 4. Logic: ITU-T Validation & Tanzania Zero-Cleanup.
 */

interface CustomPhoneProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "onError" | "onChange"> {
  label: string;
  variant?: "neon" | "flat";
  size?: "sm" | "md" | "lg";
  labelStrategy?: "floating" | "fixed" | "none";
  error?: string;
  isRequired?: boolean;
  onChange?: (value: string) => void;
  onError?: (error: string) => void;
  containerClassName?: string;
  labelClassName?: string;
}

export const EduPhoneField = ({
  label,
  variant = "flat",
  size = "lg",
  labelStrategy = "floating",
  error: propsError,
  onError,
  isRequired = true,
  onChange,
  value: __ignoredValue,
  containerClassName,
  labelClassName,
  ...props
}: CustomPhoneProps) => {
  const [localError, setLocalError] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState("");
  const [dialCode, setDialCode] = useState("255");
  const [countryData, setCountryData] = useState<any>(null); 
  
  const instanceId = useId().replace(/:/g, "");
  const customClass = `edu-phone-${instanceId}`;

  const hasRealContent = internalValue.length > dialCode.length;
  const activeError = propsError || localError;

  // SHERIA YA RADIUS: LG = xl, MD/SM = md
  const adaptiveRadius = {
    sm: "!rounded",
    md: "!rounded-md",
    lg: "!rounded-lg",
  };

  const sizeClasses = {
    sm: "!h-9 !text-xs !pl-11",
    md: "!h-11 !text-sm !pl-12",
    lg: "!h-14 !text-[15px] !pl-14",
  };

  const handlePhoneChange = (value: string, data: any) => {
    setDialCode(data.dialCode);
    setCountryData(data);
    
    let updatedValue = value;
    const countryCode = data.dialCode;
    const localNumber = value.startsWith(countryCode) 
      ? value.slice(countryCode.length) 
      : value;

    if (localNumber.length > 1 && localNumber.startsWith("0")) {
      updatedValue = countryCode + localNumber.slice(1);
    }

    setInternalValue(updatedValue);
    if (onChange) onChange(`+${updatedValue}`);
    if (localError) setLocalError("");
  };

  const handleBlur = () => {
    setIsFocused(false);
  
    let error = "";
  
    if (isRequired && !hasRealContent) {
      error = `${capitalize(label)} is required`;
    } else if (hasRealContent && countryData) {
      const actualNumberLength =
        internalValue.length - countryData.dialCode.length;
  
      if (actualNumberLength < 7) {
        error = "Phone number is too short";
      } else if (actualNumberLength > 12) {
        error = "Phone number is too long";
      }
    }
  
    setLocalError(error);   // kwa UI
    onError?.(error);       // 🔥 TUMA PAPO HAPO
  };

  const getVariantClasses = () => {
    const isNeon = variant === "neon";
    const isActive = isFocused || hasRealContent;

    if (activeError) return "!border-destructive !border-2 animate-shake";
    
    if (isActive) {
      return isNeon 
        ? "!border-primary !border-2" 
        : "!border-muted !border-2";
    }
    
    return isNeon 
      ? "!border-border !border-[1.5px]" 
      : "!border-slate-500/30 !border-[1.5px] hover:!border-slate-500/60";
  };

  return (
    <div className={cn("relative w-full group mb-2 font-sans bg-inherit", containerClassName)}>
      <style>{`
        .${customClass} .country-list {
          background-color: bg-card !important;
          border: 1px solid border !important;
          border-radius: 8px !important;
          padding: 4px !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4) !important;
          margin-top: 8px !important;
          z-index: 9999 !important;
        }
        .${customClass} .country-list .country:hover {
          background-color:primary !important;
          color: #ffffff !important;
        }
        .${customClass} .flag-dropdown {
          background: transparent !important;
          border: none !important;
        }
        .${customClass} .selected-flag {
          background: transparent !important;
          width: ${size === 'sm' ? '38px' : '48px'} !important;
        }
      `}</style>

      {/* FIXED LABEL STRATEGY */}
      {labelStrategy === "fixed" && (
        <span className={cn(
          "block mb-1.5 text-[11px] font-bold tracking-wider inherit",
          activeError ? "text-destructive" : "text-muted",
          labelClassName
        )}>
          {label}
        </span>
      )}

      <div className={cn(customClass, "relative flex items-center bg-inherit")}>
        <PhoneInputLib
          country={"tz"}
          value={internalValue}
          onChange={handlePhoneChange}
          onFocus={() => { setIsFocused(true); setLocalError(""); }}
          onBlur={handleBlur}
          countryCodeEditable={false}
          inputClass={cn(
            "!w-full !bg-inherit !outline-none !transition-all !duration-300 !z-20 !text-foreground !shadow-none",
            sizeClasses[size],
            adaptiveRadius[size],
            getVariantClasses()
          )}
          buttonClass="!bg-inherit !z-25 !cursor-pointer !pl-3"
          {...props}
        />

        {/* FLOATING LABEL STRATEGY */}
        {labelStrategy === "floating" && (
          <label className={cn(
            "absolute px-1.5 pointer-events-none transition-all duration-200 z-25 bg-inherit",
            size === "sm" ? "left-10 text-xs" : "left-12 text-[14px]",
            (isFocused || hasRealContent) 
              ? cn(
                  "-top-2 left-3 text-[11px] font-bold tracking-widest before:content-[''] before:absolute before:inset-0 before:bg-inherit before:-z-10 before:h-[2px] before:top-1/2 before:-translate-y-1/2",
                  activeError ? "text-destructive" : (variant === "neon" ? "text-primary" : "text-foreground")
                )
              : "top-1/2 -translate-y-1/2 text-muted",
            labelClassName
          )}>
            {activeError ? activeError : (isFocused && !hasRealContent ? `Enter ${label.toLowerCase()}` : label)}
          </label>
        )}
      </div>
    </div>
  );
};