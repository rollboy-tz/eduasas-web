import { SchoolInvitationContents } from "./_components";
import { EduScreenLoader } from "@/components/ui";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Member Invites",
  description: "Manage all school offered subjects inside your workspace.",
};


export default function StaffInvitationsPage() {
    return(
        <Suspense fallback ={<EduScreenLoader />}>
            <SchoolInvitationContents />
        </Suspense>
    )
}