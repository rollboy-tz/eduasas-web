// lib/api.ts
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

import { ClientDevice } from "@/lib/utils/ClientDevice";
//import { toast } from "sonner";
import { ApiError } from "./errors";
import { logoutAndRedirect } from "../helpers/logout-and-redirect";
import { ApiResponse, ResponseAction } from "./api-respone";
import { useSessionValidation, validateSessionApi } from "../helpers";

/* =========================================================
   TYPE AUGMENTATION
   Tunaongeza fields zetu kwenye InternalAxiosRequestConfig
   badala ya kutumia `as any` kila mahali — hii inatupa
   type-safety kamili na autocomplete sahihi.
   ========================================================= */

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _requestId?: string;
    _startTime?: number;
    _retry?: boolean;
    /** Set per-request to suppress the automatic error/warning toast. */
    _noToast?: boolean;
  }
}

/* =========================================================
   CONSTANTS
   ========================================================= */

const API_URL = "/main";
const isDev = process.env.NODE_ENV === "development";

/** Hard ceiling on how long we'll wait for a session refresh before
 *  giving up and forcing logout. Prevents the refresh queue from
 *  deadlocking forever if the validation call hangs. */
const REFRESH_TIMEOUT_MS = 15000;

/* =========================================================
   HELPERS
   ========================================================= */

/**
 * Generates a request id, with a fallback for environments where
 * `crypto.randomUUID` isn't available (older browsers, some edge
 * runtimes).
 */
function generateRequestId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Defensive error-message extraction. Never throws, even if the
 * backend sends a malformed `errors` payload.
 */
const extractErrorMessage = (responseData: any, error?: AxiosError): string => {
  if (responseData?.message && typeof responseData.message === "string") {
    return responseData.message;
  }

  if (responseData?.errors && typeof responseData.errors === "object") {
    const messages = Object.values(responseData.errors)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .filter((value): value is string => typeof value === "string");

    if (messages.length > 0) return messages.join("\n");
  }

  if (error?.code === "ECONNABORTED") return "Request timed out. Please check your internet.";
  if (!error?.response) return "Network error. Please check your connection.";

  return "An unexpected error occurred. Please try again.";
};

/** Wraps any error shape into our canonical ApiError type. */
const createApiError = (err: AxiosError<ApiResponse> | any): ApiError => {
  if (err?.response?.data) return new ApiError(err.response.data);
  return new ApiError({
    success: false,
    status: "error",
    message: extractErrorMessage(err?.response?.data, err),
    action: "NONE",
    data: null,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Guards against open-redirect vulnerabilities: only allows relative
 * paths or same-origin absolute URLs through `window.location.href`.
 * A compromised or buggy backend response should never be able to
 * send a logged-in user to an arbitrary external site.
 */
function isSafeRedirectUrl(url: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    if (url.startsWith("/") && !url.startsWith("//")) return true;
    const parsed = new URL(url, window.location.origin);
    return parsed.origin === window.location.origin;
  } catch {
    return false;
  }
}

/** Races a promise against a timeout so we never hang indefinitely. */
function withTimeout<T>(promise: Promise<T>, ms: number, timeoutMessage: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(timeoutMessage)), ms);
    }),
  ]);
}

/**
 * Hard logout — inaenda bila kusubiri chochote.
 * Toast haitumiwi hapa — redirect itaifuta kabla haijawaka.
 * Caller ndiye anayeamua kuonyesha ujumbe kabla ya kuiita.
 *
 * Guarded to fire at most once: multiple concurrent 401s / logout
 * actions should never trigger overlapping redirects.
 */
let isLoggingOut = false;
const hardLogout = () => {
  if (isLoggingOut) return;
  isLoggingOut = true;
  logoutAndRedirect();
};

/* =========================================================
   ACTIONS ZINAZOHITAJI LOGOUT WA HARAKA
   Zinaangaliwa mahali MOJA — si kwa errorCode wala action tofauti.
   ========================================================= */

// IMMEDIATE_LOGOUT_ACTIONS — session imekufa kabisa, mtumiaji nje SASA HIVI
// KILL_CONTEXT haipo hapa — si logout, ni context clear tu (ona chini)
const IMMEDIATE_LOGOUT_ACTIONS: ResponseAction[] = ["RE_AUTHENTICATE", "LOGOUT"];

// KILL_CONTEXT — futa data ya school, mrudishe portal. Session ipo bado.
const CONTEXT_CLEAR_ACTIONS: ResponseAction[] = ["KILL_CONTEXT"];

/* =========================================================
   AXIOS INSTANCE
   ========================================================= */

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/* =========================================================
   REFRESH QUEUE
   Inashikilia requests zilizoshindwa wakati refresh inaendelea.
   ========================================================= */

interface QueuedRequest {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueuedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

/* =========================================================
   REQUEST INTERCEPTOR
   ========================================================= */

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const requestId = generateRequestId();
    config._requestId = requestId;
    config._startTime = Date.now();

    try {
      const auditHeaders = ClientDevice.getAuditHeaders() || {};

      // Tunatumia `.set()` badala ya kubadilisha `config.headers` yote —
      // kuandika upya object nzima kunaweza kuharibu AxiosHeaders instance
      // na kuvunja Axios internals kwa njia isiyotarajiwa.
      Object.entries(auditHeaders).forEach(([key, value]) => {
        config.headers.set(key, value as string);
      });
      config.headers.set("X-Client-Platform", "EduAsas Web-App");
      config.headers.set("X-Request-ID", requestId);
    } catch (e) {
      console.warn("⚠️ [API] Failed to attach audit headers, proceeding anyway.", e);
    }

    if (isDev) {
      console.log(`🚀 [API] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    console.error("🚨 [API] Request setup failed:", error);
    return Promise.reject(error);
  }
);

/* =========================================================
   RESPONSE INTERCEPTOR
   ========================================================= */

api.interceptors.response.use(
  /* -------------------------------------------------------
     SUCCESS PATH (2xx)
     ------------------------------------------------------- */
  (response: AxiosResponse): any => {
    const config = response.config;
    const duration = Date.now() - (config._startTime || Date.now());
    const requestId = config._requestId || "N/A";

    if (isDev) {
      console.log(
        `✅ [API-RES] ${requestId} | ${response.config.method?.toUpperCase()} ${response.config.url} | ${duration}ms`
      );
    }

    // DATA VALIDATION: Defensive extraction
    const apiResponse = response.data as ApiResponse;
    if (!apiResponse || typeof apiResponse !== "object") {
      console.error(`🚨 [API-ERR] ${requestId} | Malformed response structure`);
      return Promise.reject(new Error("Invalid response format from server"));
    }

    const { status, action, message, data } = apiResponse;
    const skipToast = action === "NONE" || !!config._noToast;

    // BACKEND-LEVEL ERRORS (e.g., 200 OK but status: 'error')
    if (status !== "success") {
      console.warn(`⚠️ [API-WARN] - Action: ${action} | Msg: ${message} req - ${requestId} |`);

      if (IMMEDIATE_LOGOUT_ACTIONS.includes(action)) {
        hardLogout();
        return Promise.reject(apiResponse);
      }

      if (!skipToast) {
        const msg = extractErrorMessage(apiResponse);
        //status === "warning" ? toast.warning(msg) : toast.error(msg);
      }

      return action === "NONE" ? apiResponse : Promise.reject(apiResponse);
    }

    // ENTERPRISE SIDE-EFFECT ENGINE
    const handleSideEffects = (action: ResponseAction, payload: any) => {
      try {
        switch (action) {
          case "SYNC_CONTEXT":
            window.dispatchEvent(new CustomEvent("app:sync-context", { detail: payload }));
            break;
          case "KILL_CONTEXT":
            window.dispatchEvent(new CustomEvent("app:kill-context"));
            break;
          case "REDIRECT":
            if (payload?.url && isSafeRedirectUrl(payload.url)) {
              window.location.href = payload.url;
            } else if (payload?.url) {
              console.warn(`🚨 [API-SIDE-EFFECT] ${requestId} | Blocked unsafe redirect URL: ${payload.url}`);
            }
            break;
        }
      } catch (err) {
        console.error(`🚨 [API-SIDE-EFFECT] ${requestId} | Failed:`, err);
      }
    };

    handleSideEffects(action, data);

    return apiResponse;
  },

  /* -------------------------------------------------------
     ERROR PATH (4xx / 5xx / Network)
     ------------------------------------------------------- */
  async (error: AxiosError<ApiResponse>) => {
    // Requests cancelled on purpose (AbortController / component unmount)
    // are not real errors — let them pass through untouched, no toast,
    // no logging noise.
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    try {
      const originalRequest = error.config;
      const requestId = originalRequest?._requestId || "UNKNOWN_REQ";
      const duration = originalRequest?._startTime ? Date.now() - originalRequest._startTime : 0;
      const responseData = error.response?.data;
      const status = error.response?.status || "NETWORK_ERR";
      const action = responseData?.action as ResponseAction | undefined;

      if (isDev) {
        console.error(
          `❌ [API-ERR] - ${error.config?.method?.toUpperCase()} ${error.config?.url} - Status: ${status} - Latency: ${duration}ms RequestID: ${requestId}`
        );
      }

      // 1. IMMEDIATE LOGOUT (Auth imekufa)
      if (action && IMMEDIATE_LOGOUT_ACTIONS.includes(action)) {
        processQueue(error);
        if (typeof window !== "undefined") {
          const eventName = action === "RE_AUTHENTICATE" ? "eduasas:re-authenticate" : "eduasas:logout";
          window.dispatchEvent(
            new CustomEvent(eventName, {
              detail: { message: responseData?.message || "Authentication required", status, requestId },
            })
          );
        }
        return Promise.reject(createApiError(error));
      }

      // 2. KILL_CONTEXT (Futa shule, session ipo)
      if (action && CONTEXT_CLEAR_ACTIONS.includes(action)) {
        if (isDev) console.log(`🧹 [API-CONTEXT] ${requestId} | Clearing context...`);
        window.dispatchEvent(new CustomEvent("app:kill-context"));
        return Promise.reject(createApiError(error));
      }

      // 3. RE_AUTHENTICATE (Session imeisha - Retry logic imara)
      const isUnauthorized = status === 401;
      if (isUnauthorized && originalRequest && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => api(originalRequest))
            .catch((err) => Promise.reject(createApiError(err)));
        }

        originalRequest._retry = true;
        isRefreshing = true;
        window.dispatchEvent(new CustomEvent("app:validate-session"));

        try {
          const isValid = await withTimeout(
            validateSessionApi(),
            REFRESH_TIMEOUT_MS,
            "Session validation timed out"
          );
          if (!isValid) throw new Error("Session invalid");

          processQueue(null);
          return api(originalRequest); // Retry original request
        } catch (refreshError) {
          processQueue(refreshError);
          hardLogout();
          return Promise.reject(createApiError(refreshError));
        } finally {
          isRefreshing = false;
        }
      }

      // 4. FALLBACK (Error yoyote nyingine — Network errors, 500s)
      return Promise.reject(createApiError(error));
    } catch (unexpectedError) {
      // Last-resort safety net: whatever goes wrong above, callers
      // always get a well-formed ApiError, never a raw/unshaped throw.
      console.error("🚨 [API] Unexpected error inside response interceptor:", unexpectedError);
      return Promise.reject(createApiError(unexpectedError));
    }
  }
);

export { api };