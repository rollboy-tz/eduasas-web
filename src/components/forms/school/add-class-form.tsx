"use client";

import { EduModernSelect } from "@/components/fields";
import { InputLabel } from "@/components/ui/label";
import { EduButton } from "@/components/ui";
import { useMasterClasses } from "@/hooks/school";


export const AddClassForm = () => {

    const { classes } = useMasterClasses();
    if(!classes) return null

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
                        options={classes}
                        labelKey="displayName"
                        valueKey="classCode"
                        placeholder="Select class"
                        className="border border-slate-200"
                    />

                </div>


                <EduButton
                    onClick={() => console.log(classes)}
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