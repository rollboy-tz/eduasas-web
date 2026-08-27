import AuthIndex from "@/components/pages/dash/auth-index";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Authentication",
    description: "Secure platform"
}

export default function AuthPage() {
    return(
        <Suspense>
            <AuthIndex />
        </Suspense>
    )
}