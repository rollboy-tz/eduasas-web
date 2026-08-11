import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiMutation, isApiError } from "@/lib/api";
import { useToast } from "@/lib/store";
import { EduButton } from "@/components/ui";
import { EduModernInputV2 } from "@/components/fields";
import { Contact } from "lucide-react";

export const ForgotForm = () => {
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams.toString());

    const parIdentity = params.get("identity");
    

    const [loading, setLoading] = useState(false);
    const [identity, setIdentity] = useState("");

    const toast = useToast();
    const router = useRouter();

    useEffect(() => {
        if(parIdentity) {
            setIdentity(parIdentity);
        }
    }, [parIdentity])

    params.delete("identity");
    params.delete("reason");
    const submit = async () => {
        if(!identity) {
            toast.show({ message: "Please enter your email or phone number", type: "error" });
            return
        }

        setLoading(true);
        try {
            const payload = { identity, purpose: "FORGOT_PASSWORD" }
            const response = await apiMutation("post","/auth/resend", payload);
            if(response.status === "success") {
                const message = `OTP sucessfully sent to ${identity},`;
                toast.show({ message, type: "success" })
                router.push(`/auth/verify?reason=reset&identity=${identity}`)
            }
        } catch(error){
            if(isApiError(error)) {
                const message = error.message || "Somthing went wrong, please try again";
                toast.show({ message, type: "error" });
            }
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
                    <EduModernInputV2
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
                    >Request OTP
                    </EduButton>
                </div>
            </div>
        </div>
    )
}