// lib/api.ts
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse
} from "axios";

import { ClientDevice } from "@/lib/utils/ClientDevice";
import { toast } from "sonner";
import { ApiError } from "./errors";
import { logoutAndRedirect } from "../helpers/logout-and-redirect";
import { ApiResponse, ResponseAction } from "./api-respone";
import { useSessionValidation, validateSessionApi } from "../helpers";



/* =========================================================
   HELPERS
   ========================================================= */

const extractErrorMessage = (responseData: any, error?: AxiosError): string => {
  if (responseData?.message) return responseData.message;

  if (responseData?.errors && typeof responseData.errors === "object") {
    return Object.values(responseData.errors).flat().join("\n");
  }

  if (error?.code === "ECONNABORTED") return "Request timed out. Please check your internet.";
  if (!error?.response) return "Network error. Please check your connection.";

  return "An unexpected error occurred. Please try again.";
};

/**
 * Hard logout — inaenda bila kusubiri chochote.
 * Toast haitumiwi hapa — redirect itaifuta kabla haijawaka.
 * Caller ndiye anayeamua kuonyesha ujumbe kabla ya kuiita.
 */
const hardLogout = () => {
  logoutAndRedirect();
};

/* =========================================================
   ACTIONS ZINAZOHITAJI LOGOUT WA HARAKA
   Zinaangaliwa mahali MOJA — si kwa errorCode wala action tofauti.
   ========================================================= */

// IMMEDIATE_LOGOUT_ACTIONS — session imekufa kabisa, mtumiaji nje SASA HIVI
// KILL_CONTEXT haipo hapa — si logout, ni context clear tu (ona chini)
const IMMEDIATE_LOGOUT_ACTIONS: ResponseAction[] = [
  "RE_AUTHENTICATE",
  "LOGOUT",
];

// KILL_CONTEXT — futa data ya school, mrudishe portal. Session ipo bado.
const CONTEXT_CLEAR_ACTIONS: ResponseAction[] = [
  "KILL_CONTEXT",
];

/* =========================================================
   AXIOS INSTANCE
   ========================================================= */

const API_URL = "/main";

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

/* =========================================================
   REFRESH QUEUE
   Inashikilia requests zilizoshindwa wakati refresh inaendelea.
   ========================================================= */

let isRefreshing = false;
let failedQueue: { resolve: (v: any) => void; reject: (e: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

/* =========================================================
   REQUEST INTERCEPTOR
   ========================================================= */

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const auditHeaders = ClientDevice.getAuditHeaders() || {};
      const requestId = crypto.randomUUID();
      (config as any)._requestId = requestId;
      (config as any)._startTime = Date.now();

      // Tunatumia Object.assign kwa usalama
      config.headers = {
        ...config.headers,
        ...auditHeaders,
        "X-Client-Platform": "EduAsas Web-App",
        "X-Request-ID": requestId,
      } as any;

    } catch (e) {
      console.warn("⚠️ [API] Failed to attach audit headers, proceeding anyway.");
    }

    if (process.env.NODE_ENV === "development") {
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
    // 1. PERFORMANCE TRACKING: Calculate Latency
    const config = response.config as any;
    const duration = Date.now() - (config._startTime || Date.now());
    const requestId = config._requestId || "N/A";

    if (process.env.NODE_ENV === "development") {
      console.log(`✅ [API-RES] ${requestId} | ${response.config.method?.toUpperCase()} ${response.config.url} | ${duration}ms`);
    }

    // 2. DATA VALIDATION: Defensive extraction
    const apiResponse = response.data as ApiResponse;
    if (!apiResponse || typeof apiResponse !== 'object') {
      console.error(`🚨 [API-ERR] ${requestId} | Malformed response structure`);
      return Promise.reject(new Error("Invalid response format from server"));
    }

    const { status, action, message, data } = apiResponse;
    const skipToast = (action === "NONE") || !!config._noToast;

    // 3. ERROR HANDLING PATH: Backend-Level Errors (e.g., 200 OK but status: 'error')
    if (status !== "success") {
      console.warn(`⚠️ [API-WARN] - Action: ${action} | Msg: ${message} req - ${requestId} |`);

      if (IMMEDIATE_LOGOUT_ACTIONS.includes(action)) {
        hardLogout();
        return Promise.reject(apiResponse);
      }

      if (!skipToast) {
        const msg = extractErrorMessage(apiResponse);
        status === "warning" ? toast.warning(msg) : toast.error(msg);
      }

      return action === "NONE" ? apiResponse : Promise.reject(apiResponse);
    }

    // 4. ENTERPRISE SIDE-EFFECT ENGINE
    // Tunatumia logic ya pekee kwa kila action ili kuweka utaratibu
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
            if (payload?.url) window.location.href = payload.url;
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
    const originalRequest = error.config as any;
    const requestId = originalRequest?._requestId || "UNKNOWN_REQ";
    const duration = originalRequest?._startTime ? Date.now() - originalRequest._startTime : 0;
    const responseData = error.response?.data;
    const status = error.response?.status || "NETWORK_ERR";
    const action = responseData?.action as ResponseAction | undefined;

    // 1. ENTERPRISE LOGGING: Tracking failure na duration
    if (process.env.NODE_ENV === "development") {
      console.error(`❌ [API-ERR] - ${error.config?.method?.toUpperCase()} ${error.config?.url} - Status: ${status} - Latency: ${duration}ms RequestID: ${requestId}`);
    }
    // Helper ndogo ya kutengeneza ApiError yetu
    const createApiError = (err: AxiosError<ApiResponse> | any): ApiError => {
      if (err.response?.data) return new ApiError(err.response.data);
      return new ApiError({
        success: false,
        status: "error",
        message: extractErrorMessage(err.response?.data, err),
        action: "NONE",
        data: null,
        timestamp: new Date().toISOString()
      });
    };

    // 2. IMMEDIATE LOGOUT (Auth imekufa)
    if (action && IMMEDIATE_LOGOUT_ACTIONS.includes(action)) {
      processQueue(error);
      if (typeof window !== "undefined") {
        const eventName = action === "RE_AUTHENTICATE" ? "eduasas:re-authenticate" : "eduasas:logout";
        window.dispatchEvent(new CustomEvent(eventName, {
          detail: { message: responseData?.message || "Authentication required", status, requestId }
        }));
      }
      return Promise.reject(createApiError(error));
    }

    // 3. KILL_CONTEXT (Futa shule, session ipo)
    if (action && CONTEXT_CLEAR_ACTIONS.includes(action)) {
      console.log(`🧹 [API-CONTEXT] ${requestId} | Clearing context...`);
      window.dispatchEvent(new CustomEvent("app:kill-context"));
      return Promise.reject(createApiError(error));
    }

    // 4. RE_AUTHENTICATE (Session imeisha - Retry logic imara)
    const isUnauthorized = status === 401;
    if (isUnauthorized && !originalRequest?._retry) {
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
        const isValid = await validateSessionApi();
        if (isValid) {
          isRefreshing = false;
          processQueue(null);
          return api(originalRequest); // Retry original request
        }
        throw new Error("Session invalid");
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError);
        hardLogout();
        return Promise.reject(createApiError(refreshError));
      }
    }

    // 5. FALLBACK (Error yoyote nyingine — Network errors, 500s)
    return Promise.reject(createApiError(error));
  },
);

export { api };