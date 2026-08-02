"use client";

import { cn } from "@/lib/utils/helper";

export interface SidebarBadgeProps {
  value: number | string;

  color?:
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "muted";

  className?: string;
}

const colors = {
  primary:
    "bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300",

  success:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",

  warning:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",

  danger:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",

  muted:
    "bg-muted-200 text-muted-700 dark:bg-muted-800 dark:text-muted-300",
};

export function SidebarBadge({
  value,
  color = "muted",
  className,
}: SidebarBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex",
        "items-center",
        "justify-center",
        "min-w-5",
        "h-5",
        "px-1.5",
        "rounded-full",
        "text-[10px]",
        "font-semibold",
        "leading-none",
        "select-none",
        "transition-colors",
        colors[color],
        className
      )}
    >
      {value}
    </span>
  );
}