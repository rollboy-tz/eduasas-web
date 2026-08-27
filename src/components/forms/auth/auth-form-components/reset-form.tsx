import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { EduModernInputV2 } from "@/components/fields";
import { EduButton, InputLabel } from "@/components/ui";
import { apiMutation, isApiError } from "@/lib/api";
import { Lock, LockKeyhole, ChevronLeft } from "lucide-react";
import { useToast } from "@/lib/store";

export const ResetForm = () => {
    const toast = useToast();
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams.toString());
    const router = useRouter();

    const [formData, setFormData] = useState({ password: "", confirm: "" });
    const [submitting, setSubmitting] = useState(false);

    const token = params.get("token");
    const identity = params.get("identity");

    useEffect(() => {
        if (!token?.trim()) {
            toast.show({ message: "Unauthorized access or missing reset token.", type: "error" });
            router.replace("/auth/login");
        }
    }, [token, router, toast]);

    const handleSubmit = async () => {
        if (!formData.password || !formData.confirm) {
            toast.show({ message: "Please fill out all fields", type: "error" });
            return;
        }

        if (formData.password !== formData.confirm) {
            toast.show({ message: "Password and confirm password don't match", type: "error" });
            return;
        }

        setSubmitting(true);

        try {
            const response = await apiMutation("patch", "/auth/reset-password", { 
                resetToken: token, 
                newPassword: formData.password 
            });

            if (response.status === "success") {
                toast.show({ message: response.message || "Password changed successfully. Please log in to continue.", type: "success" });
                
                const loginParams = new URLSearchParams();
                if (identity) loginParams.set("identity", identity);
                
                router.replace(`/auth/login?${loginParams.toString()}`);
            } else {
                toast.show({ message: response.message || "Failed to reset password", type: "error" });
            }
        } catch (error) {
            if (isApiError(error)) {
                const message = error.message || "Something went wrong, please retry";
                toast.show({ message, type: "error" });
            } else {
                toast.show({ message: "Network error, please check your connection", type: "error" });
            }
        } finally {
            setSubmitting(false);
        }
    };

    const loginHref = identity ? `/auth/login?identity=${encodeURIComponent(identity)}` : "/auth/login";

    return (
        <div className="flex flex-col justify-center w-full max-w-[380px] mx-auto py-4">
            <div className="space-y-6">
                {/* Header Section */}
                <div className="space-y-1.5 text-center sm:text-left">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                        Reset Password
                    </h2>
                    <p className="text-sm text-slate-500">
                        Please enter a secure new password for your account.
                    </p>
                </div>

                {/* Form Inputs & Actions */}
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <InputLabel label="New Password" required />
                        <EduModernInputV2
                            type="password"
                            value={formData.password}
                            onChange={(val) => setFormData({ ...formData, password: val })}
                            className="h-11 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-slate-900 bg-slate-50/50 transition-all"
                            required={true}
                            icon={Lock}
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <InputLabel label="Confirm New Password" required />
                        <EduModernInputV2
                            value={formData.confirm}
                            type="password"
                            required={true}
                            password={formData.password}
                            className="h-11 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-slate-900 bg-slate-50/50 transition-all"
                            onChange={(val) => setFormData({ ...formData, confirm: val })}
                            icon={LockKeyhole}
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="pt-2">
                        <EduButton
                            isLoading={submitting}
                            loadingText="Updating Password..."
                            onClick={handleSubmit}
                            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-sm transition-all cursor-pointer"
                        >
                            Reset Password
                        </EduButton>
                    </div>
                </div>

                {/* Back to Login Link */}
                <div className="text-center pt-4 border-t border-slate-100">
                    <Link 
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors flex items-center justify-center gap-1.5" 
                        href={loginHref}
                    >
                        <ChevronLeft size={16} /> Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};