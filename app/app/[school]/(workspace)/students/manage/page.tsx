import { EduScreenLoader } from "@/components/ui";
import { Suspense } from "react";

export default function StudentManagementPage() {
    return (
        <Suspense fallback={<EduScreenLoader />}>

        </Suspense>
    )
}