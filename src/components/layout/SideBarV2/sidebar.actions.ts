import type { Dispatch } from "react";
import type { SidebarReducerAction } from "./sidebar.reducer";
import type {
  SidebarDevice,
  SidebarVariant,
  SidebarSize,
} from "./sidebar.types";

/**
 * ============================================================================
 * EduAsas Sidebar V2 - Actions
 * ============================================================================
 *
 * Action creators za Sidebar V2.
 *
 * Faili hili linaficha implementation details za dispatch actions
 * kutoka kwenye UI components.
 *
 * Faida:
 * - Components hazina haja ya kujua action types za ndani.
 * - Refactoring inakuwa rahisi bila kuathiri components zote.
 * - API ya Sidebar inakuwa wazi na rahisi kuisoma (Readable API).
 *
 * @version 2.0.0
 */

/* ============================================================================
 * Sidebar Action Creators
 * ========================================================================== */

/**
 * Fungua Sidebar.
 *
 * @param dispatch Sidebar reducer dispatch function
 *
 * @example
 * openSidebar(dispatch);
 */
export function openSidebar(dispatch: Dispatch<SidebarReducerAction>): void {
  dispatch({ type: "OPEN" });
}

/**
 * Funga Sidebar.
 *
 * @param dispatch Sidebar reducer dispatch function
 *
 * @example
 * closeSidebar(dispatch);
 */
export function closeSidebar(dispatch: Dispatch<SidebarReducerAction>): void {
  dispatch({ type: "CLOSE" });
}

/**
 * Toggle Sidebar kati ya open na closed.
 *
 * @param dispatch Sidebar reducer dispatch function
 */
export function toggleSidebar(dispatch: Dispatch<SidebarReducerAction>): void {
  dispatch({ type: "TOGGLE" });
}

/**
 * Badilisha device ya Sidebar.
 *
 * @param dispatch Sidebar reducer dispatch function
 * @param device Device mpya (desktop | tablet | mobile)
 */
export function setSidebarDevice(
  dispatch: Dispatch<SidebarReducerAction>,
  device: SidebarDevice
): void {
  dispatch({
    type: "SET_DEVICE",
    payload: device,
  });
}

/**
 * Badilisha variant ya Sidebar.
 *
 * @param dispatch Sidebar reducer dispatch function
 * @param variant Variant mpya (docked | floating)
 *
 * @example
 * setSidebarVariant(dispatch, "floating");
 */
export function setSidebarVariant(
  dispatch: Dispatch<SidebarReducerAction>,
  variant: SidebarVariant
): void {
  dispatch({
    type: "SET_VARIANT",
    payload: variant,
  });
}

/**
 * Badilisha ukubwa wa Sidebar.
 *
 * @param dispatch Sidebar reducer dispatch function
 * @param size Sidebar size mpya (expanded | minimal)
 *
 * @example
 * setSidebarSize(dispatch, "minimal");
 */
export function setSidebarSize(
  dispatch: Dispatch<SidebarReducerAction>,
  size: SidebarSize
): void {
  dispatch({
    type: "SET_SIZE",
    payload: size,
  });
}

/**
 * Weka hover expansion state.
 *
 * Hutumika kwa tabia kama: minimal sidebar + hover = expand temporarily.
 *
 * @param dispatch Sidebar reducer dispatch function
 * @param expanded Hover state
 */
export function setSidebarHoverExpanded(
  dispatch: Dispatch<SidebarReducerAction>,
  expanded: boolean
): void {
  dispatch({
    type: "SET_HOVER_EXPANDED",
    payload: expanded,
  });
}

/**
 * Weka user collapse preference.
 *
 * @param dispatch Sidebar reducer dispatch function
 * @param collapsed Ikiwa mteja/mtumiaji amecollapse
 */
export function setSidebarCollapsedByUser(
  dispatch: Dispatch<SidebarReducerAction>,
  collapsed: boolean
): void {
  dispatch({
    type: "SET_COLLAPSED_BY_USER",
    payload: collapsed,
  });
}

/**
 * Anzisha animation state.
 *
 * @param dispatch Sidebar reducer dispatch function
 */
export function startSidebarAnimation(
  dispatch: Dispatch<SidebarReducerAction>
): void {
  dispatch({ type: "START_ANIMATION" });
}

/**
 * Maliza animation state.
 *
 * @param dispatch Sidebar reducer dispatch function
 */
export function stopSidebarAnimation(
  dispatch: Dispatch<SidebarReducerAction>
): void {
  dispatch({ type: "STOP_ANIMATION" });
}