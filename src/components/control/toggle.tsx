"use client";

import React from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  size = "md",
}) => {
  // Vipimo kulingana na size unayotaka
  const sizeClasses = {
    sm: {
      track: "w-8 h-4.5 p-0.5",
      thumb: "w-3.5 h-3.5",
      translate: "translate-x-3.5",
    },
    md: {
      track: "w-11 h-6 p-0.5",
      thumb: "w-5 h-5",
      translate: "translate-x-5",
    },
    lg: {
      track: "w-14 h-7.5 p-1",
      thumb: "w-5.5 h-5.5",
      translate: "translate-x-6.5",
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${checked ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-700"}
        ${currentSize.track}
      `}
    >
      {/* Kiring kinachosogea (Thumb) */}
      <span
        className={`
          pointer-events-none inline-block rounded-full bg-white shadow-md transform ring-0 
          transition duration-200 ease-in-out
          ${checked ? currentSize.translate : "translate-x-0"}
          ${currentSize.thumb}
        `}
      />
    </button>
  );
};