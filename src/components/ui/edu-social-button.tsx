"use client";

import React from "react";
import { cn } from "@/lib/utils/helper";
import Image from "next/image";

interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  text?: string;
  iconPath?: string;
  iconPosition?: "left" | "right";
  showText?: boolean;
  size?: "sm" | "md" | "lg"; // Ongezeko la Size
}

export const EduSocialButton = ({
  isLoading = false,
  text,
  iconPath,
  iconPosition = "left",
  showText = true,
  size = "lg", // Default ni ile kubwa tuliyozoea
  className,
  disabled,
  ...props // Hapa ndipo onClick na functions zingine zinapoingia
}: SocialButtonProps) => {

  // 1. DYNAMIC SIZES
  const sizeClasses = {
    sm: showText ? "h-9 px-4 text-[11px] rounded-md" : "h-9 w-9 rounded-md",
    md: showText ? "h-11 px-5 text-[13px] rounded-lg" : "h-11 w-11 rounded-lg",
    lg: showText ? "h-13 px-6 text-[14px] rounded-xl" : "h-13 w-13 rounded-xl",
  };

  const iconSize = {
    sm: 16,
    md: 18,
    lg: 22
  }[size];

  const Spinner = () => (
    <svg className="animate-spin h-5 w-5 opacity-70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <button
      disabled={disabled || isLoading}
      // {...props} hapa inabeba onClick, onFocus, type="button", nk.
      {...props}
      className={cn(
        "relative flex items-center justify-center transition-all duration-300 cursor-pointer",
        "font-black active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed",

        // SURFACE THEME
        "bg-white border border-slate-200 text-slate-800 shadow-sm",
        "dark:bg-[#2A2A2A] dark:border-white/5 dark:text-white",
        "hover:bg-slate-50 dark:hover:bg-[#323232] hover:border-slate-300 dark:hover:border-white/10",

        sizeClasses[size],
        className
      )}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <div className={cn(
          "flex items-center justify-center gap-3", // Gap hii inahakikisha nafasi kati ya icon na text ni fixed
          iconPosition === "right" ? "flex-row-reverse" : "flex-row"
        )}>
          {iconPath && (
            <div className="relative flex-shrink-0 flex items-center justify-center">
              <Image
                src={iconPath}
                alt="social-provider"
                width={iconSize}
                height={iconSize}
                className="object-contain"
              />
            </div>
          )}

          {showText && text && (
            <span className="capitalize tracking-tight font-semibold">
              {/* Ondoa 'w-full' na 'text-center' hapa */}
              {text}
            </span>
          )}
        </div>
      )}

      {/* Depth Overlay */}
      <div className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent dark:from-white/[0.02]" />
      </div>
    </button>
  );
};