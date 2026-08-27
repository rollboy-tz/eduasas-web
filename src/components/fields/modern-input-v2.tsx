import React, { JSX, useState } from "react";
import { cn } from "@/lib/utils/helper";
import { useInputEngine } from "@/lib/input-engine";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Supported input types for EduModernInputV2.
 */
export type inputTypeV2 =
  | "text"
  | "email"
  | "contact"
  | "password"
  | "confirm"
  | "phone"
  | "url"
  | "fullname"
  | "name";

/**
 * Props definition for the EduModernInputV2 component.
 */
interface EduInputProps {
  /** Custom CSS class names applied to the container wrapper */
  className?: string;
  /** Password value reference used when validating password match/confirm types */
  password?: string;
  /** Placeholder text shown inside the input */
  placeholder?: string;
  /** Text transformation option for input value */
  transform?:
  | "uppercase"
  | "lowercase"
  | "capitalize"
  | "none";
  /** Character restriction type applied to input */
  restrict?:
  | "numbers"
  | "letters"
  | "alphanumeric"
  | "none";
  /** External custom error message string */
  error?: string;
  /** Success message string to display below the input when valid */
  sucessMessage?: string;
  /** Controlled input value string */
  value?: string;
  /** Input field type classification */
  type?: inputTypeV2;
  /** Marks the input field as required */
  required?: boolean;
  /** Maximum character limit allowed */
  maxValue?: number;
  /** Shows character count relative to `maxValue` */
  showValueCount?: boolean;
  /** Shows right-hand side action button arrow icon */
  showActionBtn?: boolean;
  /** Enables state validation status icon (success/error) */
  showStateIcon?: boolean;
  /** Manual input state override */
  inputState?: "sucess" | "error";
  /** Callback triggered when the action button is clicked */
  actionClick?: () => void;
  /** Disables interaction with the component when true */
  disabled?: boolean;
  /** Optional custom leading icon component */
  icon?: LucideIcon;
  /** Callback triggered when input value changes */
  onChange?: (value: string) => void;
  /** Callback triggered when an input error occurs */
  onError?: (error: string) => void;
}

/**
 * `EduModernInputV2` is a highly configurable, animated text input component.
 * Features include integrated validation, password visibility toggles, text transformation,
 * character count display, focus state underline animations, and status indicators.
 *
 * @param {EduInputProps} props - Properties configuring the input component.
 * @returns {JSX.Element} The rendered input component.
 */
export const EduModernInputV2 = ({
  className,
  password,
  placeholder,
  value,
  onChange,
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
  icon: Icon,
  error,
  actionClick,
}: EduInputProps): JSX.Element => {
  const [passHidden, setPassHidden] = useState(true);
  const [focused, setFocused] = useState(false);

  const isPassword = type === "password" || type === "confirm";

  const input = useInputEngine({
    value,
    password,
    type,
    required,
    transform,
    restrict,
    onChange,
  });

  const htmlType = isPassword
    ? passHidden
      ? "password"
      : "text"
    : type === "email"
      ? "email"
      : type === "url"
        ? "url"
        : "text";

  const errorMsg = error || input.error;

  return (
    <div
      className={cn(
        "flex flex-col w-full relative overflow-hidden",
        disabled && "cursor-not-allowed opacity-60"
      )}
    >
      {/* Input Field Main Container */}
      <div
        className={cn(
          "group flex flex-col w-full",
          "relative rounded-sm",
          "bg-white",
          "transition-colors",
          focused && "bg-white/90",
          "overflow-hidden",
          className
        )}>

        <div className="flex items-center bg-inherit px-2 h-full w-full" >
          {Icon && (
            <Icon
              size={18}
              className="mr-1.5 text-primary-400 shrink-0"
            />
          )}

          <input
            {...input.bind()}
            value={input.value}
            disabled={disabled}
            type={htmlType}
            placeholder={placeholder}
            aria-invalid={!!errorMsg}
            className="peer flex-1 bg-transparent py-2 text-sm placeholder:text-muted-500 outline-none"
          />

          {/* Password Visibility Toggle */}
          {isPassword && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => setPassHidden((v) => !v)}
              className="rounded-sm p-1 text-primary-400 transition hover:bg-white/5"
            >
              {passHidden ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}

          {/* Status Indicator Icon (Success/Error) */}
          {!isPassword && showStateIcon && (
            <AnimatePresence mode="wait">
              {inputState === "error" ? (
                <motion.span
                  key="error"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <AlertCircle size={18} className="text-red-500" />
                </motion.span>
              ) : (
                <motion.span
                  key="success"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <CheckCircle2 size={18} className="text-green-500" />
                </motion.span>
              )}
            </AnimatePresence>
          )}

          {/* Character Counter Display */}
          {showValueCount && maxValue && (
            <span className="text-[11px] text-muted-400">
              {input.value.length}/{maxValue}
            </span>
          )}

          {/* Action Button */}
          {showActionBtn && (
            <button
              type="button"
              onClick={actionClick}
              className="p-1 text-primary-400 hover:bg-white/5 rounded-sm"
            >
              <ArrowRight size={18} />
            </button>
          )}

        </div>

        {/* Fluent Underline Animation */}
        <div className="relative h-[2px] overflow-hidden">
          <div className="absolute inset-0 bg-blue-500" />
          <div
            className={cn(
              "absolute",
              "inset-y-0",
              "left-1/2",
              "-translate-x-1/2",
              "bg-blue-900",
              "transition-all",
              "duration-300",
              "ease-out",
              focused ? "w-full" : "w-0 group-hover:w-full"
            )}
          />
        </div>
      </div>



      {/* Messages (Error & Success Display) */}
      <div className="h-4 overflow-hidden mt-1">
        {input.touched && errorMsg && (
          <div className="flex items-center gap-1 text-red-500 text-[10px]">
            <AlertCircle size={11} />
            {errorMsg}
          </div>
        )}

        {!errorMsg && sucessMessage && (
          <div className="flex items-center gap-1 text-green-500 text-[10px]">
            <CheckCircle2 size={11} />
            {sucessMessage}
          </div>
        )}
      </div>
    </div >
  );
};