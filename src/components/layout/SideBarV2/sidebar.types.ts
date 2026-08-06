/**
 * ============================================================================
 * EduAsas Sidebar V2 Types
 * ============================================================================
 *
 * Chanzo rasmi cha types, interfaces na contracts za Sidebar V2.
 *
 * File hili halina business logic.
 * Linafafanua data structures zinazotumiwa na:
 *
 * - Provider
 * - Reducer
 * - Hooks
 * - UI Components
 *
 * @author EduAsas
 * @version 2.3.0
 */


import type {
    ReactNode,
    ElementType,
} from "react";





/* ============================================================================
 * Devices
 * ============================================================================
 */


export type SidebarDevice =
    | "mobile"
    | "tablet"
    | "desktop";






/* ============================================================================
 * Variant
 * ============================================================================
 */


export type SidebarVariant =
    | "docked"
    | "floating";






/* ============================================================================
 * Size
 * ============================================================================
 */


export type SidebarSize =
    | "expanded"
    | "minimal";







/* ============================================================================
 * Previous Layout Memory
 * ============================================================================
 */


/**
 * Hifadhi state ya nyuma kabla ya temporary transition.
 *
 * Hutumika zaidi kwenye tablet:
 *
 * minimal + docked
 *        ↓
 * expanded + floating
 *        ↓
 * restore
 *        ↓
 * minimal + docked
 */
export interface SidebarPreviousLayout {


    size: SidebarSize;


    variant: SidebarVariant;


    isOpen: boolean;


}








/* ============================================================================
 * Sidebar State
 * ============================================================================
 */


/**
 * Runtime state ya Sidebar.
 */
export interface SidebarState {



    /**
     * Device ya sasa.
     */
    device: SidebarDevice;





    /**
     * Presentation mode.
     */
    variant: SidebarVariant;





    /**
     * Width mode.
     */
    size: SidebarSize;





    /**
     * Visibility state.
     */
    isOpen: boolean;





    /**
     * Previous stable state.
     *
     * Optional kwa sababu:
     *
     * - Initial mount haina history.
     * - Desktop haitumii restore.
     */
    previousLayout?: SidebarPreviousLayout;





    /**
     * Hover expansion.
     */
    hoverExpanded: boolean;





    /**
     * Animation state.
     */
    animating: boolean;


}







/* ============================================================================
 * Actions
 * ============================================================================
 */


/**
 * Public Sidebar API.
 */
export interface SidebarActions {



    /**
     * Change sidebar variant.
     */
    setVariant(
        variant: SidebarVariant
    ): void;





    /**
     * Change sidebar size.
     */
    setSize(
        size: SidebarSize
    ): void;





    /**
     * Open sidebar.
     */
    open(): void;





    /**
     * Close sidebar.
     */
    close(): void;





    /**
     * Toggle sidebar.
     */
    toggle(): void;





    /**
     * Hover expansion.
     */
    setHoverExpanded(
        expanded: boolean
    ): void;


}








/* ============================================================================
 * Context
 * ============================================================================
 */


/**
 * Contract ya useSidebar().
 */
export interface SidebarContextType
    extends SidebarState,
        SidebarActions {



    /**
     * Device helpers.
     */
    isMobile: boolean;


    isTablet: boolean;


    isDesktop: boolean;


}







/* ============================================================================
 * Provider
 * ============================================================================
 */


export interface SidebarProviderProps {


    children: ReactNode;


}








/* ============================================================================
 * Navigation
 * ============================================================================
 */


/**
 * Sidebar navigation item.
 */
export interface SidebarMenuItem {


    /**
     * Menu label.
     */
    label: string;





    /**
     * Icon component.
     */
    icon: ElementType;





    /**
     * Route.
     */
    href?: string;





    /**
     * Disabled state.
     */
    disabled?: boolean;





    /**
     * Nested children.
     */
    children?: SidebarMenuItem[];





    /**
     * Optional badge.
     */
    badge?: string | number;


}