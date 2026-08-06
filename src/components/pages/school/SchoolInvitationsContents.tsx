"use client"
import { useSchoolStaffInvitations } from "@/hooks/school";
import { JSX } from "react/jsx-runtime";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { EduMainModal } from "@/components/modals";
import { StaffInvitationForm } from "@/components/forms/school/StaffInvitationsForm";

export const SchoonInvitationConents = (): JSX.Element => {

    const [formOpen, setFormOpen] = useState(false);

    const canSend = true;
    return (
        <div className="w-full flex flex-col items-center justify-center">
            <div className="w-full">
                <div
                    className="
      relative
      w-full
      overflow-hidden
      rounded-lg
      border
      border-slate-200
      bg-gradient-to-br
      from-blue-50
      via-white
      to-indigo-50
      p-6
      shadow-sm
    "
                >
                    {/* Decorative Shapes */}
                    <div className="absolute inset-0 opacity-40">
                        <div className="absolute -top-10 right-0 h-40 w-40 rounded-full border border-blue-200" />
                        <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full border border-indigo-200" />
                        <div className="absolute top-8 right-20 h-2 w-2 rounded-full bg-blue-300" />
                        <div className="absolute bottom-10 left-16 h-2 w-2 rounded-full bg-indigo-300" />
                    </div>

                    <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div className="max-w-lg">
                            <span
                                className="
            inline-flex
            rounded-full
            bg-blue-100
            px-3
            py-1
            text-xs
            font-semibold
            uppercase
            tracking-wider
            text-blue-700
          "
                            >
                                Workspace Team
                            </span>

                            <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                                Build your school team
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                Invite teachers, administrators and other staff members to securely
                                collaborate in your workspace and manage academic activities together.
                            </p>
                        </div>

                        <button
                            onClick={() => setFormOpen(true)}
                            className="
          inline-flex
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-blue-600
          px-5
          py-3
          text-sm
          font-semibold
          text-white
          transition-all
          hover:bg-blue-700
          active:scale-95
        "
                        >
                            Invite Members
                        </button>
                    </div>
                </div>
            </div>
            <EduMainModal
                isOpen={formOpen}
                size="sm"
                onClose={() => setFormOpen(false)}
                className="border-gray-100 p-1 rounded-lg"
            >
                <StaffInvitationForm />
            </EduMainModal >
        </div>
    )
}