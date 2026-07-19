import { useState } from "react";

export function useAsyncValidation(
  value: string,
  validator?: (value: string) => Promise<string | null>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = async () => {
    if (!validator) return;

    setLoading(true);
    const result = await validator(value);
    setError(result);
    setLoading(false);
  };

  return { validate, loading, error };
}