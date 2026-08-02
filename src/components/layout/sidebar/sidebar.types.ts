// components/layout/sidebar/sidebar.types.ts

import { LucideIcon } from "lucide-react";

export interface SidebarBadge {
  value: number | string;
  color?: "primary" | "success" | "warning" | "danger";
}

export interface SidebarChild {
  id: string;
  title: string;
  href: string;
  badge?: SidebarBadge;
}

export interface SidebarItem {
  id: string;

  title: string;

  href?: string;

  /**
   * jina la icon kutoka backend
   * mfano:
   * "Home"
   * "Users"
   * "School"
   */
  icon?: string;

  /**
   * kama data imetoka frontend
   */
  iconComponent?: LucideIcon;

  badge?: SidebarBadge;

  disabled?: boolean;

  children?: SidebarChild[];

  defaultOpen?: boolean;
}

export interface SidebarGroup {
  id: string;

  title?: string;

  items: SidebarItem[];
}