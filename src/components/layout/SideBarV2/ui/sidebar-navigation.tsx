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

                "custom-scrollbar",





                /**
                 * Smooth transition
                 */
                "transition-[padding]",

                "duration-300",

                "ease-out",

                className,

            )}

        >


            {children}


        </nav>


    );

}