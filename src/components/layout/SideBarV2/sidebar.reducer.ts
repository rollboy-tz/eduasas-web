/**
 * ============================================================================
 * EduAsas Sidebar V2 - Reducer
 * ============================================================================
 *
 * Central state machine ya Sidebar V2.
 *
 * Inasimamia:
 *
 * - Device transitions
 * - Responsive layout memory
 * - Open / close behavior
 * - Size + variant synchronization
 *
 * Reducer haina business decisions.
 * Provider ndiyo inaamua lini kubadilisha layout.
 *
 * @version 2.3.0
 */


import type {
    SidebarDevice,
    SidebarVariant,
    SidebarSize,
} from "./sidebar.types";






/* ============================================================================
 * State
 * ============================================================================
 */


export interface SidebarReducerState {


    device: SidebarDevice;


    variant: SidebarVariant;


    size: SidebarSize;


    isOpen: boolean;




    /**
     * Last stable layout.
     *
     * Hutumika hasa Tablet restore.
     */
    previousSize: SidebarSize;


    previousVariant: SidebarVariant;


    previousOpen: boolean;




    hoverExpanded: boolean;


    animating: boolean;

}








/* ============================================================================
 * Actions
 * ============================================================================
 */


export type SidebarReducerAction =



    | {
        type: "RESET_FOR_DEVICE";

        payload: {

            device: SidebarDevice;

            size: SidebarSize;

            variant: SidebarVariant;

            isOpen: boolean;

        };

    }





    /**
     * Change sidebar presentation.
     */
    | {
        type:"SET_LAYOUT";

        payload:{
            size:SidebarSize;

            variant:SidebarVariant;
        };

    }





    /**
     * Save current layout
     * before temporary transition.
     */
    | {
        type:"SAVE_PREVIOUS_LAYOUT";
    }





    | {
        type:"OPEN";
    }





    | {
        type:"CLOSE";
    }





    | {
        type:"RESTORE_PREVIOUS";
    }





    | {
        type:"SET_HOVER_EXPANDED";

        payload:boolean;

    }





    | {
        type:"START_ANIMATION";
    }





    | {
        type:"STOP_ANIMATION";
    };









/* ============================================================================
 * Initial State
 * ============================================================================
 */


export const initialSidebarState:SidebarReducerState = {


    device:"desktop",


    variant:"docked",


    size:"expanded",


    isOpen:true,



    previousSize:"expanded",


    previousVariant:"docked",


    previousOpen:true,



    hoverExpanded:false,


    animating:false,

};









/* ============================================================================
 * Reducer
 * ============================================================================
 */


export function sidebarReducer(

    state:SidebarReducerState,

    action:SidebarReducerAction,

):SidebarReducerState {



    switch(action.type){





        /**
         * Device changed.
         */
        case "RESET_FOR_DEVICE":


            return {


                ...state,


                device:
                    action.payload.device,


                size:
                    action.payload.size,


                variant:
                    action.payload.variant,


                isOpen:
                    action.payload.isOpen,



                previousSize:
                    action.payload.size,


                previousVariant:
                    action.payload.variant,


                previousOpen:
                    action.payload.isOpen,



                hoverExpanded:false,


                animating:false,

            };









        /**
         * Pure layout change.
         */
        case "SET_LAYOUT":


            return {


                ...state,


                size:
                    action.payload.size,


                variant:
                    action.payload.variant,


            };









        /**
         * Store current stable layout.
         */
        case "SAVE_PREVIOUS_LAYOUT":


            return {


                ...state,


                previousSize:
                    state.size,


                previousVariant:
                    state.variant,


                previousOpen:
                    state.isOpen,

            };









        /**
         * Open.
         *
         * Provider decides when to call.
         */
        case "OPEN":


            return {


                ...state,


                isOpen:true,

            };









        /**
         * Close.
         *
         * Provider decides behavior.
         */
        case "CLOSE":


            return {


                ...state,


                isOpen:false,

            };









        /**
         * Restore previous layout.
         */
        case "RESTORE_PREVIOUS":


            return {


                ...state,


                size:
                    state.previousSize,


                variant:
                    state.previousVariant,


                isOpen:
                    state.previousOpen,

            };









        case "SET_HOVER_EXPANDED":


            return {


                ...state,


                hoverExpanded:
                    action.payload,

            };









        case "START_ANIMATION":


            return {


                ...state,


                animating:true,

            };









        case "STOP_ANIMATION":


            return {


                ...state,


                animating:false,

            };









        default:


            return state;

    }


}