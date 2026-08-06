/**
 * ============================================================================
 * EduAsas Sidebar V2 Rules
 * ============================================================================
 *
 * Source of truth ya Sidebar V2 behavior.
 *
 * Rules zinategemea:
 *
 * - Device
 * - Size
 * - Variant resolution
 *
 * Provider na UI hazitunzi business logic.
 *
 * @author EduAsas
 * @version 2.0.0
 */


import type {
    SidebarDevice,
    SidebarVariant,
    SidebarSize,
} from "./sidebar.types";



/* ============================================================================
 * Widths
 * ========================================================================== */


export const SIDEBAR_WIDTH = {


    expanded: 280,


    minimal: 84,


} as const;





/* ============================================================================
 * Device Rules
 * ========================================================================== */


export interface SidebarDeviceRule {


    defaultVariant: SidebarVariant;


    defaultSize: SidebarSize;


    defaultOpen: boolean;


    allowedVariants: readonly SidebarVariant[];


    allowedSizes: readonly SidebarSize[];


}




/**
 * Sidebar behavior source of truth.
 */
export const SIDEBAR_RULES: Record<
    SidebarDevice,
    SidebarDeviceRule
> = {


    /**
     * Desktop
     *
     * Sidebar always occupies layout space.
     */
    desktop: {

        defaultVariant: "docked",

        defaultSize: "expanded",

        defaultOpen: true,


        allowedVariants: [

            "docked",

        ],


        allowedSizes: [

            "expanded",

            "minimal",

        ],

    },




    /**
     * Tablet
     *
     * Minimal:
     * - docked
     *
     * Expanded:
     * - floating
     */
    tablet: {


        defaultVariant: "docked",


        defaultSize: "minimal",


        defaultOpen: true,


        allowedVariants: [

            "docked",

            "floating",

        ],


        allowedSizes: [

            "minimal",

            "expanded",

        ],


    },




    /**
     * Mobile
     *
     * Drawer only.
     */
    mobile: {


        defaultVariant: "floating",


        defaultSize: "expanded",


        defaultOpen: false,


        allowedVariants: [

            "floating",

        ],


        allowedSizes: [

            "expanded",

        ],


    },


} as const;






/* ============================================================================
 * Basic Helpers
 * ========================================================================== */


export function getSidebarRules(
    device: SidebarDevice,
): SidebarDeviceRule {


    return SIDEBAR_RULES[device];

}





export function resolveSidebarSize(
    device: SidebarDevice,
): SidebarSize {


    return SIDEBAR_RULES[device]
        .defaultSize;

}





/**
 * Resolve variant kulingana na device + size.
 *
 * HII NDIYO LOGIC KUU.
 */
export function resolveSidebarVariant(

    device: SidebarDevice,

    size: SidebarSize,

): SidebarVariant {



    switch(device) {



        case "mobile":

            return "floating";




        case "tablet":

            return size === "expanded"

                ? "floating"

                : "docked";





        case "desktop":

        default:

            return "docked";


    }

}






/**
 * Check kama size inaruhusiwa.
 */
export function isSizeAllowed(

    device: SidebarDevice,

    size: SidebarSize,

): boolean {


    return SIDEBAR_RULES[device]
        .allowedSizes
        .includes(size);


}






/**
 * Check variant manually.
 */
export function isVariantAllowed(

    device: SidebarDevice,

    variant: SidebarVariant,

): boolean {


    return SIDEBAR_RULES[device]
        .allowedVariants
        .includes(variant);


}






/**
 * Resolve state kamili baada ya size/device change.
 */
export function resolveSidebarState(

    device: SidebarDevice,

    size: SidebarSize,

) {


    return {


        device,


        size,


        variant:
            resolveSidebarVariant(
                device,
                size,
            ),


    };


}






/**
 * Je sidebar isukume main content?
 *
 * Push:
 * - Desktop docked
 * - Tablet minimal docked
 *
 * Overlay:
 * - Floating sidebar
 * - Mobile drawer
 */
export function shouldPushContent(

    device: SidebarDevice,

    size: SidebarSize,

    variant: SidebarVariant,

): boolean {


    /**
     * Floating haiwezi kusukuma content.
     */
    if (variant === "floating") {

        return false;

    }



    /**
     * Mobile ni drawer kila wakati.
     */
    if (device === "mobile") {

        return false;

    }



    /**
     * Docked desktop/tablet minimal
     * inashikilia nafasi.
     */
    return true;

}






/**
 * Width resolver.
 */
export function getSidebarWidth(

    size: SidebarSize,

): number {


    return SIDEBAR_WIDTH[size];

}