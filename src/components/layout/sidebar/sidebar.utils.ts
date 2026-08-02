// components/layout/sidebar/sidebar.utils.ts

import { SidebarGroup } from "./sidebar.types";

export function hasActiveChildren(
  href: string,
  children?: { href: string }[]
) {
  if (!children) return false;

  return children.some(x => x.href === href);
}

export function isActive(
  pathname: string,
  href?: string
) {
  if (!href) return false;

  if (pathname === href) return true;

  if (
    href !== "/" &&
    pathname.startsWith(href)
  ) {
    return true;
  }

  return false;
}

export function shouldOpen(
  pathname: string,
  item: {
    href?: string;
    defaultOpen?: boolean;
    children?: {
      href: string;
    }[];
  }
) {
  if (item.defaultOpen) return true;

  if (isActive(pathname, item.href))
    return true;

  return hasActiveChildren(
    pathname,
    item.children
  );
}

export function totalItems(
  groups: SidebarGroup[]
) {
  return groups.reduce(
    (a, b) => a + b.items.length,
    0
  );
}