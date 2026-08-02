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
  X,
  LucideIcon
} from "lucide-react";
import {
  AnimatePresence,
  motion
} from "framer-motion";

import { cn } from "@/lib/utils/helper";
import {
  DateUtils,
  DateDisplayFormat
} from "@/lib/utils/time-utils";
import {
  DateMode,
  createDate,
  validateDateValue,
  MonthPicker,
  YearPicker,
  Calendar as DateCalendar
} from "@/lib/date-engine";

/**
 * Props definition for the EduModernDateInputV4 component.
 */
interface EduModernDateInputV4Props {
  /** The currently selected date value string */
  value?: string;
  /** Callback function triggered when the date value changes */
  onChange: (value: string) => void;
  /** Selection mode of the date picker ('date' | 'month' | 'year') */
  mode?: DateMode;
  /** Format pattern to display the formatted date */
  displayFormat?: DateDisplayFormat;
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
  /** Custom success message displayed below the input */
  successMessage?: string;
  /** Enables a quick-clear button to reset selection */
  clearable?: boolean;
  /** Optional custom icon component to override the default calendar icon */
  icon?: LucideIcon;
  /** Custom CSS class names applied to the root container */
  className?: string;
  /** Component size variant */
  size?: "sm" | "md" | "lg";
}

/**
 * `EduModernDateInputV4` is a feature-rich, animated date selection input component.
 * Supports date, month, and year picker views, custom formatting, validation,
 * clear actions, and status message indicators.
 *
 * @param {EduModernDateInputV4Props} props - Properties configuring the component.
 * @returns {JSX.Element} The rendered date picker component.
 */
export function EduModernDateInputV4({
  value = "",
  onChange,
  mode = "date",
  displayFormat = "DD MMM YYYY",
  placeholder = "Select date",
  min,
  max,
  error,
  required,
  disabled,
  showSuccess,
  successMessage,
  clearable = true,
  icon: Icon,
  className,
  size = "md"
}: EduModernDateInputV4Props): JSX.Element {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  const date = createDate(value);
  const [viewDate, setViewDate] = useState(date);
  const [yearView, setYearView] = useState(date.getFullYear());

  const validation = validateDateValue(value, mode, min, max);
  const finalError = error || validation;

  const displayValue = value
    ? mode === "year"
      ? value
      : DateUtils.formatInputDate(value, displayFormat)
    : "";

  /**
   * Effect: Handles clicks outside of the wrapper container to close the picker overlay.
   */
  useEffect(() => {
    function handleOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, []);

  /**
   * Effect: Closes the picker overlay when the user presses the 'Escape' key.
   */
  useEffect(() => {
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("keydown", escape);
    };
  }, []);

  /**
   * Triggers the external `onChange` callback with the updated value string.
   *
   * @param {string} newValue - The new date string value.
   */
  function updateValue(newValue: string) {
    onChange(newValue);
  }

  /**
   * Handles selection in 'date' mode.
   *
   * @param {string} val - Selected date string.
   */
  function handleDate(val: string) {
    updateValue(val);
    setViewDate(createDate(val));
    setOpen(false);
  }

  /**
   * Handles selection in 'month' mode.
   *
   * @param {string} val - Selected month string.
   */
  function handleMonth(val: string) {
    updateValue(val);
    setViewDate(createDate(val));
    setOpen(false);
  }

  /**
   * Handles selection in 'year' mode.
   *
   * @param {string} val - Selected year string.
   */
  function handleYear(val: string) {
    updateValue(val);
    setYearView(Number(val));
    setOpen(false);
  }

  /**
   * Clears current value and prevents event propagation.
   *
   * @param {React.MouseEvent} e - Mouse event from clear button click.
   */
  function clearValue(e: React.MouseEvent) {
    e.stopPropagation();
    onChange("");
  }

  /**
   * Renders appropriate picker element based on current `mode` state.
   *
   * @returns {JSX.Element | null} The corresponding picker component or null if closed.
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
      ref={wrapperRef}
      className={cn(
        "relative flex flex-col w-full",
        disabled && "opacity-60 cursor-not-allowed",
        className
      )}
    >
      <div className="w-full rounded-sm flex-col overflow-hidden">
        {/* Input Display Box */}
        <div
          tabIndex={0}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onClick={() => {
            if (!disabled) setOpen((prev) => !prev);
          }}
          className={cn(
            "group",
            "flex items-center",
            "bg-white",
            "cursor-pointer",
            "transition-all",
            size === "sm" && "px-2 py-1.5 text-xs",
            size === "md" && "px-2 py-2 text-sm",
            size === "lg" && "px-3 py-3 text-base"
          )}
        >
          {Icon ? (
            <Icon size={18} className="mr-2 text-primary-400" />
          ) : (
            <CalendarDays size={18} className="mr-2 text-primary-400" />
          )}

          <div
            className={cn(
              "flex-1 truncate",
              displayValue ? "" : "text-muted-500"
            )}
          >
            {displayValue || placeholder}
          </div>

          {clearable && value && (
            <button
              type="button"
              onClick={clearValue}
              className="mr-2 text-muted-400 hover:text-white"
            >
              <X size={15} />
            </button>
          )}

          {showSuccess && value && !finalError && (
            <CheckCircle2 size={17} className="text-green-500" />
          )}
        </div>

        {/* Animated Underline Indicator */}
        <div className="relative h-[2px] overflow-hidden">
          <div className="absolute inset-0 bg-muted-700" />
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: open || focused ? "100%" : "0%"
            }}
            transition={{ duration: 0.3 }}
            className="absolute left-1/2 -translate-x-1/2 h-full bg-primary-500"
          />
        </div>
      </div>

      {/* Popover Animated Picker Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 z-[999]"
          >
            {renderPicker()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Message Display Container */}
      <div className="h-5 mt-1 overflow-hidden">
        {finalError && (
          <div className="flex items-center gap-1 text-red-500 text-[10px]">
            <AlertCircle size={11} />
            <span>{finalError}</span>
          </div>
        )}

        {successMessage && !finalError && (
          <div className="flex items-center gap-1 text-green-500 text-[10px]">
            <CheckCircle2 size={11} />
            <span>{successMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}