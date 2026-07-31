// path: src/lib/subdomain-router.ts

import { NextRequest, NextResponse } from "next/server";

/* =========================================================
   CONFIGURATION
   ========================================================= */

const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "eduasas.co.tz").toLowerCase();

/** Hosts that should always fall through to the main app, never a subdomain folder. */
const IGNORED_HOSTS = new Set(["www"]);

/**
 * Only allow safe, single-level subdomain names: letters, numbers, hyphens.
 */
const VALID_SUBDOMAIN_PATTERN = /^[a-z0-9-]+$/;

const isDev = process.env.NEXT_PUBLIC_APP_STAGE === "development" || process.env.NEXT_PUBLIC_APP_STAGE === "beta";

/* =========================================================
   HELPERS
   ========================================================= */

function stripPort(hostname: string): string {
  return hostname.split(":")[0];
}

/**
 * Extracts a validated subdomain from a raw Host header.
 */
function extractSubdomain(rawHostname: string): string | null {
  const host = stripPort(rawHostname).toLowerCase();

  // Handle localhost during local development seamlessly
  const activeRootDomain = host.includes("localhost") ? "localhost" : ROOT_DOMAIN;

  let sub: string;

  if (host === activeRootDomain) {
    sub = "";
  } else if (host.endsWith(`.${activeRootDomain}`)) {
    sub = host.slice(0, -(activeRootDomain.length + 1));
  } else {
    return null;
  }

  // Normalize staging suffix: "portal.staging" -> "portal"
  const STAGING_SUFFIX = ".staging";
  if (sub.endsWith(STAGING_SUFFIX)) {
    sub = sub.slice(0, -STAGING_SUFFIX.length);
  }

  if (!sub || IGNORED_HOSTS.has(sub)) return null;

  // Reject anything that isn't a clean, single-level subdomain name.
  if (!VALID_SUBDOMAIN_PATTERN.test(sub)) {
    if (isDev) {
      console.warn(`[Routing] Rejected suspicious host segment: "${sub}"`);
    }
    return null;
  }

  return sub;
}

/* =========================================================
   MAIN LOGIC
   ========================================================= */

export async function handleRouting(req: NextRequest): Promise<NextResponse | null> {
  const url = req.nextUrl;

  // Avoid rewriting from api routes
  if (url.pathname.startsWith('/main') || url.pathname.startsWith('/api')) {
    return null;
  }

  const hostname = req.headers.get("host") || "";
  const subdomain = extractSubdomain(hostname);

  // ULINZI: Zuia direct access ya /app/... kutoka kwenye main domain
  if (!subdomain && url.pathname.startsWith("/app")) {
    return NextResponse.rewrite(new URL("/404", req.url));
  }

  if (!subdomain) return null;

  // Avoid infinite rewrite loops
  if (url.pathname === `/app/${subdomain}` || url.pathname.startsWith(`/app/${subdomain}/`)) {
    return null;
  }

  if (isDev) {
    console.log(`[Routing] Host: ${hostname} -> Subdomain: ${subdomain}`);
  }

  // Pass custom header for easy retrieval in Server Components/Actions
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-subdomain", subdomain);

  // Rewrite to app/app/[subdomain]/...
  const rewriteUrl = new URL(`/app/${subdomain}${url.pathname}${url.search}`, req.url);
  
  return NextResponse.rewrite(rewriteUrl, {
    request: {
      headers: requestHeaders,
    },
  });
}