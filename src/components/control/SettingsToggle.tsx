"use client";

import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: {
    track: "h-5 w-9",
    thumb: "h-4 w-4",
    on: "translate-x-4",
    off: "translate-x-0.5",
  },
  md: {
    track: "h-6 w-11",
    thumb: "h-5 w-5",
    on: "translate-x-5",
    off: "translate-x-0.5",
  },
  lg: {
    track: "h-7 w-14",
    thumb: "h-6 w-6",
    on: "translate-x-7",
    off: "translate-x-0.5",
  },
};

export const SettingToggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  size = "md",
}) => {
  const s = sizes[size];

  const toggle = () => {
    if (!disabled) onChange(!checked);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={toggle}
      onKeyDown={(e) => {
        if (disabled) return;

        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          toggle();
        }
      }}
      className={`
        group
        relative
        inline-flex
        shrink-0
        items-center
        rounded-full
        ${s.track}

        transition-all
        duration-300
        ease-[cubic-bezier(.22,1,.36,1)]

        ${checked
          ? "bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,.35)]"
          : "bg-gray-300 dark:bg-gray-700"
        }

        ${disabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:brightness-105 active:scale-[0.98]"
        }

        focus:outline-none
        focus-visible:ring-4
        focus-visible:ring-emerald-500/20
      `}
    >
      <span
        className={`
          ${s.thumb}

          rounded-full

          bg-gradient-to-b
          from-white
          to-gray-100

          shadow-md
          ring-1
          ring-black/5

          transition-all
          duration-300
          ease-[cubic-bezier(.22,1,.36,1)]

          group-active:scale-95

          ${checked ? s.on : s.off}
        `}
      />
    </button>
  );
};