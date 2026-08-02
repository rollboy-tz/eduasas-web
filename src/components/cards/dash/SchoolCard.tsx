"use client"

import { JSX } from "react"
import Link from "next/link";
import { capitalize, cn } from "@/lib/utils";
import { UserAffiliatedSchool } from "@/types/dash";
import { AlertCircle, LucideIcon, MoreHorizontal, MoreVertical } from "lucide-react";
import { CopyButton } from "@/components/elements";
import { Link2Icon, School2, User, IdCardLanyard, ShieldCheckIcon, ShieldEllipsis } from "lucide-react";

interface SchoolCardProps {
    school: UserAffiliatedSchool;
}
export const SchoolCard = ({ school }: SchoolCardProps): JSX.Element => {

    const statusClass: { [key: string]: string } = {
        pending: "bg-blue-400 text-white",
        active: "bg-green-700 text-white",
        closed: "bg-red-700 text-white",
        suspended: "bg-yellow-700 text-white"
    }
    const status = school.status.toLowerCase();
    const roles = school.roles.map((r) => r.displayName).join(" | ");

    const link = `https://${school.slug}.eduasas.co.tz`
    return (
        <div
            key={school.schoolUId}
            className="w-full max-w-md rounded-md bg-white shadow-sm py-2 px-2.5 flex flex-col overflow-hidden"
        >

            <div className="flex items-start">
                <div className="border-r border-gray-200 px-2">
                    <div className="rounded bg-blue-900 p-2 rounded-full">
                        <School2 className="h-5 w-5 text-white" />
                    </div>
                </div>
                <div className="flex-1 flex flex-col gap-3 p-2">
                    <div className="flex items-center ustify-between h-7">

                        {/* School name & ID */}
                        <div className="flex-1 flex flex-col gap-1">
                            <h3 className="text-xs font-black capitalize">{school.displayName || school.displayName}</h3>
                            <div className="flex gap-1 items-center">
                                <span className="text-[11px] font-bold">ID: </span>
                                <span className="text-[10px] tracking-wider font-bold bg-muted-200 px-[2px] py-[1px] rounded-[2px] border border-muted-300">{school.schoolId}</span>
                                <CopyButton content={school.schoolId} />
                            </div>
                        </div>

                        {/* Scool status */}
                        <div>
                            <span className={cn("text-xs font-medium rounded-full px-3 py-1 tracking-wider",
                                statusClass[status])}>{capitalize(school.status)}</span>
                        </div>
                    </div>

                    {/* Position center */}
                    <div className="flex flex-col py-2 relative rounded-md border border-primary-300 mt-6">
                        <div className="flex items-center gap-1 absolute -top-4 left-2 border bg-primary-100 border-primary-300 px-3 py-1 rounded">
                            <User className="text-blue-900" size={19} />
                            <p className="text-[12px] text-blue-900 font-bold">Membership</p>
                        </div>

                        <div className="flex flex-col px-2 py-3 rounded-sm p-2 gap-1">
                            <Row icon={ShieldCheckIcon} value={school.designation || school.primaryRole.displayName} />
                            <Row icon={IdCardLanyard} value={school.staffNumber} />
                        </div>
                    </div>

                    {/* Action center */}
                    <div className="flex flex-col gap-1">
                        {status === "pending" && (
                            <div className="flex items-tart bg-muted-100 gap-1 border border-muted-300 p-2 rounded-md">
                                <div>
                                    <AlertCircle size={14} className="text-blue-900/70" />
                                </div>
                                <span className="text-muted-600 text-[11px]">
                                    Your school is pending please click setup button and configure Academics calender and grading rule to activate it.
                                    <Link href={"#"} className="text-[11px] text-primary-500 font-medium"> Learn more...</Link>
                                </span>
                            </div>)}
                        {status === "closed" && (
                            <div className="flex items-tart bg-muted-100 gap-1 border border-muted-300 p-2 rounded-md">
                                <div>
                                    <AlertCircle size={14} className="text-blue-900/70" />
                                </div>
                                <span className="text-muted-600 text-[11px]">
                                    {school.primaryRole.roleKey === "OWNER" ? "Look like you closed this school please, yu can open or delete it, If you didn't it please contact suport for Further help. "
                                        : "This school is currently closed by school owner please contact them fore more, or contatct support for any issue. "}
                                    <Link href={"#"} className="text-[11px] text-primary-500 font-medium"> Learn more...</Link>
                                </span>
                            </div>)}
                        <div className="flex items-center justify-end gap-3">

                            <button className="rounded-full cursor-pointer text-xs tracking-wider font-semibold text-white bg-primary-500 px-3 py-1">
                                Get in
                            </button>

                            <div className="bg-muted-300 p-1 rounded-full cursor-pointer">
                                <MoreHorizontal size={18} />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Row = ({ icon, value, className }: { icon: LucideIcon; value: string; className?: string; }) => {
    const Icon = icon;
    return (
        <div className="flex items-center gap-2">
            <Icon className="text-blue-900" size={18} />
            <span className={cn("text-[11px] font-bold tracking-wider", className)}>{value}</span>
        </div>
    )
}