"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";


interface SmartStickyProps {

    children: (
        stuck: boolean
    ) => React.ReactNode;

    onStickyChange?: (
        stuck: boolean
    ) => void;

    className?: string;
}



export default function SmartSticky({

    children,

    onStickyChange,

    className = "",

}: SmartStickyProps) {


    const triggerRef =
        useRef<HTMLDivElement>(null);


    const [stuck, setStuck] =
        useState(false);



    useEffect(() => {


        const trigger =
            triggerRef.current;


        if (!trigger)
            return;



        const header =
            document.querySelector(
                "[data-app-header]"
            );



        const headerHeight =
            header
                ?.getBoundingClientRect()
                .height ?? 0;



        const observer =
            new IntersectionObserver(
                ([entry]) => {

                    const isStuck =
                        !entry.isIntersecting;


                    setStuck(isStuck);


                    onStickyChange?.(isStuck);

                },
                {
                    threshold: 0
                }
            );



        observer.observe(trigger);



        return () => {

            observer.disconnect();

        };


    }, [onStickyChange]);





    return (

        <>

            {/* Keeps layout stable */}
            <div
                ref={triggerRef}
                className="h-px"
            />



            <div
                className={`
                    sticky
                    z-30

                    ${stuck
                        ?
                        `
                        bg-white/80
                        dark:bg-gray-900/80
                        backdrop-blur-xl
                        shadow-sm
                        border-b
                        border-black/5
                        dark:border-white/10
                        `
                        :
                        ""
                    }

                    ${className}
                `}
                style={{
                    top:
                        "var(--app-header-height, 0px)"
                }}
            >

                {children(stuck)}

            </div>


        </>

    );

}