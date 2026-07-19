export const restrictors = {

    none(value: string) {
        return value;
    },

    letters(value: string) {
        return value.replace(/[^A-Za-z ]/g, "");
    },

    numbers(value: string) {
        return value.replace(/\D/g, "");
    },

    alphanumeric(value: string) {
        return value.replace(/[^A-Za-z0-9 ]/g, "");
    }

}