"use client";

import React, {
  JSX,
  useEffect,
  useRef,
  useState
} from "react";
import {
  CalendarDays,
  AlertCircle,
  CheckCircle2,
  Calendar
} from "lucide-react";

import { cn } from "@/lib/utils/helper";
import { 
  DateMode, 
  createDate, 
  validateDateValue, 
  MonthPicker, 
  YearPicker, 
  formatDisplay,  
  Calendar as DateCalendar 
} from "@/lib/date-engine";

/**
 * Props definition for the EduModernDateInputV3 component.
 */
interface EduModernDateInputProps {
  /** The currently selected date value string */
  value?: string;
  /** Callback function triggered when the date value changes */
  onChange: (value: string) => void;
  /** Selection mode of the date picker ('date' | 'month' | 'year') */
  mode?: DateMode;
  /** Placeholder text shown when no date is selected */
  placeholder?: string;
  /** Minimum allowable date string */
  min?: string;
  /** Maximum allowable date string */
  max?: string;
  /** External error message string */
  error?: string;
  /** Indicates whether input selection is mandatory */
  required?: boolean;
  /** Disables interaction with the component when true */
  disabled?: boolean;
  /** Shows success indicator when input is valid and populated */
  showSuccess?: boolean;
  /** Custom CSS class names applied to the root container */
  className?: string;
}

/**
 * `EduModernDateInputV3` is a modern date selection input component.
 * Supports date, month, and year picker views with built-in validation
 * and clean underline animations.
 *
 * @param {EduModernDateInputProps} props - Properties configuring the component.
 * @returns {JSX.Element} The rendered date input component.
 */
export function EduModernDateInputV3({
  value = "",
  onChange,
  mode = "date",
  placeholder = "Select date",
  min,
  max,
  error,
  required,
  disabled,
  showSuccess,
  className
}: EduModernDateInputProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  const currentDate = createDate(value);
  const [viewDate, setViewDate] = useState(currentDate);
  const [yearView, setYearView] = useState(currentDate.getFullYear());

  const validation = validateDateValue(value, mode, min, max);
  const finalError = error || validation;

  /**
   * Effect: Handles clicks outside of the container element to close the picker overlay.
   */
  useEffect(() => {
    function outside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", outside);
    return () => {
      document.removeEventListener("mousedown", outside);
    };
  }, []);

  /**
   * Triggers external onChange handler and closes the picker.
   *
   * @param {string} val - The new date string value.
   */
  function changeValue(val: string) {
    onChange(val);
    setOpen(false);
  }

  /**
   * Handles date selection in 'date' mode.
   *
   * @param {string} val - Selected date string.
   */
  function handleDate(val: string) {
    changeValue(val);
    const d = createDate(val);
    setViewDate(d);
  }

  /**
   * Handles month selection in 'month' mode.
   *
   * @param {string} val - Selected month string.
   */
  function handleMonth(val: string) {
    changeValue(val);
    setViewDate(createDate(val));
  }

  /**
   * Handles year selection in 'year' mode.
   *
   * @param {string} val - Selected year string.
   */
  function handleYear(val: string) {
    changeValue(val);
    setYearView(Number(val));
  }

  /**
   * Renders the corresponding picker overlay based on the current mode.
   *
   * @returns {JSX.Element | null} The active picker component or null if closed.
   */
  function renderPicker() {
    if (!open) return null;

    if (mode === "date") {
      return (
        <DateCalendar
          value={value}
          viewDate={viewDate}
          onChange={handleDate}
          onNavigate={setViewDate}
          min={min}
          max={max}
          disabled={disabled}
        />
      );
    }

    if (mode === "month") {
      return (
        <MonthPicker
          value={value}
          viewYear={viewDate.getFullYear()}
          onChange={handleMonth}
          onYearChange={(year) => {
            setViewDate(new Date(year, viewDate.getMonth(), 1));
          }}
          min={min}
          max={max}
          disabled={disabled}
        />
      );
    }

    return (
      <YearPicker
        value={value}
        viewYear={yearView}
        onChange={handleYear}
        onNavigate={setYearView}
        min={min}
        max={max}
        disabled={disabled}
      />
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative",
        "flex flex-col",
        "w-full",
        disabled && "opacity-60",
        className
      )}
    >
      {/* Input Trigger Field */}
      <div
        onClick={() => {
          if (!disabled) setOpen(!open);
        }}
        onFocus={() => setFocused(true)}
        className={cn(
          "group",
          "flex",
          "items-center",
          "rounded-sm",
          "bg-white",
          "px-2",
          "cursor-pointer"
        )}
      >
        <CalendarDays size={18} className="mr-2 text-primary-400" />

        <div
          className={cn(
            "flex-1",
            "py-2",
            "text-sm",
            value ? "text-white" : "text-muted-500"
          )}
        >
          {value ? formatDisplay(value, mode) : placeholder}
        </div>

        {showSuccess && value && !finalError && (
          <CheckCircle2 size={17} className="text-green-500" />
        )}
      </div>

      {/* Underline Animation */}
      <div className="relative h-[2px] overflow-hidden">
        <div className="absolute inset-0 bg-muted-700" />
        <div
          className={cn(
            "absolute",
            "inset-y-0",
            "left-1/2",
            "-translate-x-1/2",
            "bg-primary-500",
            "transition-all",
            "duration-300",
            open || focused ? "w-full" : "w-0 group-hover:w-full"
          )}
        />
      </div>

      {/* Picker Popover Overlay */}
      <div className="absolute top-full left-0 mt-2 z-50">
        {renderPicker()}
      </div>

      {/* Error Message Display */}
      <div className="h-4 mt-1 overflow-hidden">
        {finalError && (
          <div className="flex items-center gap-1 text-red-500 text-[10px]">
            <AlertCircle size={11} />
            {finalError}
          </div>
        )}
      </div>
    </div>
  );
}