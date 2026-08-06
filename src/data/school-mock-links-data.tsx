import { Users } from "lucide-react";
import { MenuGroup } from "../components/layout/sidebar/sidebar-composer";

export const SchoolMockSidebar: MenuGroup[] = [
  {
    label: "MAIN",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: "Layout",
      }
    ],
  },

  {
    label: "ACADEMIC",
    items: [
      {
        title: "Classes",
        href: "/classes",
        icon: "School",
      },
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
        title: "Members",
        icon: "Users",
        items: [
          {
            title: "Staff",
            href: "/members/members"
          },
          {
            title: "Invitations",
            href: "/members/invitations"
          }
        ]
      }
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