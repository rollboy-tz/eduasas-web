"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/helper";
import {
  WEEK_DAYS_SHORT,
  MONTHS_FULL,
  getCalendarGrid,
  pad,
  toComparable,
  isSameDay,
  DateInputMessages,
} from "./date-utils";

interface CalendarProps {
  value: Date | null;
  viewDate: Date;
  onChange: (date: Date) => void;
  onNavigate: (date: Date) => void;
  min?: Date | null;
  max?: Date | null;
  disabled?: boolean;
  messages: DateInputMessages;
}

export function Calendar({
  value,
  viewDate,
  onChange,
  onNavigate,
  min,
  max,
  disabled,
  messages,
}: CalendarProps) {
  const { year, month, total, start } = getCalendarGrid(viewDate);
  const today = new Date();

  function isDisabledDay(day: number) {
    const cmp = `${year}-${pad(month + 1)}-${pad(day)}`;
    if (min && cmp < toComparable(min)) return true;
    if (max && cmp > toComparable(max)) return true;
    return false;
  }

  function selectDay(day: number) {
    if (disabled || isDisabledDay(day)) return;
    onChange(new Date(year, month, day));
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onNavigate(new Date(year, month - 1, 1))}
          aria-label="Previous month"
          className="h-8 w-8 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition disabled:opacity-40 disabled:pointer-events-none"
        >
          <ChevronLeft size={17} />
        </button>

        <div className="text-sm font-semibold text-gray-900" aria-live="polite">
          {MONTHS_FULL[month]} {year}
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={() => onNavigate(new Date(year, month + 1, 1))}
          aria-label="Next month"
          className="h-8 w-8 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition disabled:opacity-40 disabled:pointer-events-none"
        >
          <ChevronRight size={17} />
        </button>
      </div>

      {/* Grid */}
      <div role="grid" aria-label={`${MONTHS_FULL[month]} ${year}`}>
        <div className="grid grid-cols-7 mb-1" role="row">
          {WEEK_DAYS_SHORT.map((day) => (
            <div
              key={day}
              role="columnheader"
              className="text-center text-[11px] font-medium text-gray-400 py-1"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 grid-rows-6 gap-1" role="rowgroup">
          {/* Leading spacers - kuweka siku ya kwanza mahali pake sahihi wiki-ni.
              aspect-square ni muhimu: bila hiyo, safu inayojumuisha spacers pekee
              ingeporomoka (0 height) na kubadilisha ukubwa wa calendar kati ya mwezi na mwezi. */}
          {Array.from({ length: start }).map((_, i) => (
            <div key={`lead-${i}`} aria-hidden="true" className="aspect-square" />
          ))}

          {Array.from({ length: total }).map((_, i) => {
            const day = i + 1;
            const cellDate = new Date(year, month, day);
            const isSelected = isSameDay(value, cellDate);
            const isToday = isSameDay(today, cellDate);
            const isDisabled = Boolean(disabled) || isDisabledDay(day);

            return (
              <div key={day} role="gridcell" className="flex items-center justify-center aspect-square">
                <button
                  type="button"
                  disabled={isDisabled}
                  aria-selected={isSelected}
                  aria-current={isToday ? "date" : undefined}
                  aria-label={cellDate.toDateString()}
                  onClick={() => selectDay(day)}
                  className={cn(
                    // w-full + max-w - kitufe kinafuata upana wa column (responsive),
                    // hakizidi 36px kwenye skrini kubwa - hakiwahi kusababisha overflow-x
                    "w-full max-w-[36px] aspect-square rounded-md text-xs font-medium transition-colors",
                    "text-gray-700 hover:bg-gray-100",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1",
                    isToday && !isSelected && "text-blue-600 font-semibold",
                    isSelected && "bg-blue-600 text-white hover:bg-blue-600",
                    isDisabled && "opacity-30 cursor-not-allowed hover:bg-transparent"
                  )}
                >
                  {day}
                </button>
              </div>
            );
          })}

          {/* Trailing spacers - daima jumla ya seli ni 42 (safu 6) ili calendar isibadilike
              ukubwa kati ya mwezi na mwezi (baadhi ya miezi ina wiki 4, mingine 6) */}
          {Array.from({ length: Math.max(0, 42 - start - total) }).map((_, i) => (
            <div key={`trail-${i}`} aria-hidden="true" className="aspect-square" />
          ))}
        </div>
      </div>

      {/* Today shortcut */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          onNavigate(new Date(today.getFullYear(), today.getMonth(), 1));
          onChange(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
        }}
        className="mt-3 w-full rounded-md bg-gray-50 py-1.5 text-xs font-medium text-blue-600 hover:bg-gray-100 transition disabled:opacity-40 disabled:pointer-events-none"
      >
        {messages.today}
      </button>
    </div>
  );
}