import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { EduButton, EduModernInput } from "@/components/ui";
import { apiMutation } from "@/lib/api";
import { Lock, LockKeyhole } from "lucide-react";
import { useToast } from "@/lib/store";

export const ResetForm = () => {
    const toast = useToast();
    const [formData, setFormData] = useState({ password: "", confirm: "" })
    const [submiting, setSubmiting] = useState(false);

    const handleSubmit = () => {

        console.log("Date: ", formData)


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
            console.log("Simulating API form passwprd reset. DATA: ", formData);
            toast.show({ message: `Passowrd changed sucessfull to ${formData.password}`, type: "success" })
        } catch (error) { } finally {
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
                    <label htmlFor="password">Enter new password</label>
                    <EduModernInput
                        type="password"
                        value={formData.password}
                        onChange={(val) => setFormData({ ...formData, password: val })}
                        className="h-10"
                        required={true}
                        icon={Lock}
                    />
                </div>
                <div className="flex flex-col gap-[3px]">
                    <label htmlFor="password">Confirm new password</label>
                    <EduModernInput
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