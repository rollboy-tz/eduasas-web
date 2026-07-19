// lib/globalErrorHandler.ts
import { toast } from "sonner";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { logoutAndRedirect } from "./logout-and-redirect";

/* =========================================================
   ERROR CONSTANTS (Server → Frontend contract)
   ========================================================= */

export const SERVER_ERRORS = {
  // Auth / Session
  TOKEN_NOT_FOUND:        "TOKEN_NOT_FOUND",
  TOKEN_EXPIRED:          "TOKEN_EXPIRED",
  TOKEN_INVALID:          "TOKEN_INVALID",
  TOKEN_REUSE:            "TOKEN_REUSE",
  TOKEN_TYPE_MISMATCH:    "TOKEN_TYPE_MISMATCH",
  TOKEN_MALFORMED:        "TOKEN_MALFORMED",
  TOKEN_VERSION_MISMATCH: "TOKEN_VERSION_MISMATCH",
  SESSION_NOT_FOUND:      "SESSION_NOT_FOUND",
  AUTH_REQUIRED:          "AUTH_REQUIRED",
  AUTH_SECURITY_BREACH:   "AUTH_SECURITY_BREACH",

  // Account
  USER_NOT_FOUND:         "USER_NOT_FOUND",
  ACCOUNT_SUSPENDED:      "ACCOUNT_SUSPENDED",
  ACCOUNT_RESTRICTED:     "ACCOUNT_RESTRICTED",
  ACCOUNT_PENDING:        "ACCOUNT_PENDING",
  ACCOUNT_EXISTS:         "ACCOUNT_EXISTS",
  ALREADY_VERIFIED:       "ALREADY_VERIFIED",
  INVALID_CREDENTIALS:    "INVALID_CREDENTIALS",
  INVALID_OTP:            "INVALID_OTP",
  OAUTH_USER_LOGIN_ATTEMPT: "OAUTH_USER_LOGIN_ATTEMPT",

  // School / Tenant
  SCHOOL_NOT_FOUND:       "SCHOOL_NOT_FOUND",
  SCHOOL_SUSPENDED:       "SCHOOL_SUSPENDED",
  CONTEXT_REQUIRED:       "CONTEXT_REQUIRED",
  NO_ACTIVE_ROLES:        "NO_ACTIVE_ROLES",
  ALREADY_ACTIVE:         "ALREADY_ACTIVE",

  // Access
  ACCESS_DENIED:          "ACCESS_DENIED",

  // Data
  MISSING_IDENTITY:       "MISSING_IDENTITY",
  VALIDATION_ERROR:       "VALIDATION_ERROR",
  INVALID_CATEGORY_REFERENCE: "INVALID_CATEGORY_REFERENCE",

  // Misc
  PURPOSE_ERROR:          "PURPOSE_ERROR",
  GOOGLE_AUTH_FAILED:     "GOOGLE_AUTH_FAILED",
  MISSING_EMAIL:          "MISSING_EMAIL",
} as const;

export type ServerError = typeof SERVER_ERRORS[keyof typeof SERVER_ERRORS];

/* =========================================================
   ACTION GROUPS
   Frontend inaamua nini kifanyike kulingana na kundi.
   ========================================================= */

export const ERROR_ACTIONS = {

  // Futa kila kitu — mtumiaji nje SASA HIVI, hakuna mazungumzo
  TERMINATE_SESSION: [
    SERVER_ERRORS.TOKEN_NOT_FOUND,
    SERVER_ERRORS.TOKEN_EXPIRED,
    SERVER_ERRORS.TOKEN_INVALID,
    SERVER_ERRORS.TOKEN_REUSE,
    SERVER_ERRORS.TOKEN_TYPE_MISMATCH,
    SERVER_ERRORS.TOKEN_MALFORMED,
    SERVER_ERRORS.TOKEN_VERSION_MISMATCH,
    SERVER_ERRORS.SESSION_NOT_FOUND,
    SERVER_ERRORS.AUTH_REQUIRED,
    SERVER_ERRORS.AUTH_SECURITY_BREACH,
  ],

  // Mrudishe school selector — context imepotea au haipo
  REDIRECT_TO_PORTAL: [
    SERVER_ERRORS.SCHOOL_NOT_FOUND,
    SERVER_ERRORS.CONTEXT_REQUIRED,
    SERVER_ERRORS.SCHOOL_SUSPENDED,
    SERVER_ERRORS.NO_ACTIVE_ROLES,
  ],

  // Zuia UI — onyesha tu, usibadili page
  RESTRICT_ACCESS: [
    SERVER_ERRORS.ACCESS_DENIED,
    SERVER_ERRORS.ACCOUNT_SUSPENDED,
    SERVER_ERRORS.ACCOUNT_RESTRICTED,
  ],

  // Mwambie tu — toast peke yake
  NOTIFY_ONLY: [
    SERVER_ERRORS.VALIDATION_ERROR,
    SERVER_ERRORS.MISSING_IDENTITY,
    SERVER_ERRORS.INVALID_OTP,
    SERVER_ERRORS.ALREADY_VERIFIED,
    SERVER_ERRORS.INVALID_CREDENTIALS,
    SERVER_ERRORS.ACCOUNT_EXISTS,
    SERVER_ERRORS.INVALID_CATEGORY_REFERENCE,
    SERVER_ERRORS.OAUTH_USER_LOGIN_ATTEMPT,
    SERVER_ERRORS.GOOGLE_AUTH_FAILED,
  ],

} as const;

/* =========================================================
   OPTIONS
   ========================================================= */

interface ErrorOptions {
  logError?: boolean;
  message?:  string;
}

/* =========================================================
   GLOBAL ERROR HANDLER
   ========================================================= */

export const globalErrorHandler = (
  errorCode:  string,
  router:     AppRouterInstance,
  options:    ErrorOptions = { logError: true },
) => {
  if (options.logError) {
    console.error(`[GlobalErrorHandler] → ${errorCode}`);
  }

  /* -------------------------------------------------------
     1. TERMINATE SESSION
        Logout wa haraka — hakuna toast kabla ya redirect
        kwa sababu redirect itaifuta kabla haijawaka.
        Badala yake tunaweka message kwenye sessionStorage
        ili login page iione na kuonyesha.
     ------------------------------------------------------- */
  if (ERROR_ACTIONS.TERMINATE_SESSION.includes(errorCode as any)) {
    const msg = options.message ?? "Session expired. Please sign in again.";
    sessionStorage.setItem("auth:redirect-message", msg);
    logoutAndRedirect(); // ← haraka, hakuna kusubiri
    return;
  }

  /* -------------------------------------------------------
     2. REDIRECT TO PORTAL
        Context imepotea — mrudishe school selector.
        Toast inaonekana kabla ya redirect (portal ni ndani
        ya app — redirect si ya haraka kama logout).
     ------------------------------------------------------- */
  if (ERROR_ACTIONS.REDIRECT_TO_PORTAL.includes(errorCode as any)) {
    toast.info(
      options.message ?? "School context required. Redirecting...",
      { duration: 2000 },
    );
    setTimeout(() => router.replace("/home"), 500);
    return;
  }

  /* -------------------------------------------------------
     3. RESTRICT ACCESS
        Zuia UI — onyesha warning, usibadili page.
     ------------------------------------------------------- */
  if (ERROR_ACTIONS.RESTRICT_ACCESS.includes(errorCode as any)) {
    toast.warning(
      options.message ?? "Access denied.",
      {
        description: "Contact your administrator if you believe this is a mistake.",
        duration:    5000,
      },
    );
    return;
  }

  /* -------------------------------------------------------
     4. NOTIFY ONLY
        Toast peke yake — hakuna redirect, hakuna state change.
     ------------------------------------------------------- */
  if (ERROR_ACTIONS.NOTIFY_ONLY.includes(errorCode as any)) {
    toast.error(options.message ?? `Error: ${errorCode}`);
    return;
  }

  /* -------------------------------------------------------
     5. ACCOUNT PENDING
        Mwambie averifishe — si logout, si portal.
     ------------------------------------------------------- */
  if (errorCode === SERVER_ERRORS.ACCOUNT_PENDING) {
    toast.warning(
      options.message ?? "Please verify your account to continue.",
      { duration: 5000 },
    );
    router.replace("/verify");
    return;
  }

  /* -------------------------------------------------------
     6. GENERIC FALLBACK
     ------------------------------------------------------- */
  toast.error(options.message ?? `An unexpected error occurred. (${errorCode})`);
};