'use client'
import { useSchoolStaffList } from "@/hooks/school";
import { MoreActionsList, SmartResponsiveList, EduMainModal } from "@/components/elements";
import { capitalize } from "@/lib/utils";
import { Edit2, EyeIcon, MoreVertical, Trash2, UserIcon } from "lucide-react";
import { StaffProfilePreview } from "./staff-profile-preview";
import { useState } from "react";


export const StaffListView = () => {
    const [openPreiew, setOpenPreview] = useState(false)
    const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
    const { staffList, totalCount: staffCount, isLoading: loadingStaff } = useSchoolStaffList();

    const handleViewMore = (id: string) => {
        setSelectedStaffId(id);
        setOpenPreview(true);
    };

    return (
        <>
            <div className="w-full">
                <div>
                    <SmartResponsiveList
                        data={staffList}
                        rowKey={"staffId"}
                        className="rounded"
                        rowClassName="bg-card/1"
                        isLoading={loadingStaff}
                        columns={[
                            {
                                header: "Member",
                                isPrimary: true,
                                className: "flex-[1] font-bold text-foreground",
                                render: (row) => (
                                    <div className="flex items-center gap-2">
                                        <UserIcon className="w-6 h-6 text-foreground fill-foreground" />
                                        <span>{capitalize(row.user.firstName) + " " + capitalize(row.user.lastName)}</span>
                                    </div>
                                )
                            },
                            {
                                header: "Position",
                                className: "flex-1",
                                render: (row) => <span>{row.designation || row.roles.sort((a, b) => a.priority - b.priority)[0]?.displayName}</span>
                            },
                            {
                                header: "Contact",
                                className: "flex-1",
                                render: (row) => <span>{row.user.email || row.user.phone}</span>
                            },
                            {
                                header: "Staff Number",
                                className: "flex-1",
                                render: (row) => <span>{row.staffNumber}</span>
                            },
                            {
                                header: "Status",
                                isSecondary: true,
                                className: "w-[120px] text-center",
                                render: (row) => <span className="badge badge-success">{row.status}</span>
                            },
                            {
                                header: "Actions",
                                isAction: true,
                                className: "flex-1 text-right md:max-w-[80px]", // Hii itasukuma kila kitu mwisho
                                render: (row) => (
                                    <MoreActionsList
                                        trigger={
                                            <button className="rounded-full p-2 hover:bg-ring transition-colors">
                                                <MoreVertical size={16} />
                                            </button>
                                        }
                                        actions={[
                                            {
                                                label: "Vie More",
                                                onClick: () => handleViewMore(row.staffId),
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
                className="w-[450px]"
                isOpen={openPreiew}
                onClose={() => {
                    setOpenPreview(false);
                    setSelectedStaffId(null); // Safisha ID unapofunga
                }}>
                {
                    selectedStaffId && (
                        <StaffProfilePreview  staffId={selectedStaffId} />
                    )
                }
            </EduMainModal>
        </>
    )
}