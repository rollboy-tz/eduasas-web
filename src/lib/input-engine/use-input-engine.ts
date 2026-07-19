import { useState, useCallback, useEffect } from "react";

import { EngineOptions, InputType } from "./types";
import { restrictors } from "./restrictors";
import { transformers } from "./transformers";
import { normalizers } from "./normalizers";
import { validators } from "./validators";
import { validatorRegistry } from "./registry";

export interface UseInputEngineProps extends EngineOptions {
    onChange?: (value: string) => void;
}

export const useInputEngine = ({
    value = "",
    type,
    password,
    required = false,
    transform = "none",
    restrict = "none",
    onChange,
}: UseInputEngineProps) => {

    const [inputValue, setInputValue] = useState(value);

    const [touched, setTouched] = useState(false);
    const [focused, setFocused] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [valid, setValid] = useState<boolean | null>(null);
    // console.log("Inside the engine")


    /**
     * HELPER DO THING
     */

    const prepareValue = useCallback((value: string) => {
        /**
        * Restrict
        */

        value = restrictors[restrict](value);

        /**
         * Transform
         */

        if (transform !== "none") {
            value = transformers[transform](value);

        }

        /**
         * Normalize
         */

        const normalizer = type ? normalizers[type] : undefined;

        if (normalizer) {
            value = normalizer(value);
        } else {
            value = normalizers.text(value);
        }

        return value;
    }, [restrict, transform, type]);

    
    // Intentionally run once for initial value only
    useEffect(() => {
        const initialValue = prepareValue(value)
        setInputValue(initialValue)
    }, [])


    /**
     * CHANGE
     */

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {

            let value = event.target.value;

            value = prepareValue(value);

            setInputValue(value);

            // Clear engine validation state
            setError(null);
            setValid(null);

            onChange?.(value);

        },
        [prepareValue, onChange]
    );

    /**
     * VALIDATE
     */

    const validate = useCallback(() => {

        /**
         * Required
         */

        if (required) {

            const requiredResult = validators.required(inputValue);

            if (!requiredResult.valid) {

                setError(requiredResult.error);

                setValid(null);

                return false;

            }

        }

        /**
         * Type validator
         */

        const validator = type ? validatorRegistry[type] : undefined;

        if (validator) {

            const result = validator(inputValue, { password });

            if (!result.valid) {
                setError(result.error);
                setValid(null);
                return false;
            }

        }

        setError(null);

        setValid(true);

        return true;

    }, [required, inputValue, type, password]);

    /**
     * BLUR
     */

    const handleBlur = useCallback(() => {

        setFocused(false);

        setTouched(true);

        validate();

    }, [validate]);

    /**
     * FOCUS
     */

    const handleFocus = useCallback(() => {
        setFocused(true);
    }, []);

    /**
     * RESET
     */

    const reset = () => {

        setInputValue("");

        setFocused(false);

        setTouched(false);

        setError(null);

        setValid(null);

    };

    /**
     * SET VALUE
     */

    const setValue = (value: string) => {

        setInputValue(value);

    };

    /**
     * INPUT BIND
     */

    const bind = useCallback(() => ({
        onChange: handleChange,
        onBlur: handleBlur,
        onFocus: handleFocus,
    }), [handleChange, handleBlur, handleFocus]);

    return {

        value: inputValue,

        error,

        valid,

        focused,

        touched,

        handleChange,

        handleBlur,

        handleFocus,

        validate,

        reset,

        setValue,

        bind,

    };

};