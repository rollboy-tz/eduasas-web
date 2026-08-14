/**
 * ============================================================================
 * EduAsas Sidebar V2 - Sidebar Header
 * ============================================================================
 *
 * Header ya Sidebar.
 *
 * Responsibilities:
 *
 * - Brand presentation.
 * - Workspace identity.
 * - Responsive appearance.
 *
 * Haitawali:
 *
 * - Sidebar state mutation.
 * - Navigation.
 * - Permissions.
 *
 * @version 2.2.0
 */

"use client";


import {
    SidebarIcon,
    SidebarClose
} from "lucide-react";


import {
    cn,
} from "@/lib/utils";


import {
    useSidebar,
} from "../use-sidebar";

import {
    EduAsasLogo
} from "@/components/ui";



interface SidebarHeaderProps {

    /**
     * Brand title.
     */
    title?: string;


    /**
     * Optional subtitle.
     */
    subtitle?: string;


    /**
     * Custom class.
     */
    className?: string;

}







export function SidebarHeader({

    className,

}: SidebarHeaderProps) {



    const {

        size,
        isDesktop,
        isTablet,
        isMobile,

        variant,
        isOpen,

        setSize,
        open,
        close,

    } = useSidebar();





    const isMinimal =
        size === "minimal";


    const handleClick = () => {

        /**
         * Desktop
         *
         * expanded <-> minimal
         */
        if (isDesktop) {
            setSize(
                size === "expanded"
                    ? "minimal"
                    : "expanded"
            );

            return;
        }

        /**
         * Tablet
         *
         * docked -> floating
         * floating -> restore
         */
        if (isTablet) {
            if (variant === "floating") {
                close();
            } else {
                open();
            }

            return;
        }

        /**
         * Mobile
         *
         * drawer
         */
        if (isMobile) {
            isOpen
                ? close()
                : open();
        }
    };

    return (

        <header

            className={cn(
                "group",

                "flex",

                "py-2",

                "shrink-0",

                "items-center",

                "transition-all",

                "duration-300",



                isMinimal

                    ? [

                        "justify-center",

                        "px-2",

                    ]

                    : [

                        "gap-3",

                        "px-4",

                    ],



                className,

            )}

        >
            <>

                {
                    isMinimal ? (
                        // Wen sidebar is minimal when mouse is over header
                        
                        <div className="flex">
                            <EduAsasLogo className="group-hover:hidden" titleHiden={true}/>
                            <button className="hidden group-hover:flex rounded-md p-1 hover:bg-muted-200 transition-all cursor-pointer duration-300"
                            onClick={handleClick}>
                                <SidebarIcon size={19} className="text-muted-800"/>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between w-full">
                            <EduAsasLogo titleClasses="font-heading font-black" />
                            <button className="rounded-md p-1 hover:bg-muted-200 transition-all cursor-pointer duration-300"
                            onClick={handleClick}>
                                <SidebarIcon size={19} className="text-muted-800"/>
                            </button>
                        </div>
                    )
                }


            </>

        </header>

    );

}