'use client'

import { EduScreenLoader } from "@/components/ui";
import { Suspense, useEffect } from "react";
import { useClassContext } from "../../_components";
import { SectionsPageView } from "./_components";
import { useWorkspace } from "@/providers";

export default function SectionsPage() {
    const { classProfile } = useClassContext();
    const { setWorkspaceHeader } = useWorkspace();


    useEffect(() => {
        if (classProfile?.displayName) {
            document.title = `${classProfile.displayName} - Sections | EduAsas`;
        }
    }, [classProfile?.displayName]);

    useEffect(() => {
        if (classProfile?.displayName) {
            setWorkspaceHeader({ title: `${classProfile.displayName} - Sections` });
        }
    }, [setWorkspaceHeader]);

    if (!classProfile) return null;
    return (
        <Suspense fallback={<EduScreenLoader loadingText="One moment please" />}>
            <SectionsPageView currentClass={classProfile}/>
        </Suspense>
    )
}