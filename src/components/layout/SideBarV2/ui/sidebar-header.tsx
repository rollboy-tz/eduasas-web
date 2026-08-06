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
    Building2,
} from "lucide-react";


import {
    cn,
} from "@/lib/utils";


import {
    useSidebar,
} from "../use-sidebar";





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

    title = "EduAsas",

    subtitle = "Workspace",

    className,

}: SidebarHeaderProps) {



    const {

        size,

    } = useSidebar();





    const isMinimal =
        size === "minimal";





    return (

        <header

            className={cn(

                "flex",

                "h-16",

                "items-center",

                "border-b",

                "border-border/50",

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





            {/* Logo Container */}

            <div

                className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-primary/10
                    text-primary
                "

            >

                <Building2

                    size={22}

                    strokeWidth={2}

                />

            </div>







            {/* Brand Text */}

            {!isMinimal && (

                <div

                    className="
                        flex
                        min-w-0
                        flex-col
                    "

                >

                    <span

                        className="
                            truncate
                            text-sm
                            font-semibold
                            tracking-tight
                        "

                    >

                        {title}

                    </span>



                    <span

                        className="
                            truncate
                            text-xs
                            text-muted-foreground
                        "

                    >

                        {subtitle}

                    </span>


                </div>

            )}





        </header>

    );

}