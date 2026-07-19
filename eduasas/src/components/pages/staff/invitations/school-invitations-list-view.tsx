'use client'

import { useSchoolStaffInvitations } from "@/hooks/school";
import { MoreActionsList, SmartResponsiveList, EduMainModal } from "@/components/elements";
import { Edit2, EyeIcon, MoreVertical, Trash2, UserIcon } from "lucide-react";
import { capitalize, DateUtils } from "@/lib/utils";
import { StaffInvitationPreview } from "./staff-invitation-preview";
import { useState } from "react";

export const StaffInvitationsListView = () => {
    const { invitations, metrics: count, isLoading: loadingInvitations } = useSchoolStaffInvitations();

    const [previewOpen, setPreviewOpen] = useState(false);
    const [selectedInvitationId, setSelectedInvitationId] = useState<string | null>(null);

    const handlePreview = (id: string) => {
        setSelectedInvitationId(id);
        setPreviewOpen(true);
    };
     
    return (
        <>
        <div className="w-full">
            <div className="overflow-x-auto w-full">
                <SmartResponsiveList
                    data={invitations}
                    rowKey={"id"}
                    className="rounded"
                    isLoading={loadingInvitations}
                    cardRowsClassName="px-3 py-2.5"
                    bodyClassName="jusify-between"
                    cardHeaderClassName="p-2.5"
                    rowClassName="py-3"


                    columns={[
                        {
                            header: "Invitee",
                            className: "flex-1",
                            isPrimary: true,
                            render: (row) => (
                                <div className="flex items-center gap-3">
                                    <UserIcon className="h-6 w-6 text-foreground fill-foreground" />
                                    <span className="truncate">{row.name}</span>
                                </div>
                            )
                        },
                        {
                            header: "Contact",
                            className: "flex-1 md:min-w-[120px]",
                            render: (row) => <span>{row.email || row.phone}</span>
                        },
                        {
                            header: "Role",
                            className: "flex-1",
                            render: (row) => <span>{row.role.displayName}</span>
                        },
                        {
                            header: "Sent By",
                            render: (row) => <span>{capitalize(row.sender.firstName) + " " + capitalize(row.sender.lastName)}</span>
                        },
                        {
                            header: "Status",
                            className: "flex-1 text-center md:max-w-[101px]",
                            isSecondary: true,
                            render: (row) => <span className="badge badge-success">{row.status}</span>
                        },
                        {
                            header: "Expire Date",
                            className: "flex-1 text-center md:max-w-[110px]",
                            render: (row) => <span>{DateUtils.formatDate(row.expiresAt)}</span>
                        },
                        {
                            header: "Actions",
                            className: "flex-1 text-right md:max-w-[80px]", // Hii itasukuma kila kitu mwisho
                            isAction: true,
                            render: (row) => (
                                <MoreActionsList
                                    trigger={
                                        <button className="rounded-full p-2 hover:bg-ring transition-colors">
                                            <MoreVertical size={16} />
                                        </button>
                                    }
                                    actions={[
                                        {
                                            label: "View invitation",
                                            onClick: () => handlePreview(row.id),
                                            icon: <EyeIcon size={16} />
                                        },
                                        {
                                            label: "Edit",
                                            onClick: () => console.log("Edit"),
                                            icon: <Edit2 size={16} />
                                        },
                                        {
                                            label: "Delete",
                                            onClick: () => console.log("Delete"),
                                            icon: <Trash2 size={16} />,
                                            variant: "danger"
                                        }
                                    ]}
                                />
                            )
                        }
                    ]}
                />
            </div>
        </div>
        
        <EduMainModal
            isOpen={previewOpen}
            onClose={() => {
                setPreviewOpen(false);
                setSelectedInvitationId(null); // Safisha ID unapofunga
            }}>
            {
                selectedInvitationId && (
                    <StaffInvitationPreview invitationId={selectedInvitationId} />
                )
            } 
        </EduMainModal>
        </>
    )
}