"use client";

import { useAddSchoolStore, useSchoolCategoriesStore } from "@/store/school";
import { useCategories } from "@/hooks/school/use-categories-sync";
import { EduModernInputV2, EduModernSelect } from "@/components/fields";
import { showFeedback, showConfirm } from "@/components/modals";
import { ArrowLeft, ArrowRight, Check, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiMutation } from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/dash";
import { useToast } from "@/lib/store";
import { EduLinearLoader } from "@/components/elements";
import { EduButton } from "@/components/ui";

// 1. Define aina ya keys zinazoruhusiwa
type ErrorFields = "name" | "registrationNumber" | "region" | "district" | "email" | "phone" | "schoolType" | "categoryIds";

interface AddSchoolFormProps {
    showSuccessModal?: boolean; // Ikiwa true, itaonyesha pop-up. Default ni false.
    onSuccessAction?: (schoolData: any) => void; // Hiari: Kama unataka kufanya kitu kingine baada ya save
}

// 2. Tumia hiyo type kwenye useState
export function AddSchoolForm({
    showSuccessModal = false,
    onSuccessAction
}: AddSchoolFormProps) {
    const {
        currentStep, nextStep, prevStep, setStepData, resetStore,
        name, registrationNumber, schoolType, categoryIds, region, district, email, phone
    } = useAddSchoolStore();
    const router = useRouter()
    const { categories } = useSchoolCategoriesStore();
    const { refresh: mutate } = useUser();
    useCategories();

    const toast = useToast();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [registeredSchool, setRegisteredSchool] = useState<any>(null);

    // 3. ERROR HANDLERS (Zikae hapa nje ili fomu izione)
    const handleError = (field: string, message: string) => {
        setErrors((prev) => ({ ...prev, [field]: message }));
    };

    const clearError = (field: string) => {
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleFinalSubmit = async () => {
        setIsSubmitting(true);
        const payload = { name, registrationNumber, schoolType, categoryIds, region, district, email, phone };

        try {
            const res = await apiMutation("post", "/school/register", payload);

            if (res.status === 'success') {
                mutate();

                // ANGALIA HAPA: Maamuzi kulingana na Props
                if (showSuccessModal) {

                    showFeedback({
                        type: "success",
                        title: "School Added Successfully",
                        message: "Your school has been registered successfully. You can set it up now or later.",
                        actions: [
                            {
                                label: "Maybe Later",
                                onClick: () => {
                                    router.back();
                                    resetStore();
                                }
                            },
                            {
                                label: "Setup now",
                                variant: "primary",
                                onClick: () => {
                                    const sId = registeredSchool?.schoolId || registeredSchool?.school?.schoolId;
                                    router.replace(`/school/setup?schoolId=${sId}`);
                                    resetStore();
                                }
                            }
                        ]
                    })

                    // Note: Hapa hatufanyi router.replace, tunasubiri user abonyeze button kwenye pop-up
                } else {
                    // SCENARIO B: Silent Flow (Redirect moja kwa moja)
                    toast.show({ "message": "School added successfully!", "type": "success" });
                    router.replace(`/s?schoolId=${res.data.school.schoolId}&need_setup=true`);
                    resetStore();
                }

                // Ikiwa kuna action nyingine ya ziada
                if (onSuccessAction) onSuccessAction(res.data);
            }
        } catch (err: any) {
            showFeedback({
                type: "error",
                title: "Submission Error",
                message: err?.message || "An unexpected error occurred. Please try again.",
                actions: [
                    { label: "Close", variant: "danger", onClick: () => { } },
                    { label: "Retry", variant: "primary", onClick: () => handleFinalSubmit() }
                ]
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const stepInfo = [
        { title: "School Identity", desc: "Enter the official school name and government-issued registration number to verify your institution." },
        { title: "Classification", desc: "Define your school's ownership type and the specific educational levels offered." },
        { title: "Geographic Location", desc: "Specify the region and district. This helps in localizing system reports and analytics." },
        { title: "Official Contacts", desc: "Provide verified contact details for administrative communication and system alerts." },
    ];

    const handleNextStep = () => {
        // 4. KUKAMATA ERRORS ZA STEP YA SASA
        // Tunatumia "as ErrorFields[]" ili TS iwe na amani
        const stepFields: Record<number, string[]> = {
            1: ["name", "registrationNumber"],
            2: ["schoolType", "categoryIds"],
            3: ["region", "district"],
            4: ["email", "phone"]
        };

        const currentFields = stepFields[currentStep] || [];

        // Angalia kama kuna error yoyote iliyosetwa tayari kwenye hizi fields
        const activeErrorKey = currentFields.find(key => errors[key] && errors[key] !== "");

        if (activeErrorKey) {
            toast.show({ "message": errors[activeErrorKey], "type": "error" });
            return; // Stop! Fix current errors first
        }

        // 5. MANUAL VALIDATION (Kama hajakagua lakini ameacha tupu)
        if (currentStep === 1) {
            if (!name || !registrationNumber) {
                if (!name) handleError("name", "School name is required");
                if (!registrationNumber) handleError("registrationNumber", "Registration number is required");
                toast.show({ "message": "Please fill out all required fields", "type": "error" });
                return;
            }
        }

        if (currentStep === 2) {
            if (!schoolType || categoryIds.length === 0) {
                if (!schoolType) handleError("schoolType", "Please select school type");
                if (categoryIds.length === 0) handleError("categoryIds", "Please select school level");
                toast.show({ "message": "Please complete the step first", "type": "error" });
                return;
            }
        }

        // Kila kitu kiko sawa? Vuka!
        nextStep();
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 gap-4 bg-card" >
                        <div className="col-span-1 flex flex-col gap-1">
                            <label htmlFor="name" className="font-medium text-sm">School name</label>
                            <EduModernInputV2
                                required={true}
                                restrict="alphanumeric"
                                transform="capitalize"
                                type="text"
                                value={name}
                                onChange={(val) => { clearError('name'); setStepData({ name: val }) }}
                                onError={(err) => handleError("name", err)} //Error ni string
                            />
                        </div>

                        <div className="col-span-1 flex flex-col gap-1">
                            <label htmlFor="registrationNumber" className="font-medium text-sm">Registration number</label>
                            <EduModernInputV2
                                required={true}
                                restrict="alphanumeric"
                                transform="none"
                                placeholder="e.g. EM.12345"
                                value={registrationNumber}
                                onChange={(val) => { clearError("registrationNumber"); setStepData({ registrationNumber: val }) }}
                                onError={(err) => handleError("registrationNumber", err)}
                            />
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 gap-6 relative z-50 bg-card">
                        <div className="col-span-1 flex flex-col gap-1">
                            <label htmlFor="schoolType" className="font-medium text-sm">School ownership</label>
                            <EduModernSelect
                                labelKey="label"
                                valueKey="value"
                                options={[{ label: "Private", value: "PRIVATE" }, { label: "Government", value: "GOVERNMENT" }]}
                                onChange={(v: any) => { clearError("schoolType"); setStepData({ schoolType: v.value }) }}
                            />
                        </div>
                        <div className="col-span-1 flex flex-col gap-1">
                            <label htmlFor="categoryIds" className="font-medium text-sm">School level</label>
                            <EduModernSelect
                                options={categories.map(c => ({ label: c.name, value: c.id }))}
                                labelKey="label" valueKey="value"
                                onChange={(selected: any) => {
                                    clearError("categoryIds");
                                    const id = selected?.value || "";
                                    setStepData({ categoryIds: id ? [id] : [] });
                                }} />
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 gap-4 bg-card">

                        <div className="col-span-1 flex flex-col gap-1">
                            <label htmlFor="region" className="font-medium text-sm">Located region</label>
                            <EduModernInputV2
                                restrict="letters"
                                transform="capitalize"
                                value={region || ""}
                                onChange={(val) => { clearError("region"); setStepData({ region: val || null }) }}
                                onError={(err) => handleError("region", err)}
                            />
                        </div>

                        <div className="col-span-1 flex flex-col gap-1">
                            <label htmlFor="district" className="font-medium text-sm">Located district</label>
                            <EduModernInputV2
                                restrict="letters"
                                transform="capitalize"
                                value={district || ""}
                                onChange={(val) => { clearError("district"); setStepData({ district: val || null }) }}
                                onError={(err) => handleError("district", err)} />
                        </div>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div key="step4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 gap-4 bg-card">
                        <div className="col-span-1 flex flex-col gap-1">
                            <label htmlFor="email" className="font-medium text-sm">Official email</label>
                            <EduModernInputV2
                                type="email"
                                required={false} //Lazima tupitishe false sababu yenyewe kwa ndani ni true isituletee kero on blur
                                value={email || ""}
                                onChange={(val) => { clearError("email"); setStepData({ email: val || null }) }}
                                onError={(err) => handleError("email", err)}
                            />
                        </div>
                        <div className="col-span-1 flex flex-col gap-1">
                            <label htmlFor="phone" className="font-medium text-sm">Official phone</label>

                            <EduModernInputV2
                                type="phone"
                                required={false} // False Ili isije kutema error kwenye on error
                                value={phone || ""}
                                onChange={(val) => { clearError("phone"); setStepData({ phone: val || null }) }}
                                onError={(err) => handleError("phone", err)}
                            />
                        </div>
                    </motion.div>
                );
            default: return null;
        }
    };

    return (
        <>
            {/* Loader Container */}
            <div className="w-full h-1 px-1 relative overflow-hidden">
                <AnimatePresence>
                    {isSubmitting && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0"
                        >
                            <EduLinearLoader height={3} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="w-full flex flex-col bg-inherit">

                {/* MAIN CONTENT AREA: Hapa ndio pamegawanyika kushoto na kulia */}
                <div className="flex flex-col md:flex-row min-h-[350px] bg-inherit">

                    {/* 1. UPANDE WA KUSHOTO: Maelezo */}
                    <div className="w-full md:w-[45%] p-8 md:p-12 flex flex-col justify-center">
                        <motion.div
                            key={`info-${currentStep}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="max-w-[300px] mx-auto md:mx-0"
                        >
                            <h3 className="text-2xl font-bold mb-4 text-primary leading-tight">
                                {stepInfo[currentStep - 1].title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-8 text-wrap">
                                {stepInfo[currentStep - 1].desc}
                            </p>

                            {/* Progress Dots */}
                            <div className="flex gap-2">
                                {[1, 2, 3, 4].map((s) => (
                                    <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${s === currentStep ? "w-8 bg-primary" : "w-2 bg-background"}`} />
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* 2. UPANDE WA KULIA: Fomu */}
                    <div className="flex-1 flex items-center justify-center p-8 md:p-16 bg-inherit">
                        <div className="w-full max-w-[450px] bg-inherit">
                            <AnimatePresence mode="wait">
                                {renderStep()}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* 3. NAVIGATION: Iko nje ya kuta za kushoto/kulia, na imekaa kulia (justify-end) */}
                <div className="p-8 md:px-18 border-t-2 border-background flex items-center justfy-between md:justify-end gap-4 bg-inherit rounded-b-[var(--radius-xl)]">

                    <EduButton
                        variant="ghost"
                        onClick={prevStep}
                        disabled={currentStep === 1 || isSubmitting}
                        icon={ArrowLeft}
                        className="flex-1 md:flex-none min-w-40"
                    >
                        Back
                    </EduButton>

                    {currentStep < 4 ? (
                        <EduButton
                            onClick={handleNextStep}
                            icon={ArrowRight}
                            iconPosition="right"
                            className="flex-1 md:flex-none min-w-40"
                        >
                            Continue
                        </EduButton>
                    ) : (
                        <EduButton
                            onClick={handleFinalSubmit}
                            isLoading={isSubmitting}
                            icon={Check}
                            iconPosition="right"
                            loadingText="Submitting"
                            className="flex-1 md:flex-none min-w-40 border"
                        >
                            Submit
                        </EduButton>
                    )}
                </div>
            </div>
        </>
    );
}