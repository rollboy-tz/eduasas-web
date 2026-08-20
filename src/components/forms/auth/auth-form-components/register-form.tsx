import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { EduButton, InputLabel } from "@/components/ui";
import { EduModernInput } from "@/components/fields";
import { AuthButtons } from "./action-section";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/lib/store";
import { apiMutation } from "@/lib/api";
import { UserIcon, LockIcon, Mail, ChevronLeft } from "lucide-react";
import { parseContact } from "@/lib/utils/contact";

type FormData = {
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string | null;
    password: string;
}

export const RegisterForm = () => {
    const searchParams = useSearchParams();
    const toast = useToast();
    const router = useRouter();

    const [step, setStep] = useState<number>(1);
    const [contactValue, setContactValue] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({ 
        firstName: "", 
        lastName: "", 
        password: "", 
        phone: null, 
        email: null 
    });

    const getCleanParams = (currentIdentity: string) => {
        const newParams = new URLSearchParams(searchParams.toString());
        if (currentIdentity) {
            newParams.set("identity", currentIdentity);
        } else {
            newParams.delete("identity");
        }
        newParams.delete("verified");
        newParams.delete("utm_campaign");
        newParams.delete("utm_source");
        return newParams.toString();
    };

    const handleStepOneNext = () => {
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            toast.show({ message: "Please fill in your first and last name", type: "error" });
            return;
        }
        setStep(2);
    };

    const handleSubmit = async () => {
        const contact = parseContact(contactValue);
        if (!contactValue || contact.isValid !== true || contact.type === "unkown") {
            toast.show({ message: "Please enter a valid email or phone number", type: "error" });
            return;
        }

        let updatedEmail = null;
        let updatedPhone = null;

        if (contact.type === "EMAIL") {
            updatedEmail = contact.value;
        } else if (contact.type === "PHONE") {
            updatedPhone = contact.value;
        }

        if (!formData.password) {
            toast.show({ message: "Please enter a secure password", type: "error" });
            return;
        }

        if (formData.password !== confirmPassword) {
            toast.show({ message: "Passwords do not match", type: "error" });
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                ...formData,
                email: updatedEmail,
                phone: updatedPhone
            };

            const res = await apiMutation("post", "/auth/register", payload);
            if (res.status === "success") {
                toast.show({ message: res.message || "Account created successfully", type: "success" });
                router.replace(`/auth/verify?identity=${encodeURIComponent(updatedEmail ?? updatedPhone ?? contactValue)}&reason=register`);
            } else {
                toast.show({ message: res.message || "Registration failed", type: "error" });
            }
        } catch (err: any) {
            toast.show({ message: "An error occurred during registration. Please try again.", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    const cleanParamsString = getCleanParams(contactValue);
    const loginHref = cleanParamsString ? `/auth/login?${cleanParamsString}` : `/auth/login`;

    return (
        <div className="flex flex-col justify-center w-full max-w-[380px] mx-auto py-4">
            <AnimatePresence mode="wait">
                {step === 1 ? (
                    // ===================== STEP 1 ======================
                    <motion.div
                        key={1}
                        className="space-y-6"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="space-y-1.5 text-center sm:text-left">
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                Create an account
                            </h2>
                            <p className="text-sm text-slate-500">
                                Enter your personal details to get started.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <InputLabel label="First Name" required />
                                <EduModernInput
                                    value={formData.firstName}
                                    type="name"
                                    transform="capitalize"
                                    className="h-11 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-slate-900 bg-slate-50/50 transition-all"
                                    icon={UserIcon}
                                    required
                                    placeholder="John"
                                    onChange={(val) => setFormData({ ...formData, firstName: val })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <InputLabel label="Last Name" required />
                                <EduModernInput
                                    value={formData.lastName}
                                    type="name"
                                    required
                                    transform="capitalize"
                                    className="h-11 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-slate-900 bg-slate-50/50 transition-all"
                                    icon={UserIcon}
                                    placeholder="Doe"
                                    onChange={(val) => setFormData({ ...formData, lastName: val })}
                                />
                            </div>

                            <div className="pt-2">
                                <AuthButtons clickAction={handleStepOneNext} text="Continue" />
                            </div>
                        </div>

                        <div className="text-center pt-4 border-t border-slate-100">
                            <p className="text-xs text-slate-500">
                                Already have an account?{" "}
                                <Link className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors ml-1" href={loginHref}>
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    // ===================== STEP 2 ======================
                    <motion.div
                        key={2}
                        className="space-y-6"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setStep(1)}
                                className="h-9 w-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                                aria-label="Go back"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                                    Security & Contact
                                </h2>
                                <p className="text-xs text-slate-500">Almost done setting up your account.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <InputLabel label="Email or Phone Number" required />
                                <EduModernInput
                                    value={contactValue}
                                    type="contact"
                                    className="h-11 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-slate-900 bg-slate-50/50 transition-all"
                                    icon={Mail}
                                    placeholder="name@institution.com or phone"
                                    onChange={(val) => { setContactValue(val) }}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <InputLabel label="Password" required />
                                <EduModernInput
                                    value={formData.password}
                                    type="password"
                                    className="h-11 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-slate-900 bg-slate-50/50 transition-all"
                                    icon={LockIcon}
                                    placeholder="••••••••"
                                    onChange={(val) => setFormData({ ...formData, password: val })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <InputLabel label="Confirm Password" required />
                                <EduModernInput
                                    value={confirmPassword}
                                    type="password"
                                    className="h-11 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-slate-900 bg-slate-50/50 transition-all"
                                    icon={LockIcon}
                                    placeholder="••••••••"
                                    onChange={(val) => setConfirmPassword(val)}
                                />
                            </div>

                            <div className="pt-2">
                                <EduButton 
                                    onClick={handleSubmit} 
                                    className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-sm transition-all"
                                >
                                    {isLoading ? "Creating Account..." : "Complete Registration"}
                                </EduButton>
                            </div>
                        </div>

                        <div className="text-center pt-4 border-t border-slate-100">
                            <p className="text-xs text-slate-500">
                                Already have an account?{" "}
                                <Link className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors ml-1" href={loginHref}>
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};