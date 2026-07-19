import {
    Mail,
    Lock,
    User,
    Search,
    Phone,
    UserCircle,
} from "lucide-react";

export const countWords = (value: string) =>
    value.trim().split(/\s+/).filter(Boolean).length;

export const validatePasswordMatch = (
    password: string,
    confirm: string
) => password === confirm;



export const autoIcons = {
    email: Mail,
    password: Lock,
    confirm: Lock,
    fullname: UserCircle,
    search: Search,
    phone: Phone,
    username: User,
};