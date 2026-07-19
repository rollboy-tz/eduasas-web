import { Validator } from "./types";
import { Messages } from "./messages";
import { parseContact } from "@/lib/utils/contact";

export const validators: Record<string, Validator> = {

    required(value: string) {

        if (!value.trim()) {

            return {

                valid: false,

                error: Messages.required

            };

        }

        return {

            valid: true,

            error: null

        };

    },

    email(value: string) {

        const result = parseContact(value, "EMAIL");

        return result.isValid
            ? { valid: true, error: null }
            : { valid: false, error: Messages.invalidEmail };

    },


    phone(value: string) {

        const result = parseContact(value, "PHONE");

        return result.isValid
            ? { valid: true, error: null }
            : { valid: false, error: Messages.invalidPhone };

    },


    contact(value: string) {

        const result = parseContact(value);

        return result.isValid
            ? { valid: true, error: null }
            : { valid: false, error: Messages.invalidContact };

    },

    number(value: string) {

        if (!value.trim()) {
            return {
                valid: false,
                error: Messages.invalidNumber
            };
        }

        return !isNaN(Number(value))
            ? { valid: true, error: null }
            : { valid: false, error: Messages.invalidNumber };

    },

    url(value: string) {

        if (!value.trim()) {
            return {
                valid: false,
                error: Messages.invalidURL
            };
        }

        try {

            const url = value.startsWith("http")
                ? value
                : `https://${value}`;

            new URL(url);

            return {
                valid: true,
                error: null
            };

        } catch {

            return {
                valid: false,
                error: Messages.invalidURL
            };

        }

    },

    name(value: string) {

        const regex = /^[A-Za-zÀ-ÿ'-]+$/;

        return regex.test(value)

            ? { valid: true, error: null }

            : { valid: false, error: Messages.invalidName };

    },

    fullName(value: string) {

        const regex = /^[A-Za-zÀ-ÿ'-]+(?: [A-Za-zÀ-ÿ'-]+)+$/;

        return regex.test(value)

            ? { valid: true, error: null }

            : { valid: false, error: Messages.invalidFullName };

    },

    password(value: string) {

        const hasMinLength = value.length >= 8;
        const hasUppercase = /[A-Z]/.test(value);
        const hasLowercase = /[a-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);

        if (
            !hasMinLength ||
            !hasUppercase ||
            !hasLowercase ||
            !hasNumber
        ) {
            return {
                valid: false,
                error: Messages.invalidPassword
            };
        }

        return {
            valid: true,
            error: null
        };

    },

    confirm(
        value: string,
        context?: { password?: string }
    ) {

        if (!context?.password) {
            return {
                valid: false,
                error: Messages.enterPassFirst
            };
        }

        return value === context.password

            ? {
                valid: true,
                error: null
            }

            : {
                valid: false,
                error: Messages.invalidConfirm
            };

    },

}