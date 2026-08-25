'use client'
import { EduScreenLoader } from "@/components/ui";
import { useWorkspace } from "@/providers";
import { useEffect, Suspense } from "react";
import { useClassContext } from "../../_components";
import { StreamsPageView } from "./_comonents";

export default function StreamsPage() {
    const { classProfile } = useClassContext();
    const { setWorkspaceHeader } = useWorkspace();


    useEffect(() => {
        if (classProfile?.displayName) {
            document.title = `${classProfile.displayName} - Streams | EduAsas`;
        }
    }, [classProfile?.displayName]);

    useEffect(() => {
        if (classProfile?.displayName) {
            setWorkspaceHeader({ title: `${classProfile.displayName} - Streams` });
        }
    }, [setWorkspaceHeader]);

    if (!classProfile) return null;
    return (
        <Suspense fallback={<EduScreenLoader loadingText="One moment please" />}>
            <StreamsPageView />
        </Suspense>
    )
}