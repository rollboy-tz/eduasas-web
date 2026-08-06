/**
 * ============================================================================
 * EduAsas Sidebar V2 - Sidebar Tooltip
 * ============================================================================
 *
 * Tooltip ya Sidebar minimal mode.
 *
 * Responsibilities:
 *
 * - Kuonyesha label wakati sidebar iko compact.
 * - Hover information.
 * - Visual presentation.
 *
 * Haitawali:
 *
 * - Sidebar state.
 * - Navigation.
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






interface SidebarTooltipProps {


    children: ReactNode;


    label: string;


}







export function SidebarTooltip({

    children,

    label,

}: SidebarTooltipProps) {



    return (

        <div

            className="
                group
                relative
                flex
            "

        >


            {children}





            <div

                className={cn(

                    "pointer-events-none",

                    "absolute",

                    "left-full",

                    "ml-3",

                    "top-1/2",

                    "-translate-y-1/2",



                    "z-[100]",



                    "whitespace-nowrap",



                    "rounded-lg",



                    "border",

                    "border-border",



                    "bg-background/95",



                    "px-3",

                    "py-2",



                    "text-xs",

                    "font-medium",



                    "text-foreground",



                    "shadow-lg",



                    "backdrop-blur-xl",



                    "opacity-0",

                    "translate-x-1",



                    "transition-all",

                    "duration-200",



                    "group-hover:opacity-100",

                    "group-hover:translate-x-0",

                )}

            >

                {label}

            </div>



        </div>

    );

}