"use client";

import React, { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils/helper";
import { Calendar, Clock, CalendarDays, AlertCircle, LucideIcon } from "lucide-react";

interface DateFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "size"> {
  label: string;
  mode?: "full" | "year" | "month-year" | "time";
  icon?: LucideIcon;
  variant?: "neon" | "flat";
  size?: "sm" | "md" | "lg";
  labelStrategy?: "floating" | "fixed";
  isRequired?: boolean;
  minYear?: number;
  maxYear?: number;
  initialValue?: string; // Kwa ajili ya ku-load data iliyopo
  onChange?: (isoValue: string) => void;
}

export const EduDateField = ({
  label,
  mode = "full",
  icon: StaticIcon,
  variant = "flat",
  size = "lg",
  labelStrategy = "floating",
  isRequired,
  minYear,
  maxYear,
  initialValue,
  onChange,
  className,
  placeholder,
  ...props
}: DateFieldProps) => {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showError, setShowError] = useState(false);

  const currentYear = new Date().getFullYear();
  const LIMITS = {
    min: minYear || (currentYear - 10),
    max: maxYear || (currentYear + 10)
  };

  // Inabadilisha "2026-04-17T00:00:00Z" kwenda "17/04/2026"
  const formatISOToDisplay = (iso: string) => {
    if (!iso) return "";
    const date = new Date(iso);
    if (isNaN(date.getTime())) return "";

    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();

    if (mode === "year") return String(y);
    if (mode === "month-year") return `${m}/${y}`;
    return `${d}/${m}/${y}`;
  };

  useEffect(() => {
    if (initialValue) {
      const formatted = formatISOToDisplay(initialValue);
      setValue(formatted);
    }
  }, [initialValue, mode]);

  const settings = useMemo(() => {
    switch (mode) {
      case "year": return { mask: "YYYY", length: 4, placeholder: "2026", icon: Calendar };
      case "month-year": return { mask: "MM/YYYY", length: 7, placeholder: "MM/YYYY", icon: Calendar };
      case "time": return { mask: "HH:mm", length: 5, placeholder: "14:30", icon: Clock };
      default: return { mask: "DD/MM/YYYY", length: 10, placeholder: "DD/MM/YYYY", icon: CalendarDays };
    }
  }, [mode]);

  // --- VALIDATION CORE ---
  const validationMessage = useMemo(() => {
    if (!value) return null;
    if (value.length < settings.length) return `Format: ${settings.mask}`;

    if (mode === "full") {
      const [d, m, y] = value.split("/").map(Number);

      // 1. Basic Month/Day Range
      if (m < 1 || m > 12) return "Invalid Month (1-12)";
      if (d < 1 || d > 31) return "Invalid Day (1-31)";

      // 2. Strict Date Check (e.g., prevents 31/06)
      const dateCheck = new Date(y, m - 1, d);
      if (dateCheck.getFullYear() !== y || dateCheck.getMonth() !== m - 1 || dateCheck.getDate() !== d) {
        return "This date does not exist";
      }

      // 3. Year Range
      if (y < LIMITS.min || y > LIMITS.max) return `Year: ${LIMITS.min}-${LIMITS.max}`;
    }

    if (mode === "year") {
      const y = parseInt(value);
      if (y < LIMITS.min || y > LIMITS.max) return `Year: ${LIMITS.min}-${LIMITS.max}`;
    }

    return null;
  }, [value, mode, LIMITS, settings]);

  // --- SMART MASKING (Fixes the double slash issue) ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Ondoa kila kitu ambacho si namba
    const raw = e.target.value.replace(/\D/g, "");
    let formatted = "";

    if (mode === "full") {
      if (raw.length > 0) {
        formatted += raw.slice(0, 2);
        if (raw.length > 2) {
          formatted += "/" + raw.slice(2, 4);
          if (raw.length > 4) {
            formatted += "/" + raw.slice(4, 8);
          }
        }
      }
    } else if (mode === "month-year") {
      if (raw.length > 0) {
        formatted += raw.slice(0, 2);
        if (raw.length > 2) formatted += "/" + raw.slice(2, 6);
      }
    } else if (mode === "time") {
      if (raw.length > 0) {
        formatted += raw.slice(0, 2);
        if (raw.length > 2) formatted += ":" + raw.slice(2, 4);
      }
    } else {
      formatted = raw.slice(0, 4); // Year only
    }

    if (formatted.length <= settings.length) {
      setValue(formatted);

      // Auto-fire onChange only when valid & complete
      if (formatted.length === settings.length) {
        validateAndEmit(formatted);
      }
    }
  };

  const validateAndEmit = (val: string) => {
    if (mode === "full") {
      const [d, m, y] = val.split("/").map(Number);
      const dateCheck = new Date(y, m - 1, d);
      if (dateCheck.getFullYear() === y && dateCheck.getMonth() === m - 1 && dateCheck.getDate() === d) {
        const iso = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T00:00:00Z`;
        onChange?.(iso);
      }
    } else if (mode === "year" && val.length === 4) {
      onChange?.(`${val}-01-01T00:00:00Z`);
    }
  };

  const onBlurHandler = () => {
    setIsFocused(false);
    if (validationMessage) setShowError(true);
  };

  return (
    <div className={cn("relative w-full group mb-2 bg-inherit text-left", className)}>
      <div className="relative flex items-center bg-inherit">
        {/* ICON CONTAINER */}
        <div className={cn(
          "absolute left-4 z-50 pointer-events-none transition-all duration-300",
          isFocused ? "text-[var(--primary)]" : "text-muted",
          showError && "text-red-500"
        )}>
          {showError ? (
            <AlertCircle size={18} className="text-red-500" />
          ) : (
            /* Hapa tunaiita component ya Icon moja kwa moja */
            <settings.icon size={18} />
          )}
        </div>

        <input
          {...props}
          value={value}
          onChange={handleInputChange}
          onFocus={() => { setIsFocused(true); setShowError(false); }}
          onBlur={onBlurHandler}
          className={cn(
            "peer w-full bg-transparent outline-none transition-all duration-300 z-40 font-medium tracking-widest",
            "border-slate-500/20 border-[1.5px] rounded-xl",
            size === "lg" ? "h-14 pl-12 pr-4 text-[15px]" : "h-11 pl-11 pr-3 text-sm",
            isFocused && !showError && "border-[var(--primary)] border-2 ring-4 ring-[var(--primary)]/5",
            showError && "border-red-500 border-2 bg-red-500/5 animate-shake",
            value && !showError && "border-2 border-[var(--primary)]"
          )}
          placeholder={isFocused ? settings.placeholder : ""}
        />

        {/* LABEL DYNAMICS */}
        <label className={cn(
          "absolute px-2 pointer-events-none transition-all duration-200 z-50 bg-inherit",
          (isFocused || value)
            ? "-top-2.5 left-3 text-[11px] font-bold text-[var(--primary)]"
            : "top-1/2 -translate-y-1/2 left-11 text-muted",
          showError ? "text-red-500" : (isFocused ? "text-[var(--primary)]" : "text-muted")
        )}>
          {showError ? (
            <span className="flex items-center gap-1">
              {validationMessage}
            </span>
          ) : label}
        </label>

        {/* MODE BADGE */}
        {value.length > 0 && !showError && (
          <div className="absolute right-4 text-[9px] font-black opacity-20 uppercase">
            {mode}
          </div>
        )}
      </div>
    </div>
  );
};

const DisplayIcon = ({ icon: Icon, size }: { icon: any, size: number }) => <Icon size={size} />;