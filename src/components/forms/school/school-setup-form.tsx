"use client";

import { useState, useMemo, useEffect } from "react";
import { useSchoolSetupStore } from "@/store/school";
import { useCompatibleGrading } from "@/hooks/school";
import { CompatibleGradingRule } from "@/types/school";
import { cn } from "@/lib/utils/helper";
import { DateUtils } from "@/lib/utils";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/lib/store/use-toast";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@/hooks/dash";
import { EduButton, EduScreenLoader } from "@/components/ui";
import { EduLinearLoader, EduMainLoader } from "@/components/elements";
import { EduModernDateInputV4, EduModernInputV2, EduModernSelect, EduRadioGroup } from "@/components/fields";
import { EduMainModal } from "@/components/modals";
import { apiMutation } from "@/lib/api";
import { GadingPreviewCard, SetUpPreviewCard } from "@/components/cards/dash";
import { SchoolSetuCompletdCard } from "@/components/cards/dash/SetupCompletedCard";

export function SchoolSetupForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const schoolId = searchParams.get("schoolId");

    const toast = useToast();
    const { schools, isLoading: isLoadingSchools } = useUser();

    // 1. TAFUTA SCHOOL MAPEMA (BILA RETURN YA MAPEMA)
    const currentSchool = useMemo(() => {
        return schools?.find((s) => s.schoolId === schoolId);
    }, [schools, schoolId]);

    // 2. WEKA HOOKS ZOTE HAPA JUU KABISA!
    const { globalRules, isLoading: isLoadingRules } = useCompatibleGrading(currentSchool);

    const {
        currentStep, nextStep, prevStep,
        primaryGrading, setGrading,
        year, updateYear, resetSetup,
        initializeTerms, updateTerm
    } = useSchoolSetupStore();

    const terms = useSchoolSetupStore((state) => state.terms);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasTimedOut, setHasTimedOut] = useState(false);
    const [previewRange, setPreviewRange] = useState(false);
    const [finalView, setFinalView] = useState(false);
    const [setUpCopleted, setSetupComplted] = useState(false);
    const [modalView, setModalView] = useState<"NONE" | "SUCCESS" | "ERROR" | "ACTIVE_GUARD">("NONE");

    // Timeout protection
    useEffect(() => {
        const timer = setTimeout(() => {
            if (isLoadingSchools || isLoadingRules) {
                setHasTimedOut(true);
            }
        }, 10000);
        return () => clearTimeout(timer);
    }, [isLoadingSchools, isLoadingRules]);

    // Guard status check
    useEffect(() => {
        if (!isLoadingSchools && schoolId && !currentSchool) {
            toast.show({ message: "School not found.", type: "error" });
        }
        if (currentSchool && currentSchool.status !== "PENDING") {
            setModalView("ACTIVE_GUARD");
        }
    }, [currentSchool, isLoadingSchools, schoolId]);

    // AUTOMATIC DEFAULT SELECTION FOR SINGLE GRADING RULE
    useEffect(() => {
        if (globalRules && globalRules.length === 1 && !primaryGrading) {
            setGrading!(globalRules[0].code);
        }
    }, [globalRules, primaryGrading, setGrading]);

    const totalSteps = useMemo(() => 2 + (terms?.length || 0), [terms?.length]);

    useEffect(() => {
        if (terms.length > 0) {
            if (terms[0].startDate !== year.startDate) {
                updateTerm(0, { startDate: year.startDate });
            }
            const lastIndex = terms.length - 1;
            if (terms[lastIndex].endDate !== year.endDate) {
                updateTerm(lastIndex, { endDate: year.endDate });
            }
        }
    }, [year.startDate, year.endDate, terms.length]);

    const isLoading = (isLoadingSchools || isLoadingRules || isSubmitting) && !hasTimedOut;
    const selectedRule = globalRules?.find((r: CompatibleGradingRule) => r.code === primaryGrading);

    // 🛑 3. CONDITIONAL RETURNS ZOTE ZIKAE HAPA CHINI BAADA YA HOOKS ZOTE KUITWA!
    if (isLoadingSchools) {
        return <EduScreenLoader />;
    }

    if (!schools || schools.length === 0) {
        return null;
    }

    const validateWizard = () => {
        for (const [index, term] of terms.entries()) {
            if (!term.name.trim() || !term.startDate || !term.endDate) {
                toast.show({ message: `Complete all fields for ${term.name || `Term ${index + 1}`}.`, type: "error" });
                return false;
            }
        }

        const firstTermStart = terms[0].startDate;
        const lastTermEnd = terms[terms.length - 1].endDate;

        if (firstTermStart !== year.startDate) {
            toast.show({ message: `First term must open on ${DateUtils.formatCustom(year.startDate, { withDay: false })}`, type: "error" });
            return false;
        }

        if (lastTermEnd !== year.endDate) {
            toast.show({ message: `Final term must close on ${DateUtils.formatCustom(year.endDate, { withDay: false })}`, type: "error" });
            return false;
        }

        for (let i = 1; i < terms.length; i++) {
            const prevEnd = terms[i - 1].endDate;
            const currentStart = terms[i].startDate;
            if (currentStart <= prevEnd) {
                toast.show({ message: `${terms[i].name} cannot start before ${terms[i - 1].name} closes.`, type: "error" });
                return false;
            }
        }
        return true;
    };

    const handleNext = () => {
        if (currentStep === 1 && !primaryGrading) {
            return toast.show({ message: "Please select a grading system.", type: "error" });
        }

        if (currentStep === 2) {
            if (!year.startDate || !year.endDate) {
                return toast.show({ message: "Set both Start and End dates.", type: "error" });
            }
            if (year.startDate >= year.endDate) {
                return toast.show({ message: "Closing date must be after the opening date.", type: "error" });
            }
            if (terms.length === 0) {
                return toast.show({ message: "Select the number of terms.", type: "error" });
            }
        }

        if (currentStep > 2) {
            const termIdx = currentStep - 3;
            const term = terms[termIdx];

            if (!term.name.trim()) return toast.show({ message: "Term name is required.", type: "error" });
            if (!term.startDate || !term.endDate) return toast.show({ message: `Set dates for ${term.name}.`, type: "error" });

            if (term.startDate < year.startDate) {
                return toast.show({ message: `${term.name} cannot open before academic year starts.`, type: "error" });
            }
            if (term.endDate > year.endDate) {
                return toast.show({ message: `${term.name} cannot close after academic year ends.`, type: "error" });
            }

            if (termIdx === 0 && term.startDate !== year.startDate) {
                return toast.show({ message: `First term must start exactly when the year begins.`, type: "error" });
            }

            if (termIdx > 0) {
                const prevTerm = terms[termIdx - 1];
                if (term.startDate <= prevTerm.endDate) {
                    return toast.show({ message: `${term.name} must start after ${prevTerm.name} closes.`, type: "error" });
                }
            }
        }

        if (currentStep < totalSteps) nextStep();
    };

    const openPreview = () => {
        setFinalView(true);
    }

    const handleCurrentTerm = (order: number) => {
        terms.forEach((term, index) => {
            updateTerm(index, {
                isCurrent: term.order === order
            });
        });
    };

    const payload = {
        year: {
            value: Number(year.value),
            startDate: year.startDate,
            endDate: year.endDate
        },
        terms: terms.map(t => ({
            name: t.name,
            startDate: t.startDate,
            endDate: t.endDate,
            order: t.order,
            isCurrent: t.isCurrent
        })),
        ...((primaryGrading && globalRules.length > 1) && { primaryGrading })
    };

    const handleSubmit = async () => {
        if (!validateWizard()) return toast.show({ message: "Data validation failed please retry", type: "error" });

        console.log("Validated posting")

        const hasActive = terms.some(t => t.isCurrent);
        if (!hasActive) return toast.show({ message: "Select the currently active term.", type: "error" });

        setFinalView(false)
        setIsSubmitting(true);

        try {
            if (!currentSchool) return;
            const setupEndpointURL = `/school/setup?schoolUId=${currentSchool?.schoolUId}`;
            const res = await apiMutation("post", setupEndpointURL, payload);

            if (res.status === 'success') {
                setSetupComplted(true);
                //router.replace(`/s?schoolId=${currentSchool.schoolId}`);
            }
        } catch (err) {
            toast.show({ message: "Setup failed. Please try again.", type: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderGradingStep = () => (
        <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 gap-6 bg-inherit">
            <EduRadioGroup<CompatibleGradingRule>
                options={globalRules}
                valueKey="code"
                labelKey="name"
                value={primaryGrading ?? ""}
                onChange={(item) => setGrading!(item.code)}
                renderBadge={(item) => (
                    <>
                        {globalRules.length === 1 && (
                            <span className="text-[9px] bg-primary/10 text-primary px-2 py-1 rounded-md uppercase font-black tracking-widest">
                                Default
                            </span>
                        )}
                    </>
                )}
            />

            <button className={cn(" rounded-md p-2 text-white transition-all duration-300",
                selectedRule ? "bg-blue-500 cursor-pointer hover:bg-blue-400 active:scale-99" : "bg-blue-200"
            )} onClick={() => selectedRule && setPreviewRange(true)}>
                {selectedRule ?
                    (<span className="text-sm font-semibold">Preview ranges & details</span>) :
                    (<span className="text-xs">Select a grading rule to preview.</span>)}

            </button>

        </motion.div>
    );

    const renderYearConfigStep = () => (
        <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 gap-6 bg-card p-1">
            <EduModernDateInputV4
                mode="year"
                value={year.value.toString()}
                onChange={(val) => updateYear({ startDate: val })}
            />
            <div className="flex flex-col md:flex-row gap-3 text-left bg-inherit">
                <EduModernDateInputV4
                    mode="date"
                    value={year.startDate}
                    onChange={(val) => updateYear({ startDate: val })}
                />
                <EduModernDateInputV4
                    mode="date"
                    value={year.endDate}
                    onChange={(val) => updateYear({ endDate: val })}
                />
            </div>
            <EduModernSelect
                options={[
                    { name: "One Term", counts: 1 },
                    { name: "Two Terms", counts: 2 },
                    { name: "Three Terms", counts: 3 },
                    { name: "Four Terms", counts: 4 }
                ]}
                labelKey="name"
                valueKey="counts"
                className="text-left"
                onChange={(val) => {
                    const selected = val as { name: string; counts: number };
                    initializeTerms(selected.counts);
                }}
            />
        </motion.div>
    );

    const renderTermStep = (index: number) => {
        const term = terms[index];
        if (!term) return null;

        return (
            <motion.div key={`term-${index}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 gap-8 text-left bg-card p-1">
                <EduModernInputV2
                    restrict="alphanumeric"
                    value={term.name}
                    onChange={(val) => updateTerm(index, { name: val })}
                />
                <div className="flex flex-col md:flex-row gap-4 bg-inherit">
                    <EduModernDateInputV4 value={term.startDate} onChange={(val) => updateTerm(index, { startDate: val })} />
                    <EduModernDateInputV4 value={term.endDate} onChange={(val) => updateTerm(index, { endDate: val })} />
                </div>
            </motion.div>
        );
    };

    const renderStep = () => {
        if (currentStep === 1) return renderGradingStep();
        if (currentStep === 2) return renderYearConfigStep();
        return renderTermStep(currentStep - 3);
    };

    return (
        <>
            <div className="w-full flex flex-col bg-inherit">
                <div className="w-full h-1 relative overflow-hidden">
                    <AnimatePresence>{(isSubmitting || isLoading) && <EduLinearLoader height={3} />}</AnimatePresence>
                </div>

                <div className={cn("flex flex-col md:flex-row min-h-[320px] max-h-[400px] transition-all duration-300 bg-inherit", (isLoading || isSubmitting) && "opacity-0")}>
                    {/* INFO SIDE */}
                    <div className="w-full md:w-[45%] p-12 flex flex-col justify-center bg-inherit">
                        <div className="text-[10px] font-black text-primary mb-2 tracking-[0.3em] uppercase opacity-70">
                            Step {currentStep} / {totalSteps}
                        </div>

                        <h3 className="text-2xl font-bold mb-4 text-foreground tracking-tight">
                            {currentStep === 1 && "Grading Rules"}
                            {currentStep === 2 && "Academic Year"}
                            {currentStep > 2 && terms[currentStep - 3]?.name}
                        </h3>

                        <p className="text-sm text-wrap text-muted-foreground leading-relaxed mb-8">
                            {currentStep === 1 && "Automate performance tracking and criteria. Select a standard framework to begin setup."}
                            {currentStep === 2 && "Configure your corporate academic timelines and choose the operational terms count."}
                            {currentStep > 2 && `Specify the opening and closing boundaries for ${terms[currentStep - 3]?.name}.`}
                        </p>

                        {/* Progress Dots */}
                        <div className="flex gap-2">
                            {Array.from({ length: totalSteps }).map((_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "h-1 rounded-full transition-all duration-500",
                                        (i + 1) === currentStep ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
                                    )}
                                />
                            ))}
                        </div>
                    </div>

                    {/* FORM SIDE */}
                    <div className="flex-1 flex items-center justify-center p-8 bg-inherit">
                        <div className="w-full max-w-[420px] bg-inherit">
                            <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="p-8 border-t border-border/60 flex items-center gap-3 md:justify-end justify-between min-h-[100px] relative overflow-hidden bg-inherit">
                    <AnimatePresence mode="wait">
                        {!isLoading ? (
                            <motion.div
                                key="buttons"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center gap-3 w-full md:justify-end justify-between bg-inherit"
                            >
                                <EduButton
                                    variant="ghost"
                                    onClick={prevStep}
                                    disabled={currentStep === 1 || isSubmitting}
                                    icon={ArrowLeft}
                                    className="flex-1 md:flex-none min-w-40"
                                >
                                    Back
                                </EduButton>

                                <EduButton
                                    onClick={currentStep < totalSteps ? handleNext : openPreview}
                                    isLoading={isSubmitting}
                                    icon={currentStep < totalSteps ? ArrowRight : CheckCircle2}
                                    loadingText="Setting up"
                                    className="flex-1 md:flex-none min-w-40"
                                >
                                    {currentStep < totalSteps ? "Continue" : "Finish up"}
                                </EduButton>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="loader"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                className="flex items-center gap-3 w-full justify-center md:justify-end bg-inherit"
                            >
                                <EduMainLoader size={24} />
                                <motion.h3
                                    initial={{ x: 10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-muted-foreground text-sm tracking-tight"
                                >
                                    Finishing setup...
                                </motion.h3>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            <EduMainModal
                isOpen={previewRange}
                size="lg"
                className="p-3 border-muted-200 rounded-lg"
                onClose={() => setPreviewRange(false)}
                children={
                    <GadingPreviewCard
                        selectedRule={selectedRule}
                    />
                }
            />

            <EduMainModal
                isOpen={finalView}
                size="md"
                onClose={() => setFinalView(false)}
                children={
                    <SetUpPreviewCard
                        onClose={() => setFinalView(false)}
                        onTermChange={handleCurrentTerm}
                        onSave={handleSubmit}
                        dataPayload={payload}
                    />
                }
                className="p-3 rounded-lg border-muted-200"
            />

            <EduMainModal
                isOpen={setUpCopleted}
                onClose={() => {
                    //resetSetup();
                    //router.back();
                    setSetupComplted(false)
                }}
                className="p-3 border-muted-200 rounded-lg" size="sm">
                <SchoolSetuCompletdCard school={currentSchool} />
            </EduMainModal>
        </>
    );
}