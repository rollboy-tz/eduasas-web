"use client";

import { useEffect, useState } from "react";
import { EduMainModal } from "@/components/modals";
import { SmartResponsiveList, SmartFlexTable } from "@/components/ui";
import { StaffInvitationForm } from "@/components/forms/school/StaffInvitationsForm";
import { useSchoolStaffInvitations } from "@/hooks/school";
import { text } from "@/lib/string";
import { cn } from "@/lib/utils";
import { InstitutionalInvitation } from "@/types/school";
import { useToast } from "@/lib/store";
import { useWorkspace } from "@/providers";

const STATUS_STYLES: Record<string, string> = {
    pending: "bg-blue-100 text-blue-700 font-medium",
    joined: "bg-emerald-100 text-emerald-700 font-medium",
    cancelled: "bg-rose-100 text-rose-700 font-medium",
    declined: "bg-rose-100 text-rose-700 font-medium",
    expired: "bg-amber-100 text-amber-700 font-medium"
} as const;

export const SchoolInvitationContents = () => {
    const [formOpen, setFormOpen] = useState(false);
    const { setWorkspaceHeader } = useWorkspace();
    const toast = useToast();
    const { invitations = [], refresh } = useSchoolStaffInvitations();
    const [selectedInviteIds, setSelectedInviteIds] = useState<Set<string>>(new Set());


    useEffect(() => {
        setWorkspaceHeader({ title: "Members Invitates" });
    }, [setWorkspaceHeader]);


    return (
        <div className="flex w-full flex-col items-center justify-center">
            {/* Banner Section */}
            <div className="w-full">
                <div className="relative w-full overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 shadow-sm">
                    <div className="absolute inset-0 opacity-40 pointer-events-none">
                        <div className="absolute -top-10 right-0 h-40 w-40 rounded-full border border-blue-200" />
                        <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full border border-indigo-200" />
                        <div className="absolute top-8 right-20 h-2 w-2 rounded-full bg-blue-300" />
                        <div className="absolute bottom-10 left-16 h-2 w-2 rounded-full bg-indigo-300" />
                    </div>

                    <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div className="max-w-lg">
                            <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
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
                            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-95 shadow-sm"
                        >
                            Invite Members
                        </button>
                    </div>
                </div>
            </div>

            {/* Invitations Table / List */}
            <div className="w-full mt-4">
                {invitations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 p-8 text-center bg-white">
                        <p className="text-sm text-slate-500">No invitations sent yet.</p>
                    </div>
                ) : (
                    <SmartResponsiveList<InstitutionalInvitation>
                        data={invitations}
                        className="rounded-md shadow-sm"
                        rowKey="id"
                        selectedKeys={selectedInviteIds} // State yako ya ID zilizochaguliwa (Set au Array)
                        onSelectionChange={setSelectedInviteIds} // Function ya kuseti selected IDs
                        cardClassName="bg-white"
                        cardRowsClassName="text-sm text-slate-800 font-semibold"
                        bodyClassName="bg-white"
                        columns={[
                            {
                                header: "Invitee",
                                isPrimary: true, // Kichwa kikuu cha kadi kwenye mobile
                                render: (invite) => (
                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-semibold text-slate-900">{invite.name}</span>
                                        <span className="text-xs text-slate-500">{invite.email || invite.phone}</span>
                                    </div>
                                ),
                            },
                            {
                                header: "Invited As",
                                className: "flex-1",
                                headerCellClasses: "flex-1",
                                dataCellClasses: "flex-1 text-left",
                                render: (invite) => <span>{invite.role.displayName}</span>
                            },
                            {
                                header: "Invited By",
                                className: "flex-1 text-start",
                                headerCellClasses: "flex-1",
                                dataCellClasses: "flex-1 text-left",
                                render: (invite) => <span>{invite.sender.firstName + " " + invite.sender.lastName}</span>,
                            },
                            {
                                header: "Status",
                                isSecondary: true, // Badge inayokaa kulia juu kwenye mobile
                                className: "w-18 text-end",
                                render: (invite) => (
                                    <span
                                        className={cn(
                                            "text-xs font-medium rounded-full px-3 py-1 inline-block",
                                            STATUS_STYLES[text.lowerCase(invite.status)] || "bg-slate-100 text-slate-700"
                                        )}
                                    >
                                        {text.capitalize(invite.status)}
                                    </span>
                                ),
                            }
                        ]}
                    />
                )}
            </div>

            {/* Modal */}
            <EduMainModal
                isOpen={formOpen}
                size="sm"
                onClose={() => setFormOpen(false)}
                className="rounded-lg border-gray-100 p-1"
            >
                <StaffInvitationForm
                    onSucess={(res) => {
                        refresh()
                        setFormOpen(false)
                        toast.show({ message: res.message, type: "success" })
                    }}
                />
            </EduMainModal>
        </div>
    );
};