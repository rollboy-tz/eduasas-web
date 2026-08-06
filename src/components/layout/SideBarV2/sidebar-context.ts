"use client";

/**
 * ============================================================================
 * EduAsas Sidebar V2 - Context
 * ============================================================================
 *
 * React Context contract ya Sidebar V2.
 *
 * Responsibilities:
 *
 * - Kutoa Sidebar state kwa components.
 * - Kutoa Sidebar actions API.
 * - Kutoa safe fallback wakati Provider haijapatikana.
 *
 * Haina:
 *
 * - Reducer logic.
 * - State mutations.
 * - UI rendering.
 *
 * @version 2.3.0
 */

import {
    createContext,
} from "react";


import type {
    SidebarContextType,
} from "./sidebar.types";





/* ============================================================================
 * Safe Fallback Actions
 * ============================================================================
 */


const noop = (): void => {};






/* ============================================================================
 * Default Context
 * ============================================================================
 */


export const defaultSidebarContext: SidebarContextType = {


    /* ------------------------------------------------------------------------
     * Core State
     * --------------------------------------------------------------------- */


    device: "desktop",


    variant: "docked",


    size: "expanded",


    isOpen: true,


    /**
     * Tablet restore memory.
     *
     * Hakuna previous layout
     * wakati app inaanza.
     */
    previousLayout: undefined,


    hoverExpanded: false,


    animating: false,






    /* ------------------------------------------------------------------------
     * Device Helpers
     * --------------------------------------------------------------------- */


    isMobile: false,


    isTablet: false,


    isDesktop: true,







    /* ------------------------------------------------------------------------
     * Actions
     * --------------------------------------------------------------------- */


    setVariant: noop,


    setSize: noop,


    open: noop,


    close: noop,


    toggle: noop,


    setHoverExpanded: noop,


};






/* ============================================================================
 * Context
 * ============================================================================
 */


export const SidebarContext =
    createContext<SidebarContextType>(
        defaultSidebarContext,
    );