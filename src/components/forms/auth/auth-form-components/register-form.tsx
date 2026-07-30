
import { useEffect, useState } from "react";
import { EduButton } from "@/components/ui";
import { EduModernInput } from "@/components/ui";
import { AuthButtons } from "./action-section";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/lib/store";
import { apiMutation } from "@/lib/api";
import { UserIcon, LockIcon, Contact, ChevronLeft } from "lucide-react";
import { parseContact } from "@/lib/utils/contact";

export const RegisterForm = () => {
    const toast = useToast();
    const [step, setStep] = useState<number>(1);
    const [contactValue, setConactValue] = useState("");
    const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "" })

    const handleSubmit = async () => {

        //Contact validation
        const contact = parseContact(contactValue);
        if (!contactValue || contact.isValid !== true || contact.type === "unkown") {
            toast.show({ message: "Please enter valid emai or phone number", type: "error" });
            return
        }

        if (contact.type === "EMAIL") {
            setFormData({ ...formData, email: contact.value })
        }

        if (contact.type === "PHONE") {
            setFormData({ ...formData, phone: contact.value })
        }

        console.log("Form Data: ", formData);
        if(!formData.email && formData.phone) {
            toast.show({ message: "Please enter emai or phone number", type: "error" });
            return
        }

        if(!formData.password || !formData.firstName || !formData.lastName) {
            const message = "Please fill out all fields"
            toast.show({ message, type: "error" })
            return
        }

        try {
           const res = await apiMutation("post", "/auth/register", formData)
            if (res.status === "success") {
                toast.show({ message: `${res.message || "Account created sucessfully"}`, type: "success" })
            }
        } catch (e) { } finally {
            
        }
    }

    return (
        <div className="flex items-center p-2 h-full w-full">
            <div className="flex flex-col items-center gap-5 w-full">
                <AnimatePresence>
                    {step === 1 ? (

                        //===================== STEP 1 ======================
                        <motion.div
                            key={1}
                            className="flex flex-col gap-5"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="flex flex-col gap-[3px]">
                                <label htmlFor="identity" className="text-sm">First name</label>
                                <EduModernInput
                                    value={formData.firstName}
                                    type="name"
                                    transform="capitalize"
                                    className="h-10"
                                    icon={UserIcon}
                                    onChange={(val) => setFormData({ ...formData, firstName: val })}
                                />
                            </div>
                            <div className="flex flex-col gap-[3px]">
                                <label htmlFor="name" className="text-sm">Last name</label>
                                <EduModernInput
                                    value={formData.lastName}
                                    type="name"
                                    transform="capitalize"
                                    className="h-10"
                                    icon={UserIcon}
                                    onChange={(val) => setFormData({ ...formData, lastName: val })}
                                />
                            </div>
                            <AuthButtons clickAction={() => setStep(2)} text="Continue" />
                        </motion.div>
                    ) : (

                        //===================== STEP 2 ======================
                        <motion.div
                            key={2}
                            className="flex flex-col gap-5"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >

                                <div className="h-10 flex items-center gap-1 overflow-hidden bg-neutral-100 rounded-md">
                                    <button 
                                        onClick={() => setStep(1)}
                                        className="h-full p-2 reounded-md flex items-ceter justify-center bg-neutral-200 cursor-pointer"
                                    >
                                        <ChevronLeft size={20}/>
                                    </button>

                                    <h3 className="font-bold px-2">Finish creating account.</h3>
                                </div>
                                <div className="flex flex-col gap-[3px]">
                                    <label htmlFor="username" className="text-sm">Email or Phone</label>
                                    <EduModernInput
                                        value={contactValue}
                                        type="contact"
                                        className="h-10"
                                        icon={Contact}
                                        onChange={(val) => { setConactValue(val) }}
                                    />
                                </div>
                                <div className="flex flex-col gap-[3px]">
                                    <label htmlFor="identity" className="text-sm">Password</label>
                                    <EduModernInput
                                        value={formData.password}
                                        type="password"
                                        className="h-10"
                                        icon={LockIcon}
                                        onChange={(val) => setFormData({ ...formData, password: val })}
                                    />
                                </div>
                                <div className="flex flex-col gap-[3px]">
                                    <label htmlFor="identity" className="text-sm">Confirm password</label>
                                    <EduModernInput
                                        value={""}
                                        type="password"
                                        className="h-10"
                                        icon={LockIcon}
                                        onChange={(val) => setFormData({ ...formData, password: val })}
                                    />
                                </div>
                                <EduButton onClick={handleSubmit} className="w-full h-11 bg-primary-500" />
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    )
}