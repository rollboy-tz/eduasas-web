import React, { JSX, useMemo, useState } from "react";
import {
  CalendarDays,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils/helper";



const normalizeDateValue = (date: string) => {
  if (!date) return "";

  return date.includes("T")
    ? date.split("T")[0]
    : date;
};

/**
 * Props definition for the EduModernDateInput component.
 */
interface DateInputProps {
  /** The currently selected date value string (YYYY-MM-DD format) */
  value: string;
  /** Callback function triggered when the date value changes */
  onChange: (value: string) => void;
  /** Placeholder text shown when no date is selected */
  placeholder?: string;
  /** Minimum allowable date string (YYYY-MM-DD) */
  min?: string;
  /** Maximum allowable date string (YYYY-MM-DD) */
  max?: string;
  /** Indicates whether input selection is mandatory */
  required?: boolean;
  /** Disables interaction with the component when true */
  disabled?: boolean;
  /** External custom error message string */
  error?: string;
  /** Shows success indicator icon when input is valid and populated */
  showSuccess?: boolean;
  /** Custom CSS class names applied to the input container */
  className?: string;
}

/**
 * Validates a date string against format correctness, calendar existence, and min/max constraints.
 *
 * @param {string} value - Date string to validate.
 * @param {string} [min] - Minimum allowable date string.
 * @param {string} [max] - Maximum allowable date string.
 * @returns {string} Validation error message or empty string if valid.
 */
function validateDate(
  value: string,
  min?: string,
  max?: string
): string {
  if (!value) return "Date is required";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Invalid date";

  const dateOnly = normalizeDateValue(value);

  const [y, m, d] = dateOnly.split("-").map(Number);
  const check = new Date(y, m - 1, d);

  if (
    check.getFullYear() !== y ||
    check.getMonth() + 1 !== m ||
    check.getDate() !== d
  ) {
    return "Date does not exist";
  }

  if (min && dateOnly < min) return `Date must be after ${min}`;
  if (max && dateOnly > max) return `Date must be before ${max}`;

  return "";
}

/**
 * `EduModernDateInput` is a native HTML date input wrapper featuring 
 * auto-validation, custom styling, focus state animations, and status indicators.
 *
 * @param {DateInputProps} props - Properties configuring the component.
 * @returns {JSX.Element} The rendered date input component.
 */
export const EduModernDateInput = ({
  value,
  onChange,
  placeholder = "Select date",
  min,
  max,
  disabled,
  error,
  showSuccess,
  className
}: DateInputProps): JSX.Element => {
  const [focused, setFocused] = useState(false);

  /**
   * Internal memoized validation error calculation.
   */
  const internalError = useMemo(() => {
    if (!value) return "";

    return validateDate(value, min, max);
  }, [value, min, max]);

  const finalError = error || internalError;

  return (
    <div
      className={cn(
        "flex flex-col w-full",
        disabled && "opacity-60"
      )}
    >
      {/* Main Input Container */}
      <div
        className={cn(
          "group flex items-center",
          "rounded-sm",
          "bg-muted-900",
          "px-2",
          focused && "bg-muted-800",
          className
        )}
      >
        <CalendarDays size={18} className="mr-2 text-primary-400" />

        <input
          type="date"
          value={normalizeDateValue(value)}
          disabled={disabled}
          min={min}
          max={max}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => {
            const date = e.target.value;

            if (!date) {
              onChange("");
              return;
            }

            onChange(`${date}T00:00:00Z`);
          }}
          className="flex-1 bg-transparent py-2 text-sm text-white outline-none scheme-dark"
        />

        {showSuccess && !finalError && value && (
          <CheckCircle2 size={17} className="text-green-500" />
        )}
      </div>

      {/* Animated Underline Indicator */}
      <div className="relative h-[2px]">
        <div className="absolute inset-0 bg-muted-700" />
        <div
          className={cn(
            "absolute inset-y-0",
            "left-1/2",
            "-translate-x-1/2",
            "bg-primary-500",
            "transition-all",
            "duration-300",
            focused ? "w-full" : "w-0 group-hover:w-full"
          )}
        />
      </div>

      {/* Validation Message Display Container */}
      <div className="h-4 mt-1">
        {finalError && (
          <div className="flex items-center gap-1 text-red-500 text-[10px]">
            <AlertCircle size={11} />
            {finalError}
          </div>
        )}
      </div>
    </div>
  );
};