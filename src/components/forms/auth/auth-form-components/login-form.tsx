import Link from "next/link";
import { useState, useEffect } from "react";
import { resetuserKey } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { EduModernInput } from "@/components/ui/edu-modern-input";
import { AuthButtons } from "./action-section";
import { LockIcon, UserIcon } from "lucide-react";
import { useToast } from "@/lib/store";
import { apiMutation } from "@/lib/api";


export const LoginForm = () => {

    // Utilities extractions
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams.toString());

    const identity = params.get("identity");

    const toast = useToast();
    const router = useRouter();

    const [formData, setFormData] = useState({ identity: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (identity) {
            setFormData({ ...formData, identity: identity })
        }
    }, [])

    // Function ya kutengeneza params kwa ajili ya safari (Links/Redirects)
    const getCleanParams = (currentIdentity: string) => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set("identity", currentIdentity);
        newParams.delete("verified");
        return newParams.toString();
    };

    const handleLogin = async () => {
        if (!formData.identity || !formData.password) {
            toast.show({ message: "Please fill in all fields", type: "error" });
            return;
        }

        // if (errors.identity || errors.password) {
        //     toast.error(errors.identity || errors.password);
        // }

        setIsLoading(true);
        try {
            const res = await apiMutation("post", "/auth/login", formData);

            if (res.status === 'success') {
                toast.show({ message: `${res.message || "Loged in sucessfully Welcome back!"}`, type: "success" });

                // 1. Pata callback asilia
                let return_url = params.get("return_url") || "/overview";

                // 2. MTEGO WA LOOP: Zuia callback isijielekeze kwenye login tena
                if (return_url?.includes("/auth/login") || return_url?.startsWith("/auth/")) {
                    return_url = "/overview";
                }

                // 3. SAFISHA PARAMS (Don't carry over auth-specific params)
                const finalParams = new URLSearchParams(searchParams.toString());
                const authParams = ["identity", "method", "return_url", "error", "code", "reason", "utm_source", "utm_campagain", "reset_token"];
                authParams.forEach(p => finalParams.delete(p));

                // 4. JENGA DESTINATION SAHIHI
                const queryString = finalParams.toString();
                const destination = queryString
                    ? `${return_url}${return_url.includes('?') ? '&' : '?'}${queryString}`
                    : return_url;

                // 5. SHTUA EVENT LISTENA KUFUTA DATA KWENYE CACHE KUNA USER MPYA
                const event = new CustomEvent("eduasas:login");
                window.dispatchEvent(event);
                resetuserKey();

                // Tumia replace badala ya push ili kufuta historia ya login loop
                router.replace(destination);
            }
            else if (res.status === 'error') {
                toast.show({ message: `${res.message || "Login failed"}`, type: "error" });
            }
        } catch (err: any) {
            // Catch error hapa ili kuzuia page isihang
            toast.show({ message: "Login failed. Please check internet connection.", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center p-2 h-full w-full">
            <h3 className="font-black">Login to EduAsas</h3>

            <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-[3px]">
                    <label htmlFor="username" className="text-sm">Enter email or phone</label>
                    <EduModernInput
                        value={formData.identity}
                        type="contact"
                        className="h-10"
                        icon={UserIcon}
                        onChange={(val) => setFormData({ ...formData, identity: val })}
                    />
                </div>
                <div className="flex flex-col gap-[3px]">
                    <label htmlFor="password" className="text-sm">Enter password</label>
                    <EduModernInput
                        value={formData.password}
                        type="password"
                        className="h-10"
                        icon={LockIcon}
                        onChange={(val) => setFormData({ ...formData, password: val })}
                    />
                    <Link className="text-sm font-medium text-primary-400 hover:text-primary-600 transission-all duration-300" href={`/auth/forgot${getCleanParams(formData.identity)}`}></Link>
                </div>
                <AuthButtons clickAction={handleLogin} text="Login" />
                <div className="flex w-full text-right cursor-pointer">
                    <Link className="text-sm font-medium text-primary-400 hover:text-primary-600 transission-all duration-300" href={`/auth/register${getCleanParams(formData.identity)}`}></Link>
                </div>
            </div>
        </div>
    )
}