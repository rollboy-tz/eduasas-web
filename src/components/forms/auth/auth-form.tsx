'use client'
import { useRouter, useSearchParams } from "next/navigation";
import { LoginForm, RegisterForm, PasswordForm, VerifyForm } from "./auth-form-components";
import { cn } from "@/lib/utils";

export const AuthForm = ({ action }: { action: string }) => {

    // Utilities extractions
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams.toString());

    //Params & Quaries extractions
    const utm_source = params.get("utm_source");
    const url_tokenn = params.get("token");
    const return_url = params.get("return_url");
    const reset_token = params.get("reset_token")
    const identity = params.get("identity");

    const RenderForm = () => {
        if (action === "register") return <RegisterForm />

        if (action === "verify") return <VerifyForm />

        if (action === "forgot" || action === "reset")  return <PasswordForm />
        
        return <LoginForm />

    }

    return(
        <div className="h-screen w-full md:py-6">
            <div className="w-full h-full flex items-center overflow-hidden p-2 lg:gap-5 md:px-4">

                <div className="hidden lg:block flex-1 h-full bg-primary-300 rounded-md p-1">
                    <h2>Instructions or banner here</h2>
                </div>
                
                <div className="flex-1 h-full">
                    <div className="flex h-full flex-col gap-1 p-2 items-center">
                        <RenderForm />
                    </div>
                </div>
            </div>
        </div>
    )
}