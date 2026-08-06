"use client";

/**
 * ============================================================================
 * EduAsas Sidebar V2 - Dynamic Icon
 * ============================================================================
 *
 * Dynamic icon renderer kwa Sidebar menu configuration.
 *
 * Responsibilities:
 *
 * - Kupokea jina la icon.
 * - Ku-render icon kutoka lucide-react.
 * - Kutoa fallback icon ikiwa haipo.
 *
 * Haina:
 *
 * - Sidebar state
 * - Context dependency
 * - Navigation logic
 *
 * @version 2.2.0
 */

import * as Icons from "lucide-react";

import type {
    ElementType,
} from "react";




interface SidebarDynamicIconProps {


    /**
     * Jina la icon kutoka lucide-react.
     *
     * Mfano:
     *
     * "Home"
     * "Users"
     * "Settings"
     */
    name: string;



    /**
     * Icon size.
     */
    size?: number;



    /**
     * Tailwind classes.
     */
    className?: string;



    /**
     * Stroke width ya icon.
     */
    strokeWidth?: number;

}






export function SidebarDynamicIcon({

    name,

    size = 20,

    className,

    strokeWidth = 2,

}: SidebarDynamicIconProps) {



    const IconComponent =
        (
            Icons as unknown as Record<
                string,
                ElementType
            >
        )[name];





    const Icon =
        IconComponent ?? Icons.HelpCircle;





    return (

        <Icon

            size={size}

            strokeWidth={strokeWidth}

            className={className}

            aria-hidden="true"

        />

    );

}