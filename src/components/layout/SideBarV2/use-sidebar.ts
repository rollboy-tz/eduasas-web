/**
 * ============================================================================
 * EduAsas Sidebar V2 - Hook
 * ============================================================================
 *
 * Custom hook ya kupata Sidebar Context.
 *
 * Hook hii ndiyo njia rasmi ya kuwasiliana na Sidebar V2
 * kutoka kwenye React components.
 *
 * Benefits:
 *
 * - Inazuia matumizi ya Context moja kwa moja.
 * - Ina error protection.
 * - Inatoa API safi kwa developers.
 *
 * @version 2.0.0
 */

"use client";


import {
  useContext,
} from "react";


import {
  SidebarContext,
} from "./sidebar-context";


import type {
  SidebarContextType,
} from "./sidebar.types";



/**
 * Hutumia Sidebar state na actions.
 *
 * @returns SidebarContextType
 *
 * @throws Error ikiwa hook inatumika nje ya SidebarProvider.
 *
 * @example
 * ```tsx
 * function SidebarButton(){
 *
 *   const {
 *      toggle,
 *      isOpen
 *   } = useSidebar();
 *
 *   return (
 *      <button onClick={toggle}>
 *          {isOpen ? "Close" : "Open"}
 *      </button>
 *   );
 * }
 * ```
 */
export function useSidebar(): SidebarContextType {


  const context =
    useContext(
      SidebarContext,
    );


  if (!context) {

    throw new Error(
      "useSidebar must be used inside SidebarProvider",
    );

  }


  return context;

}