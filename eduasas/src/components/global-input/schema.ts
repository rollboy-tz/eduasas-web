export type Rule =
  | { type: "required"; message?: string }
  | { type: "min"; value: number; message?: string }
  | { type: "max"; value: number; message?: string }
  | { type: "email"; message?: string }
  | { type: "match"; field: string; message?: string };

export type Schema = {
  [key: string]: Rule[];
};

export function validateField(
  name: string,
  value: string,
  schema: Schema,
  form: Record<string, string>
): string | null {
  const rules = schema[name];
  if (!rules) return null;

  for (const rule of rules) {
    switch (rule.type) {
      case "required":
        if (!value) return rule.message || "Required";
        break;

      case "min":
        if (value.length < rule.value)
          return rule.message || `Min ${rule.value}`;
        break;

      case "max":
        if (value.length > rule.value)
          return rule.message || `Max ${rule.value}`;
        break;

      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return rule.message || "Invalid email";
        break;

      case "match":
        if (value !== form[rule.field])
          return rule.message || "Does not match";
        break;
    }
  }

  return null;
}