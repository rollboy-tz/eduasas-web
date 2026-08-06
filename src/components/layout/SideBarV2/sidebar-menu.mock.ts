/**
 * ============================================================================
 * EduAsas Sidebar V2 - Mock Menu Configuration
 * ============================================================================
 *
 * Mock navigation data kwa testing ya Sidebar V2.
 *
 * Baadaye hii inaweza kubadilishwa kuwa:
 *
 * - Permission based menu
 * - Role based menu
 * - Feature flags
 * - Subscription based menu
 *
 * @version 2.0.0
 */


import {
  LayoutDashboard,
  School,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  FileText,
  Settings,
  CreditCard,
} from "lucide-react";


import type {
  SidebarMenuItem,
} from "./sidebar.types";



/**
 * Main sidebar navigation items.
 */
export const sidebarMenuMock: SidebarMenuItem[] = [

  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },


  {
    label: "School",
    icon: School,
    href: "/school",
  },


  {
    label: "Students",
    icon: Users,
    href: "/students",
  },


  {
    label: "Classes",
    icon: GraduationCap,
    href: "/classes",
  },


  {
    label: "Subjects",
    icon: BookOpen,
    href: "/subjects",
  },


  {
    label: "Results",
    icon: ClipboardList,
    href: "/results",
  },


  {
    label: "Reports",
    icon: FileText,
    href: "/reports",
  },


  {
    label: "Billing",
    icon: CreditCard,
    href: "/billing",
  },


  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },

];