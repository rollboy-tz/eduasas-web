// path: src/app/u/page.tsx
import { EduScreenLoader } from "@/components/elements";
import { WelcomePage } from "@/components/pages";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Welcome",
    description: "Welcome to EduAsas. Start a smarter journey in education tracking.",
}

export default function WelcomeEduAsas() {
    return(
        // Suspense hapa ni muhimu kwa sababu WelcomePage inatumia useSearchParams
        <Suspense fallback={<EduScreenLoader />}>
            <WelcomePage />
        </Suspense>
    )
}