/**
 * ============================================================================
 * EduAsas Sidebar V2 - Sidebar Navigation
 * ============================================================================
 *
 * Container kuu ya sidebar navigation area.
 *
 * Responsibilities:
 *
 * - Kushikilia sidebar groups.
 * - Kusimamia vertical spacing.
 * - Scroll behavior.
 * - Responsive padding kulingana na sidebar size.
 *
 * Haitawali:
 *
 * - Menu data.
 * - Active state.
 * - Routing.
 * - Permissions.
 * - Sidebar mutations.
 *
 * @version 2.3.0
 */


"use client";


import type {
    ReactNode,
} from "react";


import {
    cn,
} from "@/lib/utils";


import {
    useSidebar,
} from "../use-sidebar";





interface SidebarNavigationProps {


    /**
     * Navigation content.
     */
    children: ReactNode;



    /**
     * Extra classes.
     */
    className?: string;

}







export function SidebarNavigation({

    children,

    className,

}: SidebarNavigationProps) {



    const {

        size,

    } = useSidebar();





    const isMinimal =
        size === "minimal";






    return (


        <nav


            className={cn(



                /**
                 * Layout
                 */
                "flex",

                "flex-1",

                "min-h-0",

                "flex-col",





                /**
                 * Scroll
                 */
                "overflow-y-auto",

                "overscroll-contain",

                "scrollbar-thin",





                /**
                 * Smooth transition
                 */
                "transition-[padding]",

                "duration-300",

                "ease-out",





                /**
                 * Spacing
                 */
                isMinimal

                    ? [

                        "px-2",

                        "py-3",

                        "gap-2",

                    ]

                    : [

                        "px-3",

                        "py-4",

                        "gap-3",

                    ],





                className,

            )}

        >


            {children}


        </nav>


    );

}