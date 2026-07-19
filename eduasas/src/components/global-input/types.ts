import { ReactNode } from "react";

/**
 * INPUT TYPES SUPPORTED BY FORM ENGINE
 */
export type InputType =
    | "text"
    | "email"
    | "password"
    | "confirm-password"
    | "search"
    | "phone"
    | "fullname"
    | "username";

export type LabelMode = "top" | "floating" | "inside";

export interface GlobalInputProps {

    /** Controlled value */
    value: string;

    /** Change handler */
    onChange: (value: string) => void;

    /** Input type */
    type?: InputType;

    /** Label (string or dynamic) */
    label?: string | ((state: any) => string);

    /** Placeholder text */
    placeholder?: string;

    /** Label mode behavior */
    labelMode?: LabelMode;

    /** Icons */
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    autoIcon?: boolean;

    /** Validation */
    minLength?: number;
    maxLength?: number;
    minWords?: number;
    maxWords?: number;
    regex?: RegExp;

    /** Password match */
    parentPassword?: string;

    /** Error override */
    error?: boolean;
    errorMessage?: string;

    /** Helper text */
    helperText?: string;

    /** Async validator */
    asyncValidator?: (value: string) => Promise<string | null>;

    /** UI control */
    fullWidth?: boolean;
}