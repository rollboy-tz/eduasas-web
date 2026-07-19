'use client'
import { EduSocialButton, EduButton } from "@/components/ui";
import { triggerGoogleAuth } from "@/lib/helpers/googleOAuth";

export const AuthButtons = (
    { oauthAction, clickAction }:
        { oauthAction?: "login" | "register"; clickAction: () => void; }
) => {



    return (
        <div className="flex w-full flex-col">
            <EduButton
                onClick={clickAction}
                className="w-full h-11 bg-primary-500"
            />
            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
                <div className="h-[1px] flex-1 bg-border " />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">OR</span>
                <div className="h-[1px] flex-1 bg-border " />
            </div>

            <EduSocialButton
                text="Use google"
                iconPath="/icons/google.png"
                onClick={() => triggerGoogleAuth(oauthAction)}
                size="md"
                className="w-full h-11 shadow-sm"
            />
        </div>
    )
}