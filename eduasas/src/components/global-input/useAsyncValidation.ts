"use client";

import { useState, useEffect } from "react";

/**
 * ASYNC FIELD VALIDATION ENGINE
 *
 * Example:
 * - check if email exists in DB
 * - check username availability
 *
 * Returns:
 * - loading state
 * - error message
 */
export function useAsyncValidation(
  value: string,
  validator?: (value: string) => Promise<string | null>
) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!validator || !value) return;

    let active = true;

    const run = async () => {
      setLoading(true);

      const res = await validator(value);

      if (active) setError(res);

      setLoading(false);
    };

    run();

    return () => {
      active = false;
    };
  }, [value, validator]);

  return { error, loading };
}