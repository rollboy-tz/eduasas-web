import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/lib/store";
import { EduButton, EduModernInput } from "@/components/ui";
import { Contact } from "lucide-react";

export const ForgotForm = () => {
    const [loading, setLoading] = useState(false);
    const [identity, setIdentity] = useState("");

    const toast = useToast();

    const submit = () => {
        if(!identity) {
            toast.show({ message: "Please enter your email or phone number", type: "error" });
            return
        }

        setLoading(true);
        try {
            
        } catch(error){
            
        } finally {
            setLoading(false)
        }
    }

    return(
        <div className="flex flex-col items-center justify-center p-2 h-full w-full">
            <div className="flex flex-col gap-[3px] mb-5">
                <h2 className="font-black text-lg">Forgot Password</h2>
                <p className="text-sm">Enter your email or phone and request OTP</p>
            </div>
            <div className="flex flex-col justify-center gap-5">
                <div className="flex flex-col gap-[3px]">
                    <label htmlFor="username">Enter your email or phone</label>
                    <EduModernInput
                        value={identity}
                        type="contact"
                        onChange={(val) => setIdentity(val)}
                        icon={Contact}
                        required={true}
                        className="h-10"
                    />
                </div>
                <div className="flex flex-col">
                    <EduButton 
                        isLoading={loading}
                        onClick={submit}
                        loadingText="Requesting OTP"
                        className="h-10"
                    >Request OTP</EduButton>
                </div>
            </div>
        </div>
    )
}