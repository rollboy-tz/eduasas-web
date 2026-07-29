// components/sidebar-links.ts
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  FileSpreadsheet, 
  Settings, 
  UserCircle 
} from "lucide-react";

export interface SidebarItem {
  title: string;
  href: string;
  icon: any;
}

export interface SidebarGroup {
  groupLabel: string;
  items: SidebarItem[];
}

export const sidebarGroups: SidebarGroup[] = [
  {
    groupLabel: "MAIN",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    groupLabel: "ACADEMICS",
    items: [
      { title: "Wanafunzi", href: "/dashboard/students", icon: GraduationCap },
      { title: "Walimu", href: "/dashboard/teachers", icon: Users },
      { title: "Masomo", href: "/dashboard/subjects", icon: BookOpen },
      { title: "Matokeo / Exams", href: "/dashboard/exams", icon: FileSpreadsheet },
    ],
  },
  {
    groupLabel: "SYSTEM",
    items: [
      { title: "Profile", href: "/dashboard/profile", icon: UserCircle },
      { title: "Mipangilio", href: "/dashboard/settings", icon: Settings },
    ],
  },
];