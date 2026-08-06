import { SchoonInvitationConents } from "@/components/pages/school";
import { EduScreenLoader } from "@/components/ui";
import { Suspense } from "react";

export default function StaffInvitationsPage() {
    return(
        <Suspense fallback ={<EduScreenLoader />}>
            <SchoonInvitationConents />
        </Suspense>
    )
}