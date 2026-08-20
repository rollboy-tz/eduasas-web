"use client";

import { EduModernSelect } from "@/components/fields";
import { InputLabel } from "@/components/ui/label";
import { EduButton } from "@/components/ui";
import { useMasterClasses } from "@/hooks/school";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { isApiError, apiMutation } from "@/lib/api";


export const AddClassForm = () => {

    const { classes } = useMasterClasses();

    const [classCode, setClassCode] = useState<string>()
    const [submiting, setSubmiting] = useState(false);
    
    if (!classes) return null

    const handleSubmit = async () => {
        setSubmiting(true)

        try {

           const response = await apiMutation("post", "")

        } catch(error) {
            if(isApiError(error)) {

            }
        } finally {
            setSubmiting(false)
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

                    <EduModernSelect
                        options={classes.map(c => ({ label: c.displayName, value: c.classCode }))}
                        labelKey="label"
                        valueKey="value"
                        placeholder="Select class"
                        className="border border-slate-200"
                        onChange={(c) => {setClassCode(c.value)}}
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