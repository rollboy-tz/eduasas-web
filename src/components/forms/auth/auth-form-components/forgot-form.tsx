import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiMutation, isApiError } from "@/lib/api";
import { useToast } from "@/lib/store";
import { EduButton, InputLabel } from "@/components/ui";
import { EduModernInputV2 } from "@/components/fields";
import { Contact, ChevronLeft } from "lucide-react";

export const ForgotForm = () => {
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams.toString());

    const parIdentity = params.get("identity");

    const [loading, setLoading] = useState(false);
    const [identity, setIdentity] = useState("");

    const toast = useToast();
    const router = useRouter();

    useEffect(() => {
        if (parIdentity) {
            setIdentity(parIdentity);
        }
    }, [parIdentity]);

    const getCleanParams = (currentIdentity: string) => {
        const newParams = new URLSearchParams(searchParams.toString());
        if (currentIdentity) {
            newParams.set("identity", currentIdentity);
        } else {
            newParams.delete("identity");
        }
        newParams.delete("reason");
        return newParams.toString();
    };

    const submit = async () => {
        if (!identity.trim()) {
            toast.show({ message: "Please enter your email or phone number", type: "error" });
            return;
        }

        setLoading(true);
        try {
            const payload = { identity, purpose: "FORGOT_PASSWORD" };
            const response = await apiMutation("post", "/auth/resend", payload);
            if (response.status === "success") {
                const message = `OTP successfully sent to ${identity}`;
                toast.show({ message, type: "success" });
                router.push(`/auth/verify?reason=reset&identity=${encodeURIComponent(identity)}`);
            }
        } catch (error) {
            if (isApiError(error)) {
                const message = error.message || "Something went wrong, please try again";
                toast.show({ message, type: "error" });
            } else {
                toast.show({ message: "Network error, please check your connection", type: "error" });
            }
        } finally {
            setLoading(false);
        }
    };

    const cleanParamsString = getCleanParams(identity);
    const loginHref = cleanParamsString ? `/auth/login?${cleanParamsString}` : `/auth/login`;

    return (
        <div className="flex flex-col justify-center w-full max-w-[380px] mx-auto py-4">
            <div className="space-y-6">
                {/* Header Section */}
                <div className="space-y-1.5 text-center sm:text-left">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                        Forgot Password?
                    </h2>
                    <p className="text-sm text-slate-500">
                        Enter your registered email or phone to receive a verification OTP.
                    </p>
                </div>

                {/* Input & Action */}
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <InputLabel label="Email or Phone Number" required />
                        <EduModernInputV2
                            value={identity}
                            type="contact"
                            onChange={(val) => setIdentity(val)}
                            icon={Contact}
                            required={true}
                            className="h-11 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-slate-900 bg-slate-50/50 transition-all"
                            placeholder="name@institution.com or phone"
                        />
                    </div>

                    <div className="pt-2">
                        <EduButton 
                            isLoading={loading}
                            onClick={submit}
                            loadingText="Sending OTP..."
                            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-sm transition-all cursor-pointer"
                        >
                            Request OTP
                        </EduButton>
                    </div>
                </div>

                {/* Back to Login Link */}
                <div className="text-center pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5">
                    <ChevronLeft size={16} className="text-slate-400" />
                    <Link 
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors" 
                        href={loginHref}
                    >
                        Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};