// path: src/middleware.ts

import { NextRequest } from "next/server";
import { authProxy } from "@/middleware/auth-proxy";
import { handleRouting } from "@/middleware/subdomain-router";

/**
 * Next.js middleware entry point.
 *
 * This file only wires Next.js to our logic modules — the actual
 * decision-making lives in `./lib/*`, so each piece stays easy to
 * unit test without needing Next's edge runtime.
 *
 * Order matters:
 * 1. Subdomain routing runs first, since it may rewrite the request
 *    to a different folder (e.g. `portal.eduasas.co.tz` -> `/portal`).
 * 2. Auth runs on whatever request results from step 1.
 */
export async function proxy(request: NextRequest) {
  const routingResponse = await handleRouting(request);
  if (routingResponse) {
    return routingResponse;
  }

  return authProxy(request);
}

/**
 * Matcher: run on every route except static assets, API routes,
 * and well-known files that never need auth checks.
 */
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|icons|images|fonts|favicon.ico|robots.txt|sitemap.xml|manifest.json|sw.js|workbox-).*)",
  ],
};
