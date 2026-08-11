import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { EduModernInputV2 } from "@/components/fields";
import { EduButton, InputLabel } from "@/components/ui";
import { apiMutation, isApiError } from "@/lib/api";
import { Lock, LockKeyhole } from "lucide-react";
import { useToast } from "@/lib/store";

export const ResetForm = () => {
    const toast = useToast();
    const params = useSearchParams();
    const router = useRouter();
    const [formData, setFormData] = useState({ password: "", confirm: "" })
    const [submiting, setSubmiting] = useState(false);

    const token = params.get("token");
    const identity = params.get("identity");

    useEffect(() => {
        if(!token?.trim()) {
            toast.show({ message: "Unauthorized access", type: "error" })
            router.replace("/auth/login");
        }
    })
    const handleSubmit = async () => {

        if(!formData.password || !formData.confirm) {
            toast.show({ message: "Please fill out all fields", type: "error" })
            return
        }

        if (formData.password !== formData.confirm) {
            toast.show({ message: "Password and confirm password don't match", type: "error" });
            return
        }

        setSubmiting(true)
        
        try {
            const { password: newPass } =  formData;
            const response = await apiMutation("patch", "/auth/reset-password", { resetToken: token, newPassword: formData.password });
            if(response.status === "success") {
                toast.show({ message: `Passowrd changed sucessfull please log in to continue`, type: "success" })
                router.replace(`/auth/login?identity=${identity}`)
;            }
            
        } catch (error) {
            if(isApiError(error)){
                const message = error.message ||"Something went wrong please retry"
                toast.show({ message, type: "error" })
            }
        } finally {
            setSubmiting(false)
        }
    }

    return(
        <div className="flex items-center flex-col justify-center p-2 h-full w-full">

            <div className="flex flex-col gap-[3px] mb-5">
                <h2 className="font-black text-lg">Reset Password</h2>
                <p className="text-sm">Create new password and comfirm it, to reset it</p>
            </div>

            <div className="flex flex-col justify-center gap-5">
                <div className="flex flex-col gap-[3px]">
                    <InputLabel label="Enter new password" required/>
                    <EduModernInputV2
                        type="password"
                        value={formData.password}
                        onChange={(val) => setFormData({ ...formData, password: val })}
                        className="h-10"
                        required={true}
                        icon={Lock}
                    />
                </div>
                <div className="flex flex-col gap-[3px]">
                    <InputLabel label="Confirm new password" required/>
                    <EduModernInputV2
                        value={formData.confirm}
                        type="password"
                        required={true}
                        password={formData.password}
                        className="h-10"
                        onChange={(val) => setFormData({ ...formData, confirm: val })}
                        icon={LockKeyhole}
                    />
                </div>
                <EduButton
                    isLoading={submiting}
                    onClick={handleSubmit}
                    className="h-10"
                >
                    Submit
                </EduButton>
            </div>
        </div>
    )
}