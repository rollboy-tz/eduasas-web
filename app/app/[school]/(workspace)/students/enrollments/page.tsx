import { EduScreenLoader } from "@/components/ui";
import { Suspense } from "react";

export default function StudentsEnrollmentsPage(){
    return(
        <Suspense fallback={<EduScreenLoader/>}>

        </Suspense>
    )
}