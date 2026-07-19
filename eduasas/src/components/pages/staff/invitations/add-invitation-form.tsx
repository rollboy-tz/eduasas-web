'use client'

import { SendInvitationPayload } from "@/types/school";
import { useStaffRoles } from "@/hooks/public";
import { EduMainLoader } from "@/components/elements";
import { EmptyState } from "@/components/feedback";
import { CircleAlert, Send, SendHorizontal, ShieldCheck } from "lucide-react";
import { SmartEmailField, SmartNameField, SmartSelect, SmartSimplePhoneField } from "@/components/ui/fields";
import { useState } from "react";
import { toast } from "sonner";

// --- SUB-COMPONENTS (Nje ya scope ya AddInvitationForm) ---
const RolesIsLoadingView = () => (
    <div className="h-full w-full m-auto flex flex-col items-center justify-center">
        <div className="flex flex-col gap-2">
            <EduMainLoader size={30} />
            <span className="text-sm text-muted-foreground">Wait a second please...</span>
        </div>
    </div>
);

const RolesIsErrorView = () => (
    <div className="w-md h-md flex items-center justify-center">
        <EmptyState
            title="Role retrieval error"
            icon={CircleAlert}
            description="Failed to load roles. Please try again."
        />
    </div>
);

interface AddInvatationFormProps {
    sendInvitation: (payload: SendInvitationPayload) => Promise<any> | void;
    onSucess?: () => void;
}

export const AddInvitationForm = ({ sendInvitation, onSucess }: AddInvatationFormProps) => {
    const { roles, isLoading: loadingRoles, isError: errorRoles } = useStaffRoles();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ email: "", phone: "", general: "", role: "" });
    const [formData, setData] = useState<SendInvitationPayload>({
        name: "", phone: "", email: "", roleId: "", description: ""
    });

    const handleInputChange = (field: string, value: string) => {
        setData(prev => ({ ...prev, [field]: value }));
        // Futa error ya field husika mtumiaji anapobadilisha data
        if (errors[field as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [field]: "", general: "" }));
        }
    };

    const handleSubmit = async () => {
        // 1. Validation ya kimoja wapo (Email au Phone)
        if (!formData.email && (formData.phone?.length ?? 0) <= 4) {
            setErrors(prev => ({...prev,
                email: "Email is required",
                phone: "Phone number is required",
                general: "Please provide either an email or a phone number."
            }));
            return toast.error(errors.general);
        }

        if(!formData.roleId) {
            setErrors(prev => ({ ...prev, role: "Please select role" }));
            return toast.error(errors.role);
        }

        setLoading(true);
        try {
            const result = await sendInvitation(formData);
            if(result.status === "success") return onSucess?.();
        } catch (err: any) {
            setErrors(prev => ({ ...prev, general: err.message || "Failed to send invitation" }));
        } finally {
            toast.error(errors.general || "Failed to send invitation")
            setLoading(false);
        }
    };

    if (loadingRoles) return <RolesIsLoadingView />;
    if (errorRoles) return <RolesIsErrorView />;

    return (
        <div className="w-full max-w-lg mx-auto flex flex-col gap-3 p-5">
            {/* General Error (Kama inatokea kutoka API) */}
            {errors.general && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-xs flex items-center gap-2">
                    <CircleAlert size={14} /> {errors.general}
                </div>
            )}

            <SmartNameField label="Tracking name"  size="md" isFullname={true} value={formData.name} onChange={(v) => handleInputChange("name", v)} />

            <SmartEmailField label="Email address" required={false} size="md" value={formData.email} onChange={(v) => handleInputChange("email", v)} error={errors.email} />

            <SmartSimplePhoneField label="Phone number" size="md" value={formData.phone} onChange={(v) => handleInputChange("phone", v)} error={errors.phone} />

            <SmartSelect
                options={roles}
                labelKey="displayName"
                valueKey="id"
                label="Role"
                itemsContainerClassName="h-[300px] overflow-auto custom-srollbar"
                startIcon={<ShieldCheck size={18} />}
                onChange={(val) => handleInputChange("roleId", val.id)}
            />

            <div className="w-full">
                <label className="text-[11px] font-bold text-muted-foreground ml-1">Description</label>
                <textarea
                    value={formData?.description ?? ""}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="w-full p-3 mt-1 rounded-lg border border-slate-500/30 bg-card text-sm outline-none focus:border-primary"
                    placeholder="Enter short description..."
                />
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-primary text-white font-semibold py-3 rounded-md hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-4"
            >
                {loading ? (
                    <>
                        <EduMainLoader size={20} color="white" />
                        <span>Sending...</span>
                    </>
                ) : (
                    <>
                        <span>Send</span>
                        <SendHorizontal size={20}/>
                    </>
                )}
            </button>
        </div>
    );
};