import type { SidebarDevice } from "./types";

/**
 * ------------------------------------------------------------------
 * Breakpoints
 * ------------------------------------------------------------------
 *
 * Desktop : >= 1280px
 * Tablet  : 768px - 1279px
 * Mobile  : < 768px
 */

export const SIDEBAR_BREAKPOINTS = {
  mobile: 768,
  desktop: 1280,
} as const;

/**
 * ------------------------------------------------------------------
 * Get Device From Width
 * ------------------------------------------------------------------
 */

export function getSidebarDevice(width: number): SidebarDevice {
  if (width >= SIDEBAR_BREAKPOINTS.desktop) {
    return "desktop";
  }

  if (width >= SIDEBAR_BREAKPOINTS.mobile) {
    return "tablet";
  }

  return "mobile";
}

/**
 * ------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------
 */

export function isDesktop(width: number): boolean {
  return width >= SIDEBAR_BREAKPOINTS.desktop;
}

export function isTablet(width: number): boolean {
  return (
    width >= SIDEBAR_BREAKPOINTS.mobile &&
    width < SIDEBAR_BREAKPOINTS.desktop
  );
}

export function isMobile(width: number): boolean {
  return width < SIDEBAR_BREAKPOINTS.mobile;
}