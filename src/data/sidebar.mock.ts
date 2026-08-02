import { MenuGroup } from "@/components/layout/sidebar/sidebar-composer";


export const sidebarMockData: MenuGroup[] = [

  {
    label: "MAIN",

    items: [

      {
        title: "Overview",
        href: "/overview",
        icon: "Layout",
      },


      {
        title: "Students",
        href: "/students",
        icon: "GraduationCap",
        badge: 1250,
      },


      {
        title: "Teachers",
        href: "/teachers",
        icon: "Users",
        badge: 86,
      },

    ],
  },



  {
    label: "ACADEMIC",

    items: [

      {
        title: "Academics",
        icon: "BookOpen",

        items: [

          {
            title:"Classes",
            href:"/academics/classes"
          },


          {
            title:"Subjects",
            href:"/academics/subjects"
          },


          {
            title:"Timetable",
            href:"/academics/timetable"
          },


          {
            title:"Examinations",
            href:"/academics/exams"
          },

        ]

      },




      {
        title:"Attendance",
        icon:"CalendarCheck",
        href:"/attendance",
      },



      {
        title:"Results",
        icon:"ChartNoAxesColumn",
        href:"/results",
      },

    ]

  },






  {
    label:"FINANCE",

    items:[


      {
        title:"Finance",
        icon:"WalletCards",

        items:[

          {
            title:"Fees Collection",
            href:"/finance/fees"
          },


          {
            title:"Payments",
            href:"/finance/payments"
          },


          {
            title:"Invoices",
            href:"/finance/invoices"
          },


        ]

      },




      {
        title:"Reports",
        href:"/reports",
        icon:"FileBarChart",
      }


    ]

  },






  {
    label:"SYSTEM",

    items:[


      {
        title:"Users & Roles",
        href:"/settings/users",
        icon:"ShieldCheck",
      },


      {
        title:"Settings",
        href:"/settings",
        icon:"Settings",
      },


      {
        title:"Help Center",
        href:"/help",
        icon:"CircleHelp",
      }


    ]

  }


];