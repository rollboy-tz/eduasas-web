"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/helper";
import { SidebarIcon } from "./SidebarIcon";
import { EduTooltip } from "@/components/elements/edu-tooltip";

/**
 * Props zinazohitajika na component ya `SidebarLink`.
 */
interface SidebarLinkProps {
  /** Jina au anwani inayoelezea kiungo (link) */
  title: string;
  /** Njia (URL path) ambapo kiungo kinapeleka */
  href: string;
  /** Component au jina la ikoni inayotumiwa na kiungo hiki */
  icon: any;
  /** Inafafanua kama kiungo kipo active kwa sasa */
  active?: boolean;
  /** Idadi ya notifications/taarifa za kuonyeshwa pembeni ya kiungo (optional) */
  badge?: number;
  /** Inafafanua kama sidebar imekunjwa (collapsed) au la */
  collapsed?: boolean;
}

/**
 * Component inayowakilisha kiungo kimoja cha menyu kwenye sidebar.
 * 
 * - Inasaidia hali ya `active` kwa kubadilisha rangi ya background na maandishi.
 * - Inaonyesha `badge` ya idadi ya taarifa pindi haijakunjwa (`collapsed = false`).
 * - Inatumia `EduTooltip` kuonyesha jina la kiungo pindi sidebar inapokuwa imekunjwa (`collapsed = true`).
 */
export function SidebarLink({
  title,
  href,
  icon,
  active = false,
  badge,
  collapsed = false,
}: SidebarLinkProps) {
  const link = (
    <Link
      href={href}
      className={cn(
        "relative flex items-center w-full h-10 rounded-md transition-colors text-sm font-medium",
        collapsed ? "justify-center px-0" : "gap-3 px-3",
        active
          ? "bg-primary-50 text-primary-600"
          : "text-muted-600 hover:bg-muted-100 hover:text-muted-900"
      )}
    >
      <SidebarIcon
        component={icon}
        className={cn(
          "shrink-0",
          active ? "text-primary-600" : "text-muted-700"
        )}
      />

      {!collapsed && (
        <>
          <span className="flex-1 truncate">{title}</span>

          {badge !== undefined && (
            <span
              className={cn(
                "min-w-5 h-5 px-1.5 rounded-full text-[11px] flex items-center justify-center font-semibold",
                active
                  ? "bg-primary-600 text-white"
                  : "bg-muted-200 text-muted-700"
              )}
            >
              {badge}
            </span>
          )}
        </>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <EduTooltip content={title} side="right">
        {link}
      </EduTooltip>
    );
  }

  return link;
}