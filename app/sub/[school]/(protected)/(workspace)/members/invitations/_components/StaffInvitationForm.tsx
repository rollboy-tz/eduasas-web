'use client'

import { useState } from "react";
import { useStaffRoles } from "@/hooks/public";
import { SendInvitationPayload } from "@/types/school";
import { parseContact } from "@/lib/utils/contact";
import { EduButton, InputLabel } from "@/components/ui";
import { useToast } from "@/lib/store";
import { useSchoolStaffInvitations } from "@/hooks/school";
import { AlertCircle } from "lucide-react";
import { ApiError, ApiResponse, isApiError } from "@/lib/api";
import { EduModernSelect } from "@/components/fields";
import { EduInput } from "@/components/fields/EduInput";
import { EduSelect } from "@/components/fields/EduSelect";

interface InvitationFormProps {
    onSucess?: (data: ApiResponse) => void;
    onError?: (error: ApiError) => void;
}

export const StaffInvitationForm = ({ onSucess, onError }: InvitationFormProps) => {
    const toast = useToast()
    const { roles, isLoading, isError } = useStaffRoles();

    const [formData, setFormData] = useState<SendInvitationPayload>({ name: "", roleId: "" })
    const [contact, setContact] = useState<string>("");

    const { sendInvitation } = useSchoolStaffInvitations();

    const handleSubmit = async () => {
        const loadingToastId = toast.show({ message: "Invitating a member...", type: "loading" })
        if (!contact.trim()) {
            toast.show({ message: "Please enter invitee email or phone number.", type: "error" })
            toast.dismiss(loadingToastId);
            return;
        }

        const parsed = parseContact(contact);

        if (!parsed.isValid || !parsed.value) {
            toast.show({ message: "Please enter valid email phone number.", type: "error" });
            toast.dismiss(loadingToastId);
            return;
        }

        if (parsed.isValid && parsed.type === "EMAIL") {
            setFormData({ ...formData, email: parsed.value })
        } else if (parsed.isValid && parsed.type === "PHONE") {
            setFormData({ ...formData, phone: parsed.value })
        }

        if (!formData.name.trim()) {
            toast.show({ message: "Please enter invitee name, Eg: Sir John", type: "error" });
            toast.dismiss(loadingToastId);
            return
        }
        if (!formData.roleId.trim()) {
            toast.show({ message: "Role not selected yet. Please select invitee role.", type: "error" })
            toast.dismiss(loadingToastId);
            return
        }
        try {
            const response = await sendInvitation(formData);
            if(response.status === "success") {
                if(onSucess) {
                    onSucess(response)
                }
            }
        } catch (err) {
            if(isApiError(err)){
                if(onError){
                    onError(err)
                }
            }
        } finally {
            toast.dismiss(loadingToastId);
        };

    }


    return (
        <div className="flex flex-col p-3 space-y-1 bg-muted-50 rounded-md h-[550px]">
            <h2 className="font-heading text-sm font-black">
                Invite Member
            </h2>
            <div className="mt-1.5 mb-2.5 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
                <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-blue-600"
                />

                <p className="text-xs leading-5 text-slate-700">
                    Enter the member's <strong>email address</strong> or <strong>phone number</strong>.
                    An invitation will be sent to that contact. Once accepted, the member
                    will automatically gain access to this workspace with the full power role you assign.
                </p>
            </div>

            <div className="flex flex-col space-y-2 h-full">
                <div className="flex flex-col gap-1">
                    <InputLabel label="Invitee Contact (email or phone number)" required/>
                    <EduInput
                        type="contact"
                        placeholder="Phone/Email"
                        onChange={(v) => setContact(v)}
                        required={true}
                        className="border border-muted-300"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <InputLabel label="Invitee name" required/>
                    <EduInput
                        type="fullname"
                        clearable
                        placeholder="Sir Japhet"
                        value={formData.name}
                        onChange={(v) => setFormData({ ...formData, name: v })}
                        required={true}
                        className="border border-muted-300"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <InputLabel label="Invitee role" required/>
                    <EduSelect
                        searchable
                        clearable
                        options={roles}
                        valueKey="id"
                        value={formData.roleId}
                        labelKey="displayName"
                        onChange={(roleId) => setFormData({ ...formData, roleId: roleId as string })}
                        className="border border-muted-300"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <InputLabel label="Description (optional)"/>
                    <EduInput
                        clearable
                        placeholder="Eg, Join us on EduAsas school workspace"
                        value={formData?.description || ""}
                        maxValue={100}
                        type="text"
                        showValueCount
                        onChange={(roleId) => setFormData({ ...formData, roleId: roleId as string })}
                        className="border border-muted-300"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    {/* <span className="text-[10px] text-muted-600 bg-muted- border border-muted-300 rounded px-2 py-1">By submiting your agree this member to access your workspace.</span> */}
                    <EduButton className="h-10" onClick={handleSubmit}>Submit invite</EduButton>
                </div>
            </div>

        </div>
    )
}

const Required = () => (
    <span className="ml-1 text-red-500">*</span>
);