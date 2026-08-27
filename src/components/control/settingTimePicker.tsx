'use client'

import * as React from "react";
import { cn } from "@/lib/utils";

interface SettingTimeInputProps {
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    className?: string;
    disabled?: boolean;
}

export function SettingTimeInput({
    value,
    onChange,
    onBlur,
    className,
    disabled,
}: SettingTimeInputProps) {
    return (
        <input
            type="time"
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            className={cn(
                "py-1 w-[100px] rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900",
                "outline-none transition-all duration-200 shadow-sm focus:shadow-md",
                "hover:border-gray-400",
                "focus:border-gray-500 focus:ring-2 focus:ring-gray-200",
                "disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
        />
    );
}