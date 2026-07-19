"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils/helper";
import { ChevronDown, LucideIcon, Check } from "lucide-react";

interface EduSelectProps<T> {
  label?: string;
  options: T[];
  labelKey: keyof T;
  valueKey: keyof T;
  iconKey?: keyof T;
  value?: any;
  placeholder?: string;
  onChange?: (item: T | T[]) => void; // Support single au array
  onSelect?: (item: T) => void; // Prop mpya kama ulivyoomba
  error?: string;
  containerClassName?: string;
  className?: string;
  variant?: "neon" | "flat";
  size?: "sm" | "md" | "lg";
  labelStrategy?: "floating" | "fixed" | "none";
  labelClassName?: string;
  isDisabled?: boolean;
  multiple?: boolean; // Prop kwa ajili ya multiple select
  sortBy?: keyof T;
  sortOrder?: "asc" | "desc";
  sortType?: "string" | "number" | "date";
}

export const EduSelect = <T extends Record<string, any>>({
  label,
  options,
  labelKey,
  valueKey,
  iconKey,
  value,
  placeholder,
  onChange,
  onSelect,
  error,
  containerClassName,
  className,
  variant = "flat",
  size = "lg",
  labelStrategy = "floating",
  labelClassName,
  isDisabled = false,
  multiple = false,
  sortBy,
  sortOrder = "asc",
  sortType = "string",
}: EduSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sortedOptions = useMemo(() => {
    if (!sortBy) return options;
    return [...options].sort((a, b) => {
      let valA: any = a[sortBy];
      let valB: any = b[sortBy];
      if (sortType === "date") {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [options, sortBy, sortOrder, sortType]);

  const [selected, setSelected] = useState<T | null>(null);
  const [selectedList, setSelectedList] = useState<T[]>([]);

  const isSelected = (item: T) => {
    if (multiple) {
      return selectedList.some((s) => s[valueKey] === item[valueKey]);
    }
    return selected?.[valueKey] === item[valueKey];
  };

  const handleSelect = (item: T) => {
    if (isDisabled) return;

    if (multiple) {
      const alreadySelected = selectedList.some((s) => s[valueKey] === item[valueKey]);
      let newList;
      if (alreadySelected) {
        newList = selectedList.filter((s) => s[valueKey] !== item[valueKey]);
      } else {
        newList = [...selectedList, item];
      }
      setSelectedList(newList);
      if (onChange) onChange(newList);
    } else {
      setSelected(item);
      setIsOpen(false);
      if (onChange) onChange(item);
    }

    if (onSelect) onSelect(item);
  };

// Default value applying
  useEffect(() => {
    if (value !== undefined && value !== null) {
      const found = options.find((opt) => opt[valueKey] === value);
      if (found) {
        setSelected(found);
      }
    }
  }, [value, options, valueKey]);

  // Click Outside logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayValue = useMemo(() => {
    if (multiple) {
      if (selectedList.length === 0) return placeholder || "Select...";
      return `${selectedList.length} Selected`;
    }
    return selected ? String(selected[labelKey]) : (placeholder || "Select...");
  }, [selected, selectedList, multiple, placeholder, labelKey]);

  const isInputActive = isOpen || (multiple ? selectedList.length > 0 : selected);

  return (
    <div className={cn("relative w-full mb-2 group bg-inherit", isDisabled && "opacity-50", containerClassName)} ref={dropdownRef}>
      {labelStrategy === "fixed" && label && (
        <span className={cn("block mb-1.5 text-[11px] font-bold tracking-wider text-muted uppercase", labelClassName)}>
          {label}
        </span>
      )}

      <div 
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        className={cn(
          "relative flex items-center w-full cursor-pointer transition-all duration-200 z-50",
          size === "sm" ? "h-9 text-xs px-2.5" : size === "md" ? "h-11 text-sm px-3" : "h-14 text-[15px] px-4",
          size === "lg" ? "rounded-lg" : size === "md" ? "rounded-md" : "rounded-sm",
          error ? "border-red-500 border-2" : isInputActive ? (variant === "neon" ? "border-primary border-2" : "border-slate-400 border-2") : "border-slate-500/30 border-[1.5px]",
          "bg-inherit",
          className
        )}
      >
        <span className={cn("truncate flex-1 font-medium", !selected && selectedList.length === 0 ? "text-muted/60 italic" : "text-foreground")}>
          {displayValue}
        </span>

        <ChevronDown className={cn("ml-2 shrink-0 transition-transform duration-300", isOpen && "rotate-180 text-primary")} size={18} />

        {labelStrategy === "floating" && label && (
          <label className={cn(
            "absolute px-1.5 pointer-events-none transition-all duration-200 z-[60] bg-inherit left-4",
            isInputActive 
              ? "-top-2.5 text-[11px] font-bold tracking-widest text-primary"
              : "top-1/2 -translate-y-1/2 text-[14px] text-muted",
            labelClassName
          )}>
            {error || label}
          </label>
        )}
      </div>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className={cn(
          "absolute top-[105%] left-0 w-full z-[100] max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2",
          "border border-slate-500/20 bg-card/25 backdrop-blur-xl shadow-2xl overflow-x-hidden",
          size === "lg" ? "rounded-lg" : size === "md" ? "rounded-md" : "rounded-sm",
        )}>
          {sortedOptions.map((item, index) => {
            const active = isSelected(item);
            return (
              <div
                key={index}
                onClick={(e) => {
                  if (multiple) e.stopPropagation(); // Zuia dropdown kufunga kwenye multi
                  handleSelect(item);
                }}
                className={cn(
                  "flex items-center justify-between px-4 py-3 text-[14px] transition-all cursor-pointer mx-1 my-0.5",
                  "text-foreground/75 item-hover", active && "item-active/10 text-foreground font-bold",
                  size === "lg" ? "rounded-lg" : size === "md" ? "rounded-md" : "rounded-sm",
                )}
              >
                <div className="flex items-center gap-3 truncate">
                  {iconKey && item[iconKey] && <span>{React.createElement(item[iconKey] as LucideIcon, { size: 16 })}</span>}
                  <span className="truncate">{String(item[labelKey])}</span>
                </div>
                
                {/* CHECKMARK YA KISHUA */}
                {active && (
                  <div className="shrink-0 rounded-full p-1 bg-foreground/10 animate-in zoom-in duration-200">
                    <Check size={16} className="text-foreground/80 shadow-glow" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};