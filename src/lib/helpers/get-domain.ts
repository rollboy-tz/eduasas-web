/**
 * Resolves the application's root domain used for tenant redirects.
 *
 * Resolution order:
 * 1. Uses `NEXT_PUBLIC_ROOT_DOMAIN` when available.
 * 2. Returns `localhost:3000` in local development.
 * 3. Extracts the root domain from the current hostname.
 *    Supports second-level TLDs such as `.co.tz`.
 *
 * @returns {string} The resolved root domain.
 */
export function getRootDomain(): string {
    if (process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
        return process.env.NEXT_PUBLIC_ROOT_DOMAIN;
    }

    const host = window.location.hostname;

    if (host === "localhost:3000") {
        return "localhost:3000";
    }

    const parts = host.split(".");

    if (parts.length <= 2) {
        return host;
    }

    // school.eduasas.co.tz -> eduasas.co.tz
    if (parts.at(-2) === "co") {
        return parts.slice(-3).join(".");
    }

    // school.example.com -> example.com
    return parts.slice(-2).join(".");
}