import { MenuGroup } from "../components/layout/sidebar/sidebar-composer";

export const mockSidebar: MenuGroup[] = [
  {
    label: "MAIN",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: "LayoutDashboard",
      },
      {
        title: "Notifications",
        href: "/notifications",
        icon: "Bell",
        badge: 5,
      },
    ],
  },

  {
    label: "ACADEMIC",
    items: [
      {
        title: "Students",
        icon: "Users",
        items: [
          {
            title: "All Students",
            href: "/students",
          },
          {
            title: "Add Student",
            href: "/students/create",
          },
        ],
      },
      {
        title: "Classes",
        href: "/classes",
        icon: "School",
      },
    ],
  },

  {
    label: "SYSTEM",
    items: [
      {
        title: "Settings",
        href: "/settings",
        icon: "Settings",
      },
    ],
  },
];