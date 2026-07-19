import { useState, useEffect } from "react"
import { EduModernInput } from "@/components/ui/edu-modern-input";
import { AuthButtons } from "./action-section";
import { LockIcon, UserIcon } from "lucide-react";

interface LoginFormProps {
    goToForgot?: () => void;
    goToRegister?: () => void;
    identity?: string;
    onIdentityChange?: (identity: string) => void;
}

export const LoginForm = ({ goToForgot, goToRegister, identity, onIdentityChange } : LoginFormProps) => {
    const [formData, setFormData] = useState({ identity: "", password: "" });

    return (
        <div className="flex flex-col items-center p-2 h-full w-full">
            <h3 className="font-black">Login to EduAsas</h3>

            <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-[3px]">
                    <label htmlFor="identity" className="text-sm">Enter email or phone</label>
                    <EduModernInput
                        value={formData.identity}
                        type="contact"
                        className="h-10"
                        icon={<UserIcon size={20}/>}
                        onChange={(val) => setFormData({ ...formData, identity: val })}
                    />
                </div>
                <div className="flex flex-col gap-[3px]">
                    <label htmlFor="identity" className="text-sm">Enter password</label>
                    <EduModernInput
                        value={formData.identity}
                        type="password"
                        className="h-10"
                        icon={<LockIcon size={20}/>}
                        onChange={(val) => setFormData({ ...formData, password: val })}
                    />
                    <span onClick={() => goToForgot } className="w-full text-end text-primary-600 font-medium text-sm hover:text-primary-400 transition-all duration-200">
                        Forgot password.
                    </span>
                </div>
                <AuthButtons clickAction={() => console.log("Handle click")}/>
                <div className="flex w-full text-right cursor-pointer">
                    <span onClick={() => goToRegister} className="text-primary-600 font-medium text-sm hover:text-primary-400 transition-all duration-200">
                        I don't have an account.
                    </span>
                </div>
            </div>
        </div>
    )
}

