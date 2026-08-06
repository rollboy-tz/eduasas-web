/**
 * ============================================================================
 * EduAsas Sidebar V2 - Provider
 * ============================================================================
 *
 * Provider kuu ya Sidebar V2.
 *
 * Responsibilities:
 *
 * - Kusimamia reducer state.
 * - Kutambua device.
 * - Ku-resolve responsive behavior.
 * - Kutoa Context API.
 *
 * Provider ndiyo inaamua:
 *
 * - Desktop behavior
 * - Tablet restore behavior
 * - Mobile drawer behavior
 *
 * @version 2.3.0
 */


"use client";


import {
    useEffect,
    useMemo,
    useReducer,
    useRef,
} from "react";


import {
    SidebarContext,
} from "./sidebar-context";


import {
    sidebarReducer,
    initialSidebarState,
} from "./sidebar.reducer";


import {
    getSidebarRules,
    isSizeAllowed,
    isVariantAllowed,
    resolveSidebarVariant,
} from "./sidebar-rules";


import type {
    SidebarContextType,
    SidebarDevice,
    SidebarProviderProps,
} from "./sidebar.types";







/* ============================================================================
 * Device Detector
 * ============================================================================
 */


function getDevice(): SidebarDevice {


    if(
        typeof window === "undefined"
    ){

        return "desktop";

    }



    const width =
        window.innerWidth;



    if(width < 640){

        return "mobile";

    }



    if(width < 1024){

        return "tablet";

    }



    return "desktop";

}









/* ============================================================================
 * Provider
 * ============================================================================
 */


export function SidebarProvider({

    children,

}:SidebarProviderProps){



    const [

        state,

        dispatch,

    ] = useReducer(

        sidebarReducer,

        initialSidebarState,

    );






    const previousDevice =
        useRef<SidebarDevice | null>(null);








    useEffect(()=>{


        const syncDevice = ()=>{


            const device =
                getDevice();




            if(
                previousDevice.current === device
            ){

                return;

            }




            previousDevice.current =
                device;





            const rules =
                getSidebarRules(device);





            const variant =
                resolveSidebarVariant(

                    device,

                    rules.defaultSize,

                );






            dispatch({

                type:"RESET_FOR_DEVICE",


                payload:{


                    device,


                    size:
                        rules.defaultSize,


                    variant,


                    isOpen:
                        rules.defaultOpen,


                },

            });



        };






        syncDevice();




        window.addEventListener(

            "resize",

            syncDevice,

        );





        return ()=>{


            window.removeEventListener(

                "resize",

                syncDevice,

            );


        };



    },[]);












    const contextValue =

        useMemo<SidebarContextType>(()=>({



            ...state,





            isMobile:
                state.device === "mobile",





            isTablet:
                state.device === "tablet",





            isDesktop:
                state.device === "desktop",











            /**
             * Manual variant change.
             */
            setVariant:(variant)=>{


                if(

                    !isVariantAllowed(

                        state.device,

                        variant,

                    )

                ){

                    return;

                }




                dispatch({

                    type:"SET_LAYOUT",


                    payload:{


                        size:
                            state.size,


                        variant,


                    },

                });



            },









            /**
             * Manual size change.
             */
            setSize:(size)=>{


                if(

                    !isSizeAllowed(

                        state.device,

                        size,

                    )

                ){

                    return;

                }




                const variant =

                    resolveSidebarVariant(

                        state.device,

                        size,

                    );






                dispatch({

                    type:"SET_LAYOUT",


                    payload:{


                        size,


                        variant,


                    },

                });



            },









            /**
             * Open behavior.
             *
             * Desktop:
             * ignored
             *
             * Tablet:
             * save current layout
             * expand floating
             *
             * Mobile:
             * open drawer
             */
            open:()=>{


                if(
                    state.device === "desktop"
                ){

                    return;

                }






                if(
                    state.device === "tablet"
                ){



                    dispatch({

                        type:"SAVE_PREVIOUS_LAYOUT",


                    });




                    dispatch({

                        type:"SET_LAYOUT",


                        payload:{


                            size:"expanded",


                            variant:"floating",


                        },


                    });



                }







                dispatch({

                    type:"OPEN",

                });



            },









            /**
             * Close behavior.
             *
             * Desktop:
             * ignored
             *
             * Tablet:
             * restore previous layout
             *
             * Mobile:
             * hide drawer
             */
            close:()=>{



                if(
                    state.device === "desktop"
                ){

                    return;

                }







                if(
                    state.device === "tablet"
                ){



                    dispatch({

                        type:"RESTORE_PREVIOUS",


                    });


                    return;

                }







                dispatch({

                    type:"CLOSE",


                });



            },









            /**
             * Toggle behavior.
             */
            toggle:()=>{


                if(
                    state.device === "desktop"
                ){

                    return;

                }




                if(
                    state.isOpen
                ){


                    if(
                        state.device === "tablet"
                    ){


                        dispatch({

                            type:"RESTORE_PREVIOUS",

                        });


                        return;


                    }




                    dispatch({

                        type:"CLOSE",

                    });



                    return;


                }






                dispatch({

                    type:"OPEN",

                });



            },









            setHoverExpanded:(expanded)=>{


                dispatch({

                    type:"SET_HOVER_EXPANDED",


                    payload:expanded,


                });


            },




        }),[

            state,

        ]);









    return (

        <SidebarContext.Provider

            value={contextValue}

        >

            {children}

        </SidebarContext.Provider>

    );

}