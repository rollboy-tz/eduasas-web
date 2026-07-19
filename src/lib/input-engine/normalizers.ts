import { normalizeEmail, normalizePhone, isPhoneLike } from "./contacts-normalizers";
import { capitalize } from "../utils/string-utils";

export const normalizers = {

    email(value: string) {
        return normalizeEmail(value);
    },


    phone(value: string) {
        return normalizePhone(value);
    },


    contact(value: string) {
        if (!value) return "";

        return isPhoneLike(value)
            ? normalizePhone(value)
            : normalizeEmail(value);
    },

    name(value: string) {
        const sanitized = capitalize(value.trim());
        return sanitized
            .replace(/[^a-zA-Z\u00C0-\u00FF' -]/g, "")
    },

    fullname(value: string) {

        return value
            // 1. Chuja: Ruhusu herufi (A-Z, a-z, namba za herufi za lugha nyingine)
            //    pamoja na nafasi na apostrophe (') pekee.
            //    Alama nyingine zote (kama < > * ^ @ #) zinafutwa.
            .replace(/[^a-zA-Z\u00C0-\u00FF' -]/g, "")

            // 2. Ondoa nafasi zilizojirudia
            .replace(/\s+/g, " ")

            // 3. Capitalize (Kama uliamua kurudi kwenye Title Case)
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    },

    text(value: string) {

        // 1. Ondoa Characters hatari za XSS na alama zisizotakiwa (Regex)
        // Tunaruhusu herufi za kawaida, namba, na punctuation muhimu (.,-'")
        // Tunafuta: < > * ^ | \ { } [ ]
        let sanitized = value.replace(/[<>*^|\\{}[\]]/g, '');

        // 2. Ondoa tab (tunazibadilisha kuwa space) na space zilizojirudia
        // Tunaziacha Enter (\n) na Tab za kawaida kwa kutumia logic ya space pekee
        sanitized = sanitized.replace(/[ \t]+/g, ' ');

        // 3. Capitalize kila neno (Title Case)
        // Tunatumia split/map ili iweze kufanya kazi vizuri hata na characters za kigeni
        return sanitized;

    },

    password(value: string) {
        if (!value) return "";

        return value.trim();
    },


    confirm(value: string) {
        if (!value) return "";

        return value.trim();
    },


    number(value: string) {
        if (!value) return "";

        // Ruhusu namba, decimal moja, na minus mwanzo pekee
        let normalized = value.replace(/[^0-9.-]/g, "");

        // Hakikisha minus ipo mwanzo pekee
        if (normalized.includes("-")) {
            normalized =
                "-" +
                normalized
                    .replace(/-/g, "")
                    .slice(0);
        }

        // Hakikisha decimal point moja tu
        const parts = normalized.split(".");

        if (parts.length > 2) {
            normalized = parts[0] + "." + parts.slice(1).join("");
        }

        return normalized;
    },


    url(value: string) {
        if (!value) return "";

        return value
            .trim()
            .replace(/\s+/g, "")
            .replace(/[^a-zA-Z0-9:/?#[\]@!$&'()*+,;=._~-]/g, "");
    },

}