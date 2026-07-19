"use client";

import { useMemo } from "react";

/**
 * EMAIL SUGGESTION ENGINE
 *
 * FEATURES:
 * - Suggests domains when user types without "@"
 * - Supports TAB auto-complete
 * - Mobile tap-to-fill compatible
 *
 * EXAMPLE:
 * input: "john"
 * output: john@gmail.com, john@yahoo.com
 */

const domains = [
  "@gmail.com",
  "@yahoo.com",
  "@outlook.com",
  "@icloud.com",
  "@eduasas.co.tz"
];

export function useEmailSuggestions(value: string) {
  return useMemo(() => {
    if (!value || value.includes("@")) return [];

    return domains.map((d) => value + d);
  }, [value]);
}