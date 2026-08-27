// 🟢 lib/errors.ts
import { ApiResponse, ResponseAction } from "./api-respone";

export class ApiError extends Error {
  public status: "success" | "error" | "warning";
  public action: ResponseAction;
  public data: unknown;
  public errorCode?: string;
  public errors?: unknown;
  public timestamp: string;

  constructor(apiResponse: ApiResponse) {
    super(apiResponse.message || "An unexpected error occurred");

    this.name = "ApiError";
    this.status = apiResponse.status || "error";
    this.action = apiResponse.action || "NONE";
    this.data = apiResponse.data ?? null;
    this.errorCode = apiResponse.errorCode;
    this.errors = apiResponse.errors ?? null;
    // Fallback muhimu — bila hii, ApiError iliyojengwa kutoka payload
    // isiyo kamili (mfano caught object ya nje) ingekuwa na
    // `timestamp: undefined` licha ya type kusema ni `string` daima.
    this.timestamp = apiResponse.timestamp || new Date().toISOString();

    Object.setPrototypeOf(this, ApiError.prototype);

    // V8-only (Chrome/Node) — inaondoa frame ya constructor kwenye stack
    // trace, hivyo stack inaanzia mahali `new ApiError(...)` iliitwa,
    // si ndani ya constructor yenyewe. No-op salama kwenye engines nyingine.
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

/**
 * Type guard ya kutumia ndani ya `catch` — TypeScript haiwezi kutypa
 * `catch (error)` kiotomatiki (ni `unknown` daima kwa spec ya lugha),
 * lakini hii inakupa narrowing salama kwa mstari mmoja:
 *
 * ```ts
 * try {
 *   await apiMutation("post", "/students", payload);
 * } catch (error) {
 *   if (isApiError(error)) {
 *     // TS inajua sasa: error ni ApiError, si unknown/any
 *     toast.error(error.message);
 *     if (error.errorCode === "DUPLICATE") focusField("name");
 *   }
 * }
 * ```
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}