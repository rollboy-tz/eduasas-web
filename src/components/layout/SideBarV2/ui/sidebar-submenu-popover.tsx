"use client";

/**
 * ============================================================================
 * EduAsas Sidebar V2 - Submenu Popover
 * ============================================================================
 *
 * Popover ya submenu wakati sidebar iko kwenye minimal mode.
 *
 * Responsibilities:
 *
 * - Kuonyesha children za collapsible item.
 * - Ku-position pembeni ya sidebar.
 * - Kuonyesha active state.
 *
 * Haina:
 *
 * - Sidebar state.
 * - Device logic.
 * - Navigation logic.
 *
 * @version 2.2.0
 */


import Link from "next/link";


import {
    cn,
} from "@/lib/utils";


import type {
    SidebarChild,
} from "./sidebar-collapsible";





interface SidebarSubmenuPopoverProps {


    /**
     * Title ya parent menu.
     */
    title:string;



    /**
     * Sub items.
     */
    items:SidebarChild[];



    /**
     * Current route.
     */
    currentPath?:string;



    /**
     * Close callback.
     */
    onClose?:()=>void;


}







export function SidebarSubmenuPopover({

    title,

    items,

    currentPath = "",

    onClose,

}:SidebarSubmenuPopoverProps){



    return (


        <div


            className={cn(

                "absolute",

                "left-full",

                "top-0",

                "ml-3",


                "w-56",


                "rounded-2xl",


                "border",

                "border-border",


                "bg-background/95",


                "backdrop-blur-xl",


                "shadow-xl",


                "p-3",


                "z-50",


                "animate-in",

                "fade-in",

                "zoom-in-95",

                "duration-200",

            )}

        >




            {/* Header */}

            <div

                className="
                    px-3
                    py-2
                    mb-2
                    text-xs
                    font-semibold
                    text-muted-foreground
                    uppercase
                    tracking-wide
                "

            >

                {title}

            </div>





            {/* Items */}

            <div

                className="
                    space-y-1
                "

            >

                {items.map((item)=>{


                    const active =
                        currentPath === item.href ||
                        currentPath.startsWith(
                            `${item.href}/`
                        );



                    return (

                        <Link


                            key={item.href}


                            href={item.href}


                            onClick={onClose}



                            className={cn(


                                "flex",

                                "items-center",

                                "h-9",


                                "px-3",


                                "rounded-xl",


                                "text-sm",


                                "transition-colors",



                                active

                                    ? [

                                        "bg-primary",

                                        "text-primary-foreground",

                                    ]

                                    : [

                                        "text-muted-foreground",

                                        "hover:bg-muted",

                                        "hover:text-foreground",

                                    ],


                            )}


                        >

                            {item.title}


                        </Link>

                    );

                })}

            </div>


        </div>


    );

}