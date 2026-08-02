"use client";

import { cn } from "@/lib/utils/helper";

/**
 * Props zinazohitajika na component ya `SidebarBadge`.
 */
export interface SidebarBadgeProps {
  /** Thamani ya kuonyeshwa ndani ya badge (mfano: namba au maandishi mafupi kama "NEW") */
  value: number | string;

  /** Aina ya rangi itakayotumika kwenye badge */
  color?: "primary" | "success" | "warning" | "danger" | "muted";

  /** CSS classes za ziada za Tailwind (optional) */
  className?: string;
}

/**
 * Ramani ya rangi (Color Mapping) inayofafanua muonekano wa badge kulingana na aina ya rangi iliyochaguliwa.
 * Inasaidia pia `dark mode`.
 */
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

/**
 * Component ndogo inayotumika kuonyesha idadi ya taarifa (badge/notification count)
 * au lebo fupi pembeni ya kipengele cha menyu kwenye sidebar.
 */
export function SidebarBadge({
  value,
  color = "muted",
  className,
}: SidebarBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[10px] font-semibold leading-none select-none transition-colors",
        colors[color],
        className
      )}
    >
      {value}
    </span>
  );
}