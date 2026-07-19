"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils/helper";
import { Sparkles, LucideIcon } from "lucide-react";

/**
 * EDU-SMART-INPUT (v5.1)
 * -----------------------------------------------------------
 * 1. AI Highlighter: Herufi zinazofanana zinawaka rangi ya Primary.
 * 2. Adaptive Icons: Inapokea icon moja au icon toka kwenye data object.
 * 3. Required Logic: Border inabadilika kulingana na validation/focus.
 * 4. Stacking: Layering ya kishua (z-50 hadi z-100).
 */

interface SmartInputProps<T> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onSelect" | "size"> {
  label: string;
  suggestions: T[];
  suggestionKey: keyof T;
  iconKey?: keyof T; // Icon inayotoka kwenye data
  icon?: LucideIcon; // Icon ya kudumu
  onSelect?: (item: T) => void;
  variant?: "neon" | "flat";
  size?: "sm" | "md" | "lg";
  labelStrategy?: "floating" | "fixed" | "none";
  isRequired?: boolean;
  error?: string;
}

export const EduSmartField = <T extends Record<string, any>>({
  label,
  suggestions,
  suggestionKey,
  iconKey,
  icon: StaticIcon,
  onSelect,
  variant = "flat",
  size = "lg",
  labelStrategy = "floating",
  className,
  isRequired,
  error,
  ...props
}: SmartInputProps<T>) => {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 1. FILTER LOGIC
  const filteredList = useMemo(() => {
    if (!inputValue) return [];
    return suggestions.filter((item) =>
      String(item[suggestionKey]).toLowerCase().includes(inputValue.toLowerCase())
    ).slice(0, 8);
  }, [suggestions, inputValue, suggestionKey]);

  // 2. HIGHLIGHTER ENGINE: Inapaka rangi herufi zilizofanana
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() 
            ? <span key={i} className="text-primary font-black">{part}</span> 
            : <span key={i}>{part}</span>
        )}
      </span>
    );
  };

  const ghostText = useMemo(() => {
    if (!inputValue || filteredList.length === 0) return null;
    const firstMatch = String(filteredList[0][suggestionKey]);
    if (firstMatch.toLowerCase().startsWith(inputValue.toLowerCase())) return firstMatch;
    return null;
  }, [inputValue, filteredList, suggestionKey]);

  const handlePick = useCallback((item: T) => {
    setInputValue(String(item[suggestionKey]));
    setIsOpen(false);
    if (onSelect) onSelect(item);
  }, [onSelect, suggestionKey]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < filteredList.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      handlePick(filteredList[activeIndex]);
    } else if (e.key === "Tab" && ghostText) {
      e.preventDefault();
      setInputValue(ghostText);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const sizeClasses = {
    sm: "h-9 text-xs pl-9 pr-3",
    md: "h-11 text-sm pl-11 pr-3",
    lg: "h-14 text-[15px] pl-12 pr-4",
  };

  const getVariantClasses = () => {
    const isNeon = variant === "neon";
    if (error) return "border-destructive border-2 animate-shake";
    if (isFocused || inputValue) return isNeon ? "border-primary border-2" : "border-[var(--text-muted)] border-2";
    return isNeon ? "border-[var(--input-border)] border-[1.5px]" : "border-slate-500/30 border-[1.5px] hover:border-slate-500/60";
  };

  // Determine which icon to show
  const DynamicIcon = (isOpen || isFocused || inputValue) && iconKey && filteredList[activeIndex >= 0 ? activeIndex : 0]?.[iconKey]
    ? (filteredList[activeIndex >= 0 ? activeIndex : 0][iconKey] as LucideIcon)
    : (StaticIcon || Sparkles);

  return (
    <div className={cn("relative w-full group mb-2 bg-inherit", className)} ref={containerRef}>
      <div className="relative flex items-center bg-inherit">
        {/* ICON - Inabadilika kulingana na data au default */}
        <div className={cn("absolute left-4 z-80 pointer-events-none transition-all duration-300", 
          isFocused ? "text-primary scale-110" : "text-muted")}>
          <DynamicIcon size={size === "sm" ? 14 : 18} />
        </div>

        {/* GHOST TEXT */}
        {isFocused && ghostText && (
          <div className={cn("absolute top-1/2 -translate-y-1/2 text-muted opacity-30 pointer-events-none select-none z-50 whitespace-pre",
            size === "sm" ? "left-9 text-xs" : "left-12 text-[15px]")}>
            <span className="opacity-0">{inputValue}</span>
            {ghostText.slice(inputValue.length)}
          </div>
        )}

        <input
          {...props}
          ref={inputRef}
          value={inputValue}
          onFocus={() => { setIsFocused(true); setIsOpen(true); }}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => { setInputValue(e.target.value); setIsOpen(true); setActiveIndex(-1); }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          className={cn(
            "peer w-full bg-transparent outline-none transition-all duration-300 z-60 text-foreground shadow-none",
            getVariantClasses(),
            sizeClasses[size],
            size === "lg" ? "rounded-xl" : "rounded-md"
          )}
        />

        {labelStrategy !== "none" && (
          <label className={cn(
            "absolute px-1.5 pointer-events-none transition-all duration-200 z-70 bg-inherit",
            labelStrategy === "floating" 
              ? (isFocused || inputValue ? "-top-2.5 left-3 text-[11px] font-bold text-primary" : "top-1/2 -translate-y-1/2 left-11 text-muted")
              : "fixed strategy code hapa..." 
          )}>
            {error || label} {isRequired && <span className="text-red-500">*</span>}
          </label>
        )}
      </div>

      {/* SMART DROPDOWN - The AI List */}
      {isOpen && filteredList.length > 0 && (
        <div className={cn(
          "absolute top-[105%] left-0 w-full z-[100] bg-[var(--card-bg)] border border-slate-500/20 shadow-2xl overflow-hidden",
          size === "lg" ? "rounded-xl" : "rounded-md animate-in fade-in slide-in-from-top-2 duration-200"
        )}>
          {filteredList.map((item, index) => {
            const ItemIcon = iconKey ? (item[iconKey] as LucideIcon) : null;
            return (
              <div
                key={index}
                onClick={() => handlePick(item)}
                onMouseEnter={() => setActiveIndex(index)}
                className={cn(
                  "px-4 py-3 text-sm cursor-pointer transition-all flex justify-between items-center",
                  activeIndex === index ? "bg-primary/10 text-foreground translate-x-1" : "text-muted item-hover"
                )}
              >
                <div className="flex items-center gap-3">
                  {ItemIcon && <ItemIcon size={14} className={activeIndex === index ? "text-primary" : "text-slate-500"} />}
                  <span className="truncate">{highlightMatch(String(item[suggestionKey]), inputValue)}</span>
                </div>
                {activeIndex === index && (
                  <span className="text-[9px] font-black uppercase tracking-tighter text-primary animate-pulse">
                    Tap Enter
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};