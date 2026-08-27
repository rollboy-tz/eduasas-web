'use client'

import { EduScreenLoader } from "@/components/ui";
import { useWorkspace } from "@/providers";
import { useEffect, Suspense } from "react";
import { useClassContext } from "../../_components";
import { ClassSubjectsPageView } from "./_components";

export default function ClassSubjectsPage() {
    const { classProfile } = useClassContext();
    const { setWorkspaceHeader } = useWorkspace();

    useEffect(() => {
        if (classProfile?.displayName) {
            document.title = `${classProfile.displayName} - Subjects | EduAsas`;
        }
    }, [classProfile?.displayName]);

    useEffect(() => {
        if (classProfile?.displayName) {
            setWorkspaceHeader({ title: `${classProfile.displayName} - Subjects` });
        }
    }, [setWorkspaceHeader]);

    if (!classProfile) return null;

    return (
        <Suspense fallback={<EduScreenLoader loadingText="One moment please" />}>
            <ClassSubjectsPageView />
        </Suspense>
    )
}