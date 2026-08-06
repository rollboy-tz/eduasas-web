/**
 * ============================================================================
 * EduAsas Sidebar V2 - Sidebar Overlay
 * ============================================================================
 *
 * Overlay layer kwa Sidebar floating mode.
 *
 * Responsibilities:
 *
 * - Kufunika content wakati floating sidebar iko wazi.
 * - Kutoa blur effect nyepesi.
 * - Kuruhusu close kwa kubonyeza nje.
 *
 * Haitawali:
 *
 * - Sidebar state
 * - Device detection
 *
 * Hiyo inasimamiwa na Sidebar Provider.
 *
 * @version 2.0.0
 */


"use client";


import {
    cn,
} from "@/lib/utils";


import {
    useSidebar,
} from "../use-sidebar";




interface SidebarOverlayProps {

    className?: string;

}





export function SidebarOverlay({

    className,

}: SidebarOverlayProps) {



    const {

        isOpen,

        variant,

        isMobile,

        isTablet,

        close,

    } = useSidebar();




    /**
     * Overlay inahitajika tu
     * kwa floating sidebar.
     */
    const shouldShow =

        isOpen &&

        variant === "floating" &&

        (
            isMobile ||
            isTablet
        );





    if (!shouldShow) {

        return null;

    }





    return (


        <button

            type="button"

            aria-label="Close sidebar overlay"


            onClick={close}



            className={cn(

                "fixed",

                "inset-0",

                "z-50",



                /**
                 * Minimal Apple style
                 */
                "bg-black/5",

                "backdrop-blur-sm",



                "transition-opacity",

                "duration-300",



                className,

            )}

        />

    );

}