"use client";

import { useState, useMemo, useEffect } from "react";
import { useSchoolSetupStore } from "@/store/school";
import { useCompatibleGrading } from "@/hooks/school";
import { CompatibleGradingRule } from "@/types/school";
import { cn } from "@/lib/utils/helper";
import { DateUtils } from "@/lib/utils";
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/lib/store/use-toast";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@/hooks/dash";
import { EduButton, EduScreenLoader } from "@/components/ui";
import { EduLinearLoader, EduMainLoader } from "@/components/elements";
import { EduDateInput } from "@/components/fields/EduDateInput";
import { EduInput } from "@/components/fields/EduInput";
import { EduRadioGroup } from "@/components/fields";
import { EduMainModal } from "@/components/modals";
import { apiMutation } from "@/lib/api";
import { SetUpPreviewCard } from "./SerupPreviewCard";
import { SchoolSetuCompletdCard } from "./SetupCompletedCard";
import { GadingPreviewCard } from "./Gadingpreviewcard";

// Idadi ya terms sasa haichaguliwi na mtumiaji - inawekwa default kiotomatiki.
// (EduSelect ya "Number of terms" imeondolewa kwa ombi maalum.)
const DEFAULT_TERM_COUNT = 2;

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
    currentStep,
    nextStep,
    prevStep,
    primaryGrading,
    setGrading,
    year,
    updateYear,
    resetSetup,
    initializeTerms,
    updateTerm,
  } = useSchoolSetupStore();

  const terms = useSchoolSetupStore((state) => state.terms);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [previewRange, setPreviewRange] = useState(false);
  const [finalView, setFinalView] = useState(false);
  const [setupCompleted, setSetupCompleted] = useState(false);
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

  // Terms hazichaguliwi tena na mtumiaji (EduSelect imeondolewa) - default
  // ya DEFAULT_TERM_COUNT inawekwa mara moja tu, kama store bado ipo
  // kwenye hali yake ya awali (term 1 pekee, isiyojazwa). Hatugusi terms
  // kama mtumiaji ameshaanza kujaza/kubadilisha (mfano baada ya refresh
  // ya sessionStorage-persisted state).
  useEffect(() => {
    if (terms.length !== DEFAULT_TERM_COUNT && terms.every((t) => !t.startDate && !t.endDate)) {
      initializeTerms(DEFAULT_TERM_COUNT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  /**
   * BUG ILIYOREKEBISHWA: `modalView === "ACTIVE_GUARD"` ilikuwa
   * inasetiwa (useEffect juu) lakini haikuwahi kuonyeshwa mahali popote -
   * school ambayo si "PENDING" (tayari imeshasetiwa/imefungwa) ingeweza
   * kuendelea kwenye wizard nzima ya setup bila kizuizi chochote halisi.
   * Sasa tunazuia form isionekane kabisa - modal pekee inaonyeshwa.
   */
  if (modalView === "ACTIVE_GUARD") {
    return (
      <EduMainModal isOpen size="sm" className="p-6 border-muted-200 rounded-lg" onClose={() => router.back()}>
        <div className="flex flex-col items-center text-center gap-3 py-4">
          <div className="rounded-full bg-amber-500/10 p-3">
            <ShieldAlert className="text-amber-600" size={28} />
          </div>
          <h3 className="font-heading font-bold text-lg">Setup not available</h3>
          <p className="text-sm text-muted-foreground">
            This school has already been set up or is no longer pending setup.
          </p>
          <EduButton variant="ghost" onClick={() => router.back()} className="mt-2 min-w-40">
            Go back
          </EduButton>
        </div>
      </EduMainModal>
    );
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
      toast.show({
        message: `First term must open on ${DateUtils.formatCustom(year.startDate, { withDay: false })}`,
        type: "error",
      });
      return false;
    }

    if (lastTermEnd !== year.endDate) {
      toast.show({
        message: `Final term must close on ${DateUtils.formatCustom(year.endDate, { withDay: false })}`,
        type: "error",
      });
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
  };

  const handleCurrentTerm = (order: number) => {
    terms.forEach((term, index) => {
      updateTerm(index, { isCurrent: term.order === order });
    });
  };

  const payload = {
    year: {
      value: Number(year.value),
      startDate: year.startDate,
      endDate: year.endDate,
    },
    terms: terms.map((t) => ({
      name: t.name,
      startDate: t.startDate,
      endDate: t.endDate,
      order: t.order,
      isCurrent: t.isCurrent,
    })),
    ...(primaryGrading && globalRules.length > 1 && { primaryGrading }),
  };

  const handleSubmit = async () => {
    if (!validateWizard()) return toast.show({ message: "Data validation failed please retry", type: "error" });

    const hasActive = terms.some((t) => t.isCurrent);
    if (!hasActive) return toast.show({ message: "Select the currently active term.", type: "error" });

    setFinalView(false);
    setIsSubmitting(true);

    try {
      if (!currentSchool) return;
      const setupEndpointURL = `/school/setup?schoolUId=${currentSchool?.schoolUId}`;
      const res = await apiMutation("post", setupEndpointURL, payload);

      if (res.status === "success") {
        setSetupCompleted(true);
      }
    } catch (err) {
      toast.show({ message: "Setup failed. Please try again.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldsClasses = "border border-slate-100 bg-white";

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

      <button
        type="button"
        className={cn(
          "rounded-md p-2 text-white transition-all duration-300",
          selectedRule ? "bg-blue-500 cursor-pointer hover:bg-blue-400 active:scale-[0.98]" : "bg-blue-200"
        )}
        onClick={() => selectedRule && setPreviewRange(true)}
      >
        {selectedRule ? (
          <span className="text-sm font-semibold">Preview ranges & details</span>
        ) : (
          <span className="text-xs">Select a grading rule to preview.</span>
        )}
      </button>
    </motion.div>
  );

  const renderYearConfigStep = () => (
    <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 gap-6 bg-card p-1">
      <EduDateInput
        label="Academic year"
        mode="year"
        value={year.value.toString()}
        // BUG ILIYOREKEBISHWA: awali `updateYear({ startDate: val })` -
        // field hii ni ya MWAKA (mfano "2026"), si ya tarehe ya kuanza.
        // Ilikuwa inaandika value ya mwaka kwenye `startDate` kimakosa.
        onChange={(val) => updateYear({ value: Number(val) })}
        className={fieldsClasses}
      />

      <div className="flex flex-col md:flex-row gap-3 text-left bg-inherit">
        <EduDateInput
          label="Year opens"
          mode="date"
          value={year.startDate}
          outputFormat={(date) => date.toISOString()}
          max={year.endDate || undefined}
          className={fieldsClasses}
          onChange={(val) => updateYear({ startDate: val })}
        />
        <EduDateInput
          label="Year closes"
          mode="date"
          value={year.endDate}
          outputFormat={(date) => date.toISOString()}
          min={year.startDate || undefined}
          className={fieldsClasses}
          onChange={(val) => updateYear({ endDate: val })}
        />
      </div>

      {/*
        BUG/ONGEZO: uchaguzi wa idadi ya terms umeondolewa kwa ombi -
        sasa ni default ya DEFAULT_TERM_COUNT (2) kiotomatiki, hakuna
        control ya kuchagua tena. Ujumbe huu mfupi unaeleza mtumiaji
        kwanini haoni chaguo, badala ya kumwacha ashangae kimya kimya.
      */}
      <p className="text-xs text-muted-500">
        This academic year is organized into {DEFAULT_TERM_COUNT} terms.
      </p>
    </motion.div>
  );

  const renderTermStep = (index: number) => {
    const term = terms[index];
    if (!term) return null;

    // Kikomo cha kuchagua tarehe - inazuia mtumiaji kuchagua tarehe batili
    // MOJA KWA MOJA badala ya kumsubiri abonyeze "Continue" ndipo aone
    // error toast. Term ya kwanza haiwezi kuanza kabla ya mwaka; kila
    // term nyingine haiwezi kuanza kabla ya term iliyotangulia kufunga.
    const minStart = index === 0 ? year.startDate : terms[index - 1]?.endDate;
    const maxEnd = index === terms.length - 1 ? year.endDate : undefined;

    return (
      <motion.div
        key={`term-${index}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="grid grid-cols-1 gap-8 text-left bg-card p-1"
      >
        <EduInput label="Term name" required restrict="alphanumeric" value={term.name} onChange={(val) => updateTerm(index, { name: val })} />

        <div className="flex flex-col md:flex-row gap-4 bg-inherit">
          <EduDateInput
            label="Opens"
            value={term.startDate}
            outputFormat={(date) => date.toISOString()}
            min={minStart || undefined}
            max={term.endDate || year.endDate || undefined}
            className={fieldsClasses}
            onChange={(val) => updateTerm(index, { startDate: val })}
          />
          <EduDateInput
            label="Closes"
            value={term.endDate}
            outputFormat={(date) => date.toISOString()}
            min={term.startDate || minStart || undefined}
            max={maxEnd || undefined}
            onChange={(val) => updateTerm(index, { endDate: val })}
          />
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
        <div className="w-full h-1 relative overflow-hidden" aria-hidden="true">
          <AnimatePresence>{(isSubmitting || isLoading) && <EduLinearLoader height={3} />}</AnimatePresence>
        </div>

        <div
          className={cn(
            "flex flex-col md:flex-row min-h-[320px] transition-all duration-300 bg-inherit",
            (isLoading || isSubmitting) && "opacity-0"
          )}
        >
          {/* INFO SIDE */}
          <div className="w-full md:w-[40%] lg:w-[38%] shrink-0 p-6 sm:p-8 md:p-12 flex flex-col justify-center bg-inherit">
            <div className="text-[10px] font-black text-primary mb-2 tracking-[0.3em] uppercase opacity-70">
              Step {currentStep} / {totalSteps}
            </div>

            <p className="sr-only" aria-live="polite">
              {currentStep === 1 && "Grading Rules"}
              {currentStep === 2 && "Academic Year"}
              {currentStep > 2 && terms[currentStep - 3]?.name}
            </p>

            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-foreground tracking-tight">
              {currentStep === 1 && "Grading Rules"}
              {currentStep === 2 && "Academic Year"}
              {currentStep > 2 && terms[currentStep - 3]?.name}
            </h3>

            <p className="text-sm text-wrap text-muted-foreground leading-relaxed mb-6 sm:mb-8">
              {currentStep === 1 && "Automate performance tracking and criteria. Select a standard framework to begin setup."}
              {currentStep === 2 && "Configure your academic year timeline. Terms are created automatically once dates are set."}
              {currentStep > 2 && `Specify the opening and closing boundaries for ${terms[currentStep - 3]?.name}.`}
            </p>

            <div
              className="flex gap-2"
              role="progressbar"
              aria-valuenow={currentStep}
              aria-valuemin={1}
              aria-valuemax={totalSteps}
              aria-label={`Step ${currentStep} of ${totalSteps}`}
            >
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1 rounded-full transition-all duration-500",
                    i + 1 === currentStep ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
                  )}
                />
              ))}
            </div>
          </div>

          {/* FORM SIDE */}
          <div className="flex-1 flex items-center justify-center p-6 sm:p-8 md:p-12 bg-inherit overflow-y-auto">
            <div className="w-full max-w-[420px] bg-inherit">
              <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 sm:p-8 border-t border-border/60 flex items-center gap-3 min-h-[100px] relative overflow-hidden bg-inherit">
          <AnimatePresence mode="wait">
            {!isLoading ? (
              <motion.div
                key="buttons"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between md:justify-end gap-3 w-full bg-inherit"
              >
                <EduButton
                  variant="ghost"
                  onClick={prevStep}
                  disabled={currentStep === 1 || isSubmitting}
                  icon={ArrowLeft}
                  className="flex-1 sm:flex-none sm:min-w-40"
                >
                  Back
                </EduButton>

                <EduButton
                  onClick={currentStep < totalSteps ? handleNext : openPreview}
                  isLoading={isSubmitting}
                  icon={currentStep < totalSteps ? ArrowRight : CheckCircle2}
                  loadingText="Setting up"
                  className="flex-1 sm:flex-none sm:min-w-40"
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
        children={<GadingPreviewCard selectedRule={selectedRule} />}
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
            isSaving={isSubmitting}
          />
        }
        className="p-3 rounded-lg border-muted-200"
      />

      <EduMainModal
        isOpen={setupCompleted}
        onClose={() => {
          // ILIKUWA COMMENTED OUT: modal ilifungwa lakini haikufanya
          // chochote - mtumiaji angebaki kwenye wizard iliyokwishakamilika.
          // Sasa tunarudisha store kwenye hali ya awali na kumrudisha
          // mtumiaji kwenye dashboard ya school.
          resetSetup();
          router.replace(`/schools?refetch_data=needed`);
          setSetupCompleted(false);
        }}
        className="p-3 border-slate-100 rounded-lg"
        size="sm"
      >
        <SchoolSetuCompletdCard school={currentSchool} />
      </EduMainModal>
    </>
  );
}