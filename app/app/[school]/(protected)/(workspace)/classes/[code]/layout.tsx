"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle, RefreshCw } from "lucide-react";

import { useSchoolClasses, useClassProfile } from "@/hooks/school";
import { EduMainModal } from "@/components/modals";
import { EduScreenLoader } from "@/components/ui";
import { ClassProvider } from "../_components/ClassContext";

export default function ClassValidationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const params = useParams();
    const router = useRouter();
    const classCode = params?.code as string;

    const { classes, isLoading, isError, refresh } = useSchoolClasses();

    const [isErrorModalOpen, setErrorModalOpen] = useState(false);

    // 1. Inatafuta class husika kwenye cache/array
    const currentClass = useMemo(() => {
        if (!classes || !classCode) return null;
        return classes.find(
            (item) => item.classCode?.toLowerCase() === classCode?.toLowerCase()
        );
    }, [classes, classCode]);

    //2 Kuvuta class profile
    const {
        classProfile,
        refreshProfile,
        isUpdating,
        isError: profileError,
        isLoading: profileLoading
    } = useClassProfile(currentClass?.id);

    // 2. Handler ya kufunga modal na kurudi nyuma
    const handleModalClose = useCallback(() => {
        setErrorModalOpen(false);
        router.push("/classes");
    }, [router]);

    // Validation Guard Check
    useEffect(() => {
        if (!isLoading && (!classCode || isError || !currentClass)) {
            setErrorModalOpen(true);
        }
    }, [isLoading, classCode, isError, currentClass]);

    if (isLoading || profileLoading) {
        return <EduScreenLoader loadingText="Fetching class data" />;
    }

    if (!currentClass || isError || !classCode || profileError) {
        return (
            <div className="w-full py-12 text-center">
                <EduMainModal
                    isOpen={isErrorModalOpen}
                    size="sm"
                    onClose={handleModalClose}
                    className="rounded-2xl border-slate-100 p-2 shadow-2xl"
                >
                    <div className="flex flex-col items-center text-center p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500 ring-8 ring-red-50/50 mb-4">
                            <AlertTriangle className="h-6 w-6 stroke-[2.25]" />
                        </div>

                        <h3 className="text-base font-bold text-slate-900 tracking-tight">
                            {isError ? "Failed to Load Class Data" : "Class Profile Not Found"}
                        </h3>

                        <p className="mt-2 text-xs text-slate-500 leading-relaxed max-w-[280px]">
                            {isError
                                ? "We encountered an issue fetching the class details. Please check your connection and try again."
                                : `No active class found matching the code "${classCode}". It may have been moved or deleted.`}
                        </p>

                        <div className="mt-6 flex w-full items-center justify-end gap-2 border-t border-slate-100 pt-4">
                            {isError && refresh && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setErrorModalOpen(false);
                                        refresh();
                                    }}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm active:scale-[0.98]"
                                >
                                    <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                                    Try Again
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={handleModalClose}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-primary-500 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-600 transition-all shadow-sm shadow-primary-500/20 active:scale-[0.98]"
                            >
                                <ArrowLeft className="h-3.5 w-3.5" />
                                Back to Classes
                            </button>
                        </div>
                    </div>
                </EduMainModal>
            </div>
        );
    }

    return (
        <ClassProvider value={{
            classProfile,
            refreshProfile,
            isUpdating
        }}>
            {children}
        </ClassProvider>);
}