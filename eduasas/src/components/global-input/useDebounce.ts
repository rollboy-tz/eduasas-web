"use client";

import { useEffect, useState } from "react";

/**
 * DEBOUNCE ENGINE
 *
 * Prevents excessive validation/API calls
 *
 * USE CASE:
 * - email existence check
 * - username check
 * - search input optimization
 */
export function useDebounce(value: string, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}