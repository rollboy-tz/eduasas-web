import { Text } from "./text";
import { transformers } from "./transform";
import type { StringValue } from "./types";

/**
 * Creates a fluent Text instance.
 *
 * @example
 * text("john doe")
 *   .titleCase()
 *   .toString();
 */
export function text(value: StringValue): Text {
  return new Text(value);
}

/**
 * Direct helper methods.
 *
 * Example:
 *
 * text.titleCase(value)
 */
Object.assign(text, transformers);

export default text;