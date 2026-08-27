import type { ReactNode } from "react";

/**
 * ------------------------------------------------------------------
 * Device Types
 * ------------------------------------------------------------------
 */

export type SidebarDevice =
  | "desktop"
  | "tablet"
  | "mobile";

/**
 * ------------------------------------------------------------------
 * Mode Types
 * ------------------------------------------------------------------
 */

export type DesktopSidebarMode =
  | "expanded"
  | "minimal"
  | "floating";

export type TabletSidebarMode =
  | "minimal"
  | "floating";

export type MobileSidebarMode =
  | "floating";

/**
 * ------------------------------------------------------------------
 * Visibility
 * ------------------------------------------------------------------
 */

export type SidebarVisibility =
  | "visible"
  | "hidden";

/**
 * ------------------------------------------------------------------
 * Device State (Discriminated Union)
 * ------------------------------------------------------------------
 */

export interface DesktopSidebarState {
  device: "desktop";
  mode: DesktopSidebarMode;
  visibility: "visible";
}

export interface TabletSidebarState {
  device: "tablet";
  mode: TabletSidebarMode;
  visibility: SidebarVisibility;
}

export interface MobileSidebarState {
  device: "mobile";
  mode: MobileSidebarMode;
  visibility: SidebarVisibility;
}

export type SidebarState =
  | DesktopSidebarState
  | TabletSidebarState
  | MobileSidebarState;

/**
 * ------------------------------------------------------------------
 * Context
 * ------------------------------------------------------------------
 */

export interface SidebarContextValue {
  state: SidebarState;

  setMode(mode: SidebarState["mode"]): void;

  setVisibility(visibility: SidebarVisibility): void;

  toggle(): void;

  isDesktop: boolean;

  isTablet: boolean;

  isMobile: boolean;
}

/**
 * ------------------------------------------------------------------
 * Provider
 * ------------------------------------------------------------------
 */

export interface SidebarProviderProps {
  children: ReactNode;
}

/**
 * ------------------------------------------------------------------
 * Container
 * ------------------------------------------------------------------
 */

export interface SidebarContainerProps {
  children: ReactNode;
  className?: string;
}