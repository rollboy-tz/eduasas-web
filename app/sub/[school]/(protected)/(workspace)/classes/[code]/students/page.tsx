'use client'

import { EduScreenLoader } from "@/components/ui";
import { useWorkspace } from "@/providers";
import { useEffect, Suspense } from "react";
import { useClassContext } from "../../_components";
import { ClassStudentsPageView } from "./_components";

export default function ClassStudentsPage() {
    const { classProfile } = useClassContext();
    const { setWorkspaceHeader } = useWorkspace();

    useEffect(() => {
        if (classProfile?.displayName) {
            document.title = `${classProfile.displayName} - Students | EduAsas`;
        }
    }, [classProfile?.displayName]);

    useEffect(() => {
        if (classProfile?.displayName) {
            setWorkspaceHeader({ title: `${classProfile.displayName} - Students` });
        }
    }, [setWorkspaceHeader]);

    if (!classProfile) return null;

    return (
        <Suspense fallback={<EduScreenLoader loadingText="One moment please" />}>
            <ClassStudentsPageView />
        </Suspense>
    )
}