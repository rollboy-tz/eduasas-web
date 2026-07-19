export const Messages = {

    required: "This field is required.",

    invalidEmail: "Invalid email address.",

    invalidPhone: "Invalid phone number.",

    invalidName: "Only letters are allowed.",

    invalidFullName: "Enter your full name.",

    invalidURL: "Invalid URL.",

    invalidPassword: "Password is too weak.",

    invalidNumber: "Invalid number.",

    invalidContact: "Invalid credential.",

    invalidConfirm: "Password does not match.",

    enterPassFirst: "Please enter the password first.",

    invalidValue: "Invalid value.",

    maxValue: (max: number) => `Maximum ${max} characters allowed.`,

    minValue: (min: number) => `Minimum ${min} characters required.`,

    invalidLength: (length: number) => `Must be ${length} characters long.`,

    invalidLengthRange: (min: number, max: number) => `Must be between ${min} and ${max} characters long.`,

}