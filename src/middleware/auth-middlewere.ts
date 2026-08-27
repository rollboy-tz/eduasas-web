// path: src/lib/auth-proxy.ts

import { NextRequest, NextResponse } from "next/server";

/* =========================================================
   TYPES
   ========================================================= */

interface JwtPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: unknown;
}

type TokenState = {
  token: string | null;
  expired: boolean;
};

/* =========================================================
   CONFIGURATION
   ========================================================= */

/**
 * Protected application routes.
 * Any route matching these prefixes requires an authenticated session.
 */
const PROTECTED_PATHS = ["/u", "/s", "/school"] as const;

/**
 * Cookie names — pulled from env with safe fallbacks so staging/prod
 * can differ without touching code.
 */
const COOKIE_NAMES = {
  access: process.env.AUTH_ACCESS_COOKIE ?? "eduasas_auth_token",
  refresh: process.env.AUTH_REFRESH_COOKIE ?? "eduasas_refresh_token",
};

const SIGN_IN_PATH = "/auth/sign-in";

/** Small clock-skew allowance (seconds) to avoid false-positive expiry. */
const CLOCK_SKEW_TOLERANCE_SECONDS = 5;

const isDev = process.env.NODE_ENV === "development";

/* =========================================================
   LOGGER (silent in production)
   ========================================================= */

const log = {
  info: (...args: unknown[]) => isDev && console.log(...args),
  warn: (...args: unknown[]) => isDev && console.warn(...args),
  error: (...args: unknown[]) => isDev && console.error(...args),
};

/* =========================================================
   JWT UTILITIES
   ========================================================= */

/**
 * Extracts the raw JWT from a signed cookie value.
 *
 * Expected cookie format: `s:<jwt>.<signature>`
 * Returns the `header.payload.signature` JWT, or null if malformed/missing.
 */
function extractSignedJwt(cookieValue?: string): string | null {
  if (!cookieValue) return null;

  try {
    const decoded = decodeURIComponent(cookieValue);
    if (!decoded.startsWith("s:")) return null;

    const signedPart = decoded.slice(2);
    const parts = signedPart.split(".");

    // A JWT must contain header.payload.signature (>= 3 parts)
    if (parts.length < 3) return null;

    return parts.slice(0, 3).join(".");
  } catch (error) {
    log.error("[Auth] Failed to extract signed JWT:", error);
    return null;
  }
}

/**
 * Decodes a JWT payload WITHOUT verifying its signature.
 *
 * IMPORTANT: this is only for lightweight, non-authoritative expiry
 * checks at the edge. Never use this payload for authorization
 * decisions — real verification must happen on the backend.
 */
function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    let payload = parts[1];
    if (!payload) return null;

    payload = payload.replace(/-/g, "+").replace(/_/g, "/");
    while (payload.length % 4) payload += "=";

    const decoded = atob(payload);
    const utf8Decoded = decodeURIComponent(
      Array.from(decoded)
        .map((char) => "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(utf8Decoded) as JwtPayload;
  } catch (error) {
    log.error("[Auth] JWT decoding error:", error);
    return null;
  }
}

/**
 * Checks whether a JWT is expired (with a small clock-skew tolerance).
 * Returns true for expired/invalid/missing tokens.
 */
function isJwtExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;

  const expiresAtMs = (payload.exp + CLOCK_SKEW_TOLERANCE_SECONDS) * 1000;
  return expiresAtMs <= Date.now();
}

/**
 * Resolves a cookie into a { token, expired } state in one pass.
 */
function resolveTokenState(rawCookieValue?: string): TokenState {
  const token = extractSignedJwt(rawCookieValue);
  return {
    token,
    expired: !token || isJwtExpired(token),
  };
}

/* =========================================================
   HELPERS
   ========================================================= */

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PATHS.some((path) => pathname.startsWith(path));
}

/**
 * Builds a sign-in redirect, preserving the original destination
 * so the user can be sent back after authenticating.
 */
function redirectToSignIn(request: NextRequest): NextResponse {
  const signInUrl = new URL(SIGN_IN_PATH, request.url);
  signInUrl.searchParams.set("from", request.nextUrl.pathname);
  return NextResponse.redirect(signInUrl);
}

function withSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("x-eduasas-proxy-verified", "true");
  response.headers.set("x-frame-options", "DENY");
  return response;
}

/* =========================================================
   MAIN LOGIC
   ========================================================= */

/**
 * EduAsas Edge Auth Proxy
 *
 * Responsibilities:
 * - Lightweight route protection
 * - Session presence checks
 * - Fast expiry filtering (no backend/DB calls here)
 * - Security headers
 *
 * NOT responsible for:
 * - Token refresh (handled client-side, e.g. an axios interceptor)
 * - Signature verification / true authorization (handled by backend)
 */
export async function authProxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  log.info(`[${new Date().toLocaleTimeString()}] 🚀 ${request.method} -> ${pathname}`);

  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  const access = resolveTokenState(request.cookies.get(COOKIE_NAMES.access)?.value);
  const refresh = resolveTokenState(request.cookies.get(COOKIE_NAMES.refresh)?.value);

  // No session at all.
  if (!access.token && !refresh.token) {
    log.warn("[Auth] ❌ No session cookies found.");
    return redirectToSignIn(request);
  }

  // Both access and refresh are expired/invalid — hard redirect.
  if (access.expired && refresh.expired) {
    log.warn("[Auth] ⌛ Session expired.");
    return redirectToSignIn(request);
  }

  // Access expired but refresh still valid: let the request through.
  // A client-side interceptor is expected to silently refresh on the
  // next API call.
  return withSecurityHeaders(NextResponse.next());
}
