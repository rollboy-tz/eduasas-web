"use client";

import { InputLabel } from "@/components/ui/label";
import { EduButton } from "@/components/ui";
import { useMasterClasses } from "@/hooks/school";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { isApiError, apiMutation, ApiResponse, ApiError } from "@/lib/api";
import { useToast } from "@/lib/store";
import { EduSelect } from "@/components/fields/EduSelect";

interface AddClassForProps {
    onSuccess: (Response: ApiResponse) => void;
    onError?: (error: ApiError) => void;
}

export const AddClassForm = ( { onSuccess, onError }: AddClassForProps ) => {

    const { classes } = useMasterClasses();
    const toast = useToast();
    const [classCode, setClassCode] = useState<string>()
    const [submiting, setSubmiting] = useState(false);
    
    if (!classes) return null

    const handleSubmit = async () => {

        const loadingId = toast.show({ message: "Adding Class...", type: "loading"})
        setSubmiting(true)

        try {

           const response = await apiMutation("post", "/school/classes", { classCode })
           if(response.status === "success") {
            onSuccess(response)
           }
        } catch(error) {
            if(isApiError(error)) {
                toast.show({ message: error.message, type: "error" })
                if(onError){
                    onError(error);
                } else {
                    toast.show({ message: error.message || "Unable to add class", type: "error" })
                }
            }
        } finally {
            setSubmiting(false)
            toast.dismiss(loadingId)
        }
    }

    return (
        <div className="flex flex-col gap-5 rounded-lg bg-white p-4">

            {/* Header */}
            <div className="space-y-1">

                <h2 className="text-base font-semibold text-slate-900">
                    Create Class
                </h2>

                <p className="text-sm leading-5 text-slate-500">
                    Select a class level to add it to your school workspace.
                </p>

            </div>



            {/* Form */}
            <div className="flex flex-col gap-4">

                <div className="flex flex-col gap-1.5">

                    <InputLabel
                        label="Class"
                        htmlFor="class"
                        required
                    />

                    <EduSelect
                        options={classes.map(c => ({ label: c.displayName, value: c.classCode }))}
                        labelKey="label"
                        valueKey="value"
                        value={classCode}
                        placeholder="Select class"
                        className="border border-slate-200"
                        onChange={(value) => {setClassCode(value as string)}}
                    />

                </div>

                <div className="mt-2 flex items-start gap-2 rounded-md bg-blue-50/60 px-3 py-2.5">
                    <AlertCircle
                        size={15}
                        className="mt-0.5 shrink-0 text-blue-600"
                    />

                    <div className="text-xs leading-5 text-muted-700">
                        <span>
                            Class naming conventions can be tailored to your institution’s preferences in the workspace settings to reduce confusion. Additional features will become available once the class is created.
                        </span>{" "}
                        <a
                            href="/settings/classes"
                            className="font-medium text-blue-600 underline hover:text-blue-700 inline-flex items-center gap-0.5"
                        >
                            Learn more
                        </a>
                    </div>
                </div>


                <EduButton
                    loadingText="Creatingn"
                    isLoading={submiting}
                    onClick={handleSubmit}
                    className="
                        h-10
                        w-full
                        rounded-lg
                        text-sm
                        font-semibold
                    "
                >
                    Create Class
                </EduButton>

            </div>


        </div>
    );
};