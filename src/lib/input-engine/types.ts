export type InputType =
    | "text"
    | "contact"
    | "email"
    | "password"
    | "confirm"
    | "number"
    | "phone"
    | "url"
    | "fullname"
    | "name";

export type RestrictType =
    | "letters"
    | "numbers"
    | "alphanumeric"
    | "none";

export type TransformType =
    | "uppercase"
    | "lowercase"
    | "capitalize"
    | "none";

export interface ValidationResult {
    valid: boolean;
    error: string | null;
}

export interface ValidationContext {
    password?: string;
}

export type Validator = (
    value: string,
    context?: ValidationContext
) => ValidationResult;

export interface EngineOptions {
    value?: string;

    type?: InputType;

    required?: boolean;

    transform?: "uppercase" | "lowercase" | "capitalize" | "none";

    restrict?: "numbers" | "letters" | "alphanumeric" | "none";

    password?: string;          // confirm password

    maxValue?: number;          // max characters

    minValue?: number;          // min characters

    disabled?: boolean;         // ignore change if disabled

    onChange?: (value: string) => void;

    onError?: (error: string | null) => void;
}