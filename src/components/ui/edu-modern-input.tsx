import { cn } from "@/lib/utils/helper";
import { useEffect, useState } from "react";
import { useInputEngine } from "@/lib/input-engine";
import { AlertCircle, ArrowRight, CheckCircle2, EyeIcon, EyeOff } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
export type inputType = "text" | "email" | "contact" | "password" | "confirm" | "phone" | "url" | "fullname" | "name";

interface EduInputProps {

    /**Input class name
     * Input classes
     */
    className?: string;

    /**
     * The value password is usefull when inpu type is comfirm
     * Path the password you want't to campare with so input will compare and comfirm it internal
     */
    password?: string;

    /**Input placeholder */
    placeholder?: string;

    /**Used to transorm value for better typing */
    transform?: "uppercase" | "lowercase" | "capitalize" | "none";

    /**This used fomr input restriction for allowed chalacters */
    restrict?: "numbers" | "letters" | "alphanumeric" | "none";

    /**This is outside erro message to be shown under input example ```Username exisit``` */
    error?: string;

    /**This message used to be shown under the input for user feedback example ````Username is valid``` */
    sucessMessage?: string;

    /**Initial value for the input, thiss will be transformed but won't be validated during mount */
    value?: string;

    /**Use internal floating label put false for external label */
    useLabel?: boolean;

    /** Use bordered input insteed of modern underlined input */
    useBorder?: boolean;

    /** Mav input value, addd ```showValueCount={true}``` For preview input count vaue */
    maxValue?: number;

    /**Custom input type overided from element input attribute 
     * - ```text``` *For normal text input, some characters ignored*
     * - ```email``` *For email input, this will validate email*
     * - ```phone``` *For phone input, this will validate phone number*
     * - ```contact``` *For contact input, this will validate email or phone number*
     * - ```password``` *For password input*
     * - ```confirm``` *For password confirmation input* 
     * - ```url``` *For url input, this will validate url*
     * - ```name``` *For name input, this will validate word as single name and will be capitalized insted if trnsform applied*
     * - ```fullname``` *For full name input, this will validate words as name and will be capitalized insted if trnsform applied*
    */
    type?: inputType;

    /**Use ```true``` for required values */
    required?: boolean;

    /** Show vaue intered compared vs value passed through ```maxValue``` prop */
    showValueCount?: boolean;

    /** Use for action button at the right side off the input button will be show by ```ArrowRight```  icon*/
    showActionBtn?: boolean;

    /**Show eithor sucess or alert botton at right side on the input */
    showStateIcon?: boolean;

    /**Current state of the input this help full when ```showStateIvon``` value is ```true``` */
    inputState?: "sucess" | "error";

    /**Pass the action to be done after action button click */
    actionClick?: () => void;

    /**Pass ```true``` to dis-able the input */
    disabled?: boolean;

    /**Pass the icon for the input, 
     * - **Recomendation:** *Use size ```20``` for the icon. Don't pass text color or icon class bg in icon ```className```* 
     * @example
     * icon={<UserIcon size={20}>}
     */
    icon?: React.ReactNode;

    /**Chenge event of the input providing string value */
    onChange?: (value: string) => void;

    /**Error event fie the input
     * @description
     * *This helpfull when need to set error from the input*
     * @example
     * const [errorMessageFromInput, setErrorMEssageFromInput] = useState("");
     * onError={(nputErrorMessaege) => setErrorMEssageFromInput(nputErrorMessaege)}
     */
    onError?: (error: string) => void;
}

export const EduModernInput = (
    {
        className,
        password,
        placeholder,
        value,
        onChange,
        onError,
        actionClick,
        type = "text",
        transform,
        restrict,
        disabled,
        showValueCount,
        sucessMessage,
        showActionBtn,
        showStateIcon,
        inputState,
        maxValue,
        required,
        icon,
        error
    }
        : EduInputProps) => {

    const [passHidden, setPassHidden] = useState(true);
    const isPassword = type === "confirm" || type == "password";

    const input = useInputEngine(
        {
            value,
            password,
            type,
            required,
            transform,
            restrict,
            onChange
        }
    )

    const errorMsg = error || input.error;
    const sucessMsg = sucessMessage;

    return (
        <div className={cn("flex flex-col w-full", disabled && "cursor-notallowed opacity-0.8")}>
            {/* Input */}
            <div
                className={cn("group relative flex flex-col w-full rounded  bg-neutral-100 overflow-hidden", className)}>
                <div className={cn(
                    "w-full h-full flex items-center px-1.5 py-1 gap-1 bg-inherit"
                )}>
                    {icon && (<span className="text-primary-700">{icon}</span>)}
                    <input
                        {...input.bind()}
                        value={input.value}
                        placeholder={placeholder}
                        type={isPassword ? passHidden ? "password" : "text" : "text"}
                        className={cn("w-full h-full focus:outline-none focus:ring-0 bg-inherit")}
                    />
                    {isPassword ? passHidden ? (
                        <button onClick={() => setPassHidden(false)} className="cursor-pointer">
                            <EyeIcon size={20} className="text-primary-400" />
                        </button>
                    ) : (
                        <button onClick={() => setPassHidden(true)} className="cursor-pointer">
                            <EyeOff size={20} className="text-primary-400" />
                        </button>
                    ) : showStateIcon ? (
                        <AnimatePresence>
                            {inputState === "error" ? (
                                <motion.span
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                ><AlertCircle size={19} /></motion.span>
                            ) : (
                                <motion.span
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                ><CheckCircle2 size={19} /></motion.span>
                            )}
                        </AnimatePresence>
                    ) : showValueCount ? (
                        <span className="text-[11px] font-medium text-primary-700">{`${input.value.length}/${maxValue}`}</span>
                    ) : showActionBtn ? (
                        <button className="text-primary-400 cursor-pointer" onClick={actionClick}><ArrowRight size={20} /></button>
                    ) : null
                    }
                </div>


                {/* Underline, Animated underline must placed over base underline*/}
                <div className="relative w-[101%] h-[2px]">

                    {/* Base underline */}
                    <div className={cn("absolute inset-0", "bg-primary-400")} />

                    {/* Animated underline */}
                    <div
                        className={cn(
                            "absolute inset-y-0 left-1/2 z-10 h-[2px] -translate-x-1/2",
                            "w-0 bg-primary-700 transition-all duration-500",
                            "group-focus-within:w-full group-hover:w-full"
                        )}
                    />
                </div>
            </div>

            {/* State messages position  - classes h-3 and block prevent layout shift*/}
            <div className="left-0 mt-[1px] h-3 block overflow-hidden trancate">
                {/* Error message */}
                {(input.touched && errorMsg)&& (
                    <div className="flex items-center text-red-500">
                        <AlertCircle size={9} />
                        <span className="ml-[2px] text-[10px]">{errorMsg}</span>
                    </div>
                )}
                {/* Success message */}
                {sucessMsg && (
                    <div className="flex items-center text-green-500">
                        <CheckCircle2 size={9} />
                        <span className="ml-[2px] text-[10px]">{sucessMsg}</span>
                    </div>
                )}
            </div>
        </div>
    )
}