import { EduScreenLoader } from "@/components/ui";
import { Suspense } from "react";

export default function StudntProfilePage() {
    return (
        <Suspense fallback={<EduScreenLoader />}>

        </Suspense>
    )
}