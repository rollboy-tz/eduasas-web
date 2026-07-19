import { validators } from "./validators";

export const validatorRegistry = {

    text: null,

    email: validators.email,

    phone: validators.phone,

    contact: validators.contact,

    password: null,

    confirm: null,

    number: validators.number,

    url: validators.url,

    name: validators.name,

    fullname: validators.fullName

}