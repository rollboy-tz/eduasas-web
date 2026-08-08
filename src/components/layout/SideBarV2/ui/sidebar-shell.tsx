/**
 * ============================================================================
 * EduAsas Sidebar V2 - Sidebar Shell
 * ============================================================================
 *
 * Visual container ya Sidebar V2.
 *
 * Responsibilities:
 *
 * - Positioning
 * - Width handling
 * - Docked/Floating rendering
 * - Responsive visibility
 * - Animation
 *
 * Haitawali:
 *
 * - State mutations
 * - Navigation
 * - Permissions
 *
 * @version 2.1.0
 */


"use client";


import type {
    ReactNode,
} from "react";


import {
    cn,
} from "@/lib/utils";


import {
    SIDEBAR_WIDTH,
} from "../sidebar-rules";


import {
    useSidebar,
} from "../use-sidebar";





interface SidebarShellProps {


    children: ReactNode;


    className?: string;

}







export function SidebarShell({

    children,

    className,

}: SidebarShellProps) {


    const {

        device,

        variant,

        size,

        isOpen,

    } = useSidebar();


    const isDocked =
        variant === "docked";



    const isFloating =
        variant === "floating";


    const width =
        size === "expanded"

            ? SIDEBAR_WIDTH.expanded

            : SIDEBAR_WIDTH.minimal;

    const shouldHide =
        device === "mobile" &&
        isFloating &&
        !isOpen;



    return (


        <aside

            style={{
                width: width
            }}
            className={cn(

                "z-50",

                /**
                 * Animation
                 */
                "transition-[width,transform]",

                "duration-300",

                "ease-out",


                /**
                 * Structure
                 */
                "overflow-hidden",

                "flex",

                "flex-col",




                /**
                 * Premium surface
                 */
                "border",

                "border-black/5",

                "dark:border-white/10",

                "bg-background/80",

                "backdrop-blur-xl",

                /**
                 * Docked Card
                 *
                 * Layout bado inasukumwa,
                 * lakini visual ni card.
                 */
                isDocked && [
                    "fixed",
                    "left-0",
                    "border-r",
                    "inset-y-0",
                    "border-border"
                ],

                /**
                 * Floating Card
                 */
                isFloating && [

                    "fixed",

                    "left-3",

                    "top-2",

                    "bottom-2",

                    "rounded-xl",

                    "shadow-2xl",

                    "bg-white",


                ],

                /**
                 * Mobile drawer
                 */
                shouldHide && [

                    "-translate-x-[120%]",
                ],



                /**
                 * Mobile safety
                 */
                device === "mobile" && [


                    "max-w-[calc(100vw-32px)]",


                ],





                className,


            )}


        >



            <div


                className="

                    flex

                    h-full

                    min-h-0

                    flex-col

                "


            >

                {children}


            </div>



        </aside>


    );

}