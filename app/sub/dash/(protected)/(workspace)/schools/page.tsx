import { SchoolsPageContents } from "@/components/pages/dash/schools";
import { EduScreenLoader } from "@/components/ui";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Associated Schools",
  description: "Manage your all associated school easly in one place.",
};

export default function SchoolsPage() {
    return (
        <Suspense fallback={<EduScreenLoader />}>
            <SchoolsPageContents />
        </Suspense>
    )
}