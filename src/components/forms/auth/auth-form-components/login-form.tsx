import Link from "next/link";
import { useState, useEffect } from "react";
import { resetuserKey } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { EduModernInput } from "@/components/fields";
import { InputLabel } from "@/components/ui";
import { AuthButtons } from "./action-section";
import { LockIcon, UserIcon } from "lucide-react";
import { useToast } from "@/lib/store";
import { apiMutation } from "@/lib/api";

export const LoginForm = () => {
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams.toString());

    const identity = params.get("identity");

    const toast = useToast();
    const router = useRouter();

    const [formData, setFormData] = useState({ identity: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (identity) {
            setFormData((prev) => ({ ...prev, identity: identity }));
        }
    }, [identity]);

    const getCleanParams = (currentIdentity: string) => {
        const newParams = new URLSearchParams(searchParams.toString());
        if (currentIdentity) {
            newParams.set("identity", currentIdentity);
        } else {
            newParams.delete("identity");
        }
        newParams.delete("verified");
        return newParams.toString();
    };

    const handleLogin = async () => {
        if (!formData.identity || !formData.password) {
            toast.show({ message: "Please fill in all required fields.", type: "error" });
            return;
        }

        setIsLoading(true);
        try {
            const res = await apiMutation("post", "/auth/login", formData);

            if (res.status === 'success') {
                toast.show({ message: res.message || "Welcome back! Logged in successfully.", type: "success" });

                let return_url = params.get("return_url") || "/home";

                if (return_url?.includes("/auth/login") || return_url?.startsWith("/auth/")) {
                    return_url = "/home";
                }

                const finalParams = new URLSearchParams(searchParams.toString());
                const authParams = ["identity", "method", "return_url", "error", "code", "reason", "utm_source", "utm_campaign", "reset_token"];
                authParams.forEach(p => finalParams.delete(p));

                const queryString = finalParams.toString();
                const destination = queryString
                    ? `${return_url}${return_url.includes('?') ? '&' : '?'}${queryString}`
                    : return_url;

                const event = new CustomEvent("eduasas:login");
                window.dispatchEvent(event);
                resetuserKey();

                router.replace(destination);
            } else if (res.status === 'error') {
                toast.show({ message: res.message || "Authentication failed. Please verify your credentials.", type: "error" });
            }
        } catch (err: any) {
            toast.show({ message: "Network error. Please check your connection and try again.", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    const cleanParamsString = getCleanParams(formData.identity);
    const registerHref = cleanParamsString ? `/auth/register?${cleanParamsString}` : `/auth/register`;
    const forgotHref = cleanParamsString ? `/auth/forgot?${cleanParamsString}` : `/auth/forgot`;

    return (
        <div className="flex flex-col justify-center w-full max-w-[380px] mx-auto py-4">
            {/* Header Section */}
            <div className="space-y-1.5 mb-8 text-center sm:text-left">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Welcome back
                </h2>
                <p className="text-sm text-slate-500">
                    Please enter your details to access your portal.
                </p>
            </div>

            {/* Form Inputs & Actions */}
            <div className="space-y-5">
                <div className="space-y-1.5">
                    <InputLabel label="Email or Phone Number" />
                    <EduModernInput
                        value={formData.identity}
                        type="contact"
                        className="h-11 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-slate-900 bg-slate-50/50 transition-all"
                        icon={UserIcon}
                        onChange={(val) => setFormData({ ...formData, identity: val })}
                        placeholder="name@institution.com"
                    />
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <InputLabel label="Password" />
                        <Link 
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors" 
                            href={forgotHref}
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <EduModernInput
                        value={formData.password}
                        type="password"
                        className="h-11 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-slate-900 bg-slate-50/50 transition-all"
                        icon={LockIcon}
                        onChange={(val) => setFormData({ ...formData, password: val })}
                        placeholder="••••••••"
                    />
                </div>

                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                        <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
                        />
                        <span className="text-xs font-medium text-slate-600">Remember this device</span>
                    </label>
                </div>

                <div className="pt-2">
                    <AuthButtons 
                        clickAction={handleLogin} 
                        text={isLoading ? "Signing in..." : "Sign In"} 
                    />
                </div>

                {/* Footer Switch to Register */}
                <div className="text-center pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500">
                        Don&apos;t have an account yet?{" "}
                        <Link 
                            className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors ml-1" 
                            href={registerHref}
                        >
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};