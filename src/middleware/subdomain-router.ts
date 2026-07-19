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
 * This is the key defense against Host-header spoofing — since `hostname`
 * comes straight from the client, we never trust it to build a path
 * without validating it first (blocks things like `..`, `/`, `%2e%2e`, etc).
 */
const VALID_SUBDOMAIN_PATTERN = /^[a-z0-9-]+$/;

const isDev = process.env.NEXT_PUBLIC_APP_STAGE === "development" || process.env.NEXT_PUBLIC_APP_STAGE === "staging";

/* =========================================================
   HELPERS
   ========================================================= */

function stripPort(hostname: string): string {
  return hostname.split(":")[0];
}

/**
 * Extracts a validated subdomain from a raw Host header.
 * Returns null when there's no subdomain, or when the host doesn't
 * belong to our root domain at all (custom/unknown domains are left
 * untouched rather than guessed at).
 */
function extractSubdomain(rawHostname: string): string | null {
  const host = stripPort(rawHostname).toLowerCase();

  let sub: string;

  if (host === ROOT_DOMAIN) {
    sub = "";
  } else if (host.endsWith(`.${ROOT_DOMAIN}`)) {
    sub = host.slice(0, -(ROOT_DOMAIN.length + 1));
  } else {
    // Host doesn't match our root domain at all (e.g. a stray/misconfigured
    // custom domain). Don't guess — just let the request pass through.
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

/**
 * Rewrites requests on `<subdomain>.<rootDomain>` to the matching
 * `/subdomain` folder in the app, so e.g. `portal.eduasas.co.tz/dashboard`
 * serves `app/portal/dashboard`.
 *
 * Returns null when no rewrite is needed, so callers can fall through
 * to the next piece of middleware logic (e.g. auth).
 */
export async function handleRouting(req: NextRequest): Promise<NextResponse | null> {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  const subdomain = extractSubdomain(hostname);
  if (!subdomain) return null;

  // Avoid rewriting a request that's already targeting this folder
  // (e.g. an internal redirect that already resolved it).
  if (url.pathname === `/${subdomain}` || url.pathname.startsWith(`/${subdomain}/`)) {
    return null;
  }

  if (isDev) {
    console.log(`[Routing] Host: ${hostname} -> Subdomain: ${subdomain}`);
  }

  // Preserve the original path AND query string — the previous version
  // silently dropped query params on every rewrite.
  const rewriteUrl = new URL(`/${subdomain}${url.pathname}${url.search}`, req.url);
  return NextResponse.rewrite(rewriteUrl);
}
