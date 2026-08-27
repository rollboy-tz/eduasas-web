"use client";

import React, {
    JSX,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";

import { createPortal } from "react-dom";


type Option = {
    label: string;
    value: string;
};


type CommonProps = {
    options: Option[];
    placeholder?: string;
    disabled?: boolean;
};


type SingleProps = CommonProps & {
    multiple?: false;
    value?: string;
    onChange: (value: string) => void;
};


type MultipleProps = CommonProps & {
    multiple: true;
    value?: string[];
    onChange: (value: string[]) => void;
};


type Props =
    | SingleProps
    | MultipleProps;



export function SettingSelect(props: SingleProps): JSX.Element;

export function SettingSelect(props: MultipleProps): JSX.Element;


export function SettingSelect(props: Props) {


    const buttonRef =
        useRef<HTMLButtonElement>(null);


    const [open, setOpen] =
        useState(false);



    const [position, setPosition] = useState<{
        top: number;
        left: number;
        width: number;
        placement: "top" | "bottom";
    }>({
        top: 0,
        left: 0,
        width: 0,
        placement: "bottom",
    });





    const updatePosition = () => {

        const button = buttonRef.current;

        if (!button)
            return;


        const rect =
            button.getBoundingClientRect();


        const menuHeight =
            Math.min(
                props.options.length * 38 + 16,
                280
            );


        const spaceBottom =
            window.innerHeight - rect.bottom;


        const spaceTop =
            rect.top;


        const openTop =
            spaceBottom < menuHeight &&
            spaceTop > menuHeight;



        let left = rect.left;

        const width = rect.width;


        // prevent overflow right
        if (left + width > window.innerWidth) {

            left =
                window.innerWidth -
                width -
                12;

        }



        setPosition({

            left,

            width,

            placement:
                openTop
                    ? "top"
                    : "bottom",


            top:

                openTop

                    ?

                    rect.top - menuHeight - 8

                    :

                    rect.bottom + 8,

        });

    };






    useLayoutEffect(() => {

        if (open)
            updatePosition();

    }, [open]);






    useEffect(() => {


        if (!open)
            return;



        const outside =
            (event: MouseEvent) => {


                const target =
                    event.target as Node;



                const menu =
                    document.getElementById(
                        "setting-select-menu"
                    );



                if (
                    !buttonRef.current?.contains(target)
                    &&
                    !menu?.contains(target)
                ) {

                    setOpen(false);

                }

            };




        const escape =
            (event: KeyboardEvent) => {

                if (event.key === "Escape")
                    setOpen(false);

            };




        window.addEventListener(
            "resize",
            updatePosition
        );


        window.addEventListener(
            "scroll",
            updatePosition,
            true
        );



        document.addEventListener(
            "mousedown",
            outside
        );


        document.addEventListener(
            "keydown",
            escape
        );





        return () => {


            window.removeEventListener(
                "resize",
                updatePosition
            );


            window.removeEventListener(
                "scroll",
                updatePosition,
                true
            );


            document.removeEventListener(
                "mousedown",
                outside
            );


            document.removeEventListener(
                "keydown",
                escape
            );


        };


    }, [open]);









    const getLabel = () => {


        if (props.multiple) {


            const selected =
                props.options.filter(
                    option =>
                        (props.value ?? [])
                            .includes(option.value)
                );


            return selected.length

                ? selected
                    .map(item => item.label)
                    .join(", ")

                : props.placeholder ?? "Select...";

        }




        const selected =
            props.options.find(
                option =>
                    option.value === props.value
            );


        return selected?.label ??
            props.placeholder ??
            "Select...";


    };









    const selected =
        (option: Option) => {


            if (props.multiple) {


                return (
                    props.value ?? []
                )
                    .includes(option.value);

            }



            return props.value === option.value;


        };










    const selectOption =
        (option: Option) => {


            if (props.multiple) {


                const current =
                    props.value ?? [];



                const next =
                    current.includes(option.value)

                        ?

                        current.filter(
                            item =>
                                item !== option.value
                        )

                        :

                        [
                            ...current,
                            option.value
                        ];



                props.onChange(next);

                return;

            }





            props.onChange(option.value);

            setOpen(false);


        };









    return (

        <>

            <button

                ref={buttonRef}

                type="button"

                disabled={props.disabled}

                onClick={() =>
                    setOpen(v => !v)
                }


                className="
    flex items-center justify-between gap-2
    rounded-xl cursor-pointer
    border border-gray-200/80
    dark:border-gray-700/70
    bg-white/70
    dark:bg-gray-900/60
    backdrop-blur-md
    px-3 py-1.5
    text-xs
    font-medium
    text-gray-700
    dark:text-gray-200
    shadow-sm
    transition-all
    hover:shadow-md
    hover:border-gray-300
    dark:hover:border-gray-600
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500/20
    max-w-[240px]
"

            >

                <span className="truncate">
                    {getLabel()}
                </span>


                <svg
                    className={`
        h-4 w-4
        transition-transform
        duration-200
        ${open
                            ? "rotate-180"
                            : ""
                        }
    `}
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 8l4 4 4-4"
                    />
                </svg>


            </button>





            {
                open &&

                createPortal(

                    <div

                        id="setting-select-menu"

                        style={{

                            position: "fixed",

                            top: position.top,

                            left: position.left,

                            width: position.width,

                        }}


                        className={`
    z-[99999]
    rounded-xl
    border border-gray-200/70
    dark:border-gray-700/70
    bg-white/95
    dark:bg-gray-900/95
    backdrop-blur-xl
    shadow-lg
    overflow-hidden

    ${position.placement === "top"
                                ? "animate-in slide-in-from-bottom-2"
                                : "animate-in slide-in-from-top-2"
                            }
`}

                    >

                        {
                            props.options.map(option => (


                                <button

                                    key={option.value}

                                    type="button"

                                    onClick={() =>
                                        selectOption(option)
                                    }


                                    className={`
                                        flex
                                        w-full
                                        justify-between
                                        px-3 shrink-0
                                        py-2.5
                                        text-xs
                                        font-medium
                                        transition-colors
                                        text-gray-700
                                        cursor-pointer

                                        ${selected(option)

                                            ?

                                            "bg-blue-500 text-white"

                                            :

                                            "hover:bg-gray-100 dark:hover:bg-gray-800"
                                        }
                                    `}

                                >

                                    <span>
                                        {option.label}
                                    </span>


                                    {
                                        selected(option) &&
                                        <span>
                                            ✓
                                        </span>
                                    }


                                </button>


                            ))
                        }


                    </div>,


                    document.body

                )
            }

        </>

    );

}