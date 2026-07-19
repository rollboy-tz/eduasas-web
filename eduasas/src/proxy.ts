// path: src/proxy.ts

import { NextRequest, NextResponse } from "next/server";

/* =========================================================
   ROUTE CONFIGURATION
   ========================================================= */

/**
 * Protected application routes.
 *
 * Any route matching these prefixes requires
 * an authenticated session.
 */
const PROTECTED_PATHS = [
  "/u",
  "/s",
  "school"
];

/* =========================================================
   JWT UTILITIES
   ========================================================= */

/**
 * Extracts raw JWT from a signed cookie value.
 *
 * Expected cookie format:
 *   s:<jwt>.<signature>
 *
 * Returns:
 *   - JWT string
 *   - null if malformed/missing
 */
function extractSignedJwt(cookieValue?: string): string | null {
  if (!cookieValue) return null;

  try {
    const decoded = decodeURIComponent(cookieValue);

    if (!decoded.startsWith("s:")) return null;

    const signedPart = decoded.slice(2);
    const parts = signedPart.split(".");

    // JWT must contain:
    // header.payload.signature
    if (parts.length < 3) return null;

    return parts.slice(0, 3).join(".");
  } catch {
    return null;
  }
}

/**
 * Decodes JWT payload safely without verifying signature.
 *
 * Middleware only uses this for lightweight expiry checks.
 *
 * IMPORTANT:
 * - This DOES NOT verify authenticity.
 * - Never use decoded payload for authorization decisions.
 */
function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    let payload = parts[1];
    if (!payload) return null;

    payload = payload.replace(/-/g, "+").replace(/_/g, "/");

    while (payload.length % 4) {
      payload += "=";
    }

    const decoded = atob(payload);

    const utf8Decoded = decodeURIComponent(
      Array.from(decoded)
        .map((char) => "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(utf8Decoded);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("JWT Decoding Error:", error);
    }
    return null;
  }
}

/**
 * Checks whether JWT is expired.
 *
 * Returns:
 *   true  => expired/invalid
 *   false => still valid
 */
function isJwtExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);

  if (!payload?.exp) return true;

  return payload.exp * 1000 <= Date.now();
}

/* =========================================================
   PROXY MIDDLEWARE
   ========================================================= */

/**
 * EduAsas Edge Proxy
 *
 * Responsibilities:
 * - Lightweight route protection
 * - Session presence checks
 * - Fast expiry filtering
 * - Security headers
 *
 * IMPORTANT:
 * - No backend calls
 * - No refresh logic
 * - No database access
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* -------------------------------------------------------
     REQUEST LOGGING
     ------------------------------------------------------- */
  console.log(
    `[${new Date().toLocaleTimeString()}] 🚀 ${request.method} -> ${pathname}`
  );

  /* -------------------------------------------------------
     ROUTE PROTECTION CHECK
     ------------------------------------------------------- */
  const isProtectedRoute = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  /* -------------------------------------------------------
     TOKEN EXTRACTION
     ------------------------------------------------------- */
  const accessToken = extractSignedJwt(
    request.cookies.get("eduasas_auth_token")?.value
  );

  const refreshToken = extractSignedJwt(
    request.cookies.get("eduasas_refresh_token")?.value
  );

  /* -------------------------------------------------------
     NO SESSION
     ------------------------------------------------------- */
  if (!accessToken && !refreshToken) {
    console.warn(`[Auth] ❌ No session cookies found.`);

    return NextResponse.redirect(
      new URL("/auth/sign-in", request.url)
    );
  }

  /* -------------------------------------------------------
     LIGHTWEIGHT EXPIRY CHECK
     ------------------------------------------------------- */

  const accessExpired =
    !accessToken || isJwtExpired(accessToken);

  const refreshExpired =
    !refreshToken || isJwtExpired(refreshToken);

  /**
   * Both tokens expired:
   * hard redirect immediately.
   */
  if (accessExpired && refreshExpired) {
    console.warn(`[Auth] ⌛ Session expired.`);

    return NextResponse.redirect(
      new URL("/auth/sign-in", request.url)
    );
  }

  /**
   * Access expired but refresh still valid:
   *
   * Allow request to continue.
   *
   * Axios interceptor will silently refresh
   * session on the first API request.
   */
  const response = NextResponse.next();

  /* -------------------------------------------------------
     SECURITY HEADERS
     ------------------------------------------------------- */
  response.headers.set(
    "x-eduasas-proxy-verified",
    "true"
  );

  response.headers.set(
    "x-frame-options",
    "DENY"
  );

  return response;
}

/* =========================================================
   MATCHER CONFIGURATION
   ========================================================= */

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|icons|images|fonts|favicon.ico|robots.txt|sitemap.xml|manifest.json|sw.js|workbox-).*)",
  ],
};