// dashboard/page.tsx au kule unakopitisha sidebarContent
export const myMenu = [
    {
        label: "Main Menu",
        items: [
            { title: "Home", icon: "Home", href: "/home" },
            { title: "Dashboard", icon: "LayoutDashboard", href: "/dashboard" },
            { title: "Messages", icon: "MessageSquare", href: "/messages", badge: 5 }
        ]
    },
    {
        label: "Academics",
        items: [
            {
                title: "Students",
                icon: "Users",
                items: [
                    { title: "All Students", href: "/students/list" },
                    { title: "Admission", href: "/students/admission" }
                ]
            },
            { title: "Library", icon: "BookOpen", href: "/library" }
        ]
    }
];