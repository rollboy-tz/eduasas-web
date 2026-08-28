"use client";

import { useAddSchoolStore, useSchoolCategoriesStore } from "@/store/school";
import { useCategories } from "@/hooks/school/use-categories-sync";
import { showFeedback, EduMainModal } from "@/components/modals";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiMutation } from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/dash";
import { useToast } from "@/lib/store";
import { EduLinearLoader } from "@/components/elements";
import { EduButton, InputLabel } from "@/components/ui";
import { RegisteredSchool, SchoolRegistrationResponeData } from "@/types/school";
import { SchoolAdddeCard } from "./SchoolAddedCArd";
import { EduInput } from "@/components/fields/EduInput";
import { EduSelect } from "@/components/fields/EduSelect";

type ErrorFields =
  | "name"
  | "registrationNumber"
  | "region"
  | "district"
  | "email"
  | "phone"
  | "schoolType"
  | "categoryIds";

interface AddSchoolFormProps {
  /** Ikiwa true, itaonyesha pop-up. Default ni false. */
  showSuccessModal?: boolean;
  /** Hiari: kama unataka kufanya kitu kingine baada ya save. */
  onSuccessAction?: (schoolData: any) => void;
}

// Fields zinazohitajika kwa kila step - chanzo kimoja kinachotumika KWA
// step-navigation NA kwa final-submit validation (angalia bug #4 - awali
// step 3/4 hazikuwa na check yoyote kabla ya Submit).
const STEP_REQUIRED_FIELDS: Record<number, ErrorFields[]> = {
  1: ["name", "registrationNumber"],
  2: ["schoolType", "categoryIds"],
  3: [],
  4: [],
};

const REQUIRED_FIELD_MESSAGES: Partial<Record<ErrorFields, string>> = {
  name: "School name is required",
  registrationNumber: "Registration number is required",
  schoolType: "Please select school type",
  categoryIds: "Please select school level",
};

const STEP_INFO = [
  {
    title: "School Identity",
    desc: "Enter the official school name and government-issued registration number to verify your institution.",
  },
  {
    title: "Classification",
    desc: "Define your school's ownership type and the specific educational levels offered.",
  },
  {
    title: "Geographic Location",
    desc: "Specify the region and district. This helps in localizing system reports and analytics.",
  },
  {
    title: "Official Contacts",
    desc: "Provide verified contact details for administrative communication and system alerts.",
  },
];

const TOTAL_STEPS = STEP_INFO.length;

export function AddSchoolForm({ showSuccessModal = false, onSuccessAction }: AddSchoolFormProps) {
  const {
    currentStep,
    nextStep,
    prevStep,
    setStepData,
    resetStore,
    name,
    registrationNumber,
    schoolType,
    categoryIds,
    region,
    district,
    email,
    phone,
  } = useAddSchoolStore();
  const router = useRouter();
  const { categories } = useSchoolCategoriesStore();
  const { refresh: mutate } = useUser();
  useCategories();

  const toast = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registeredSchool, setRegisteredSchool] = useState<RegisteredSchool>();

  const handleError = (field: string, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const clearError = (field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const formValues: Record<ErrorFields, unknown> = {
    name,
    registrationNumber,
    schoolType,
    categoryIds,
    region,
    district,
    email,
    phone,
  };

  const isFieldEmpty = (field: ErrorFields) => {
    const v = formValues[field];
    return v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);
  };

  /**
   * Validation ya step moja - inatumika kwa "Continue" (per-step) NA kwa
   * "Submit" ya mwisho (fields za step zote pamoja) - chanzo kimoja,
   * hairudiwi mara mbili kwa mikono kama awali.
   */
  function validateFields(fields: ErrorFields[]): boolean {
    const activeErrorKey = fields.find((key) => errors[key]);
    if (activeErrorKey) {
      toast.show({ message: errors[activeErrorKey], type: "error" });
      return false;
    }

    const missing = fields.filter(isFieldEmpty);
    if (missing.length > 0) {
      missing.forEach((field) => {
        const message = REQUIRED_FIELD_MESSAGES[field];
        if (message) handleError(field, message);
      });
      toast.show({ message: "Please fill out all required fields", type: "error" });
      return false;
    }

    return true;
  }

  async function handleFinalSubmit() {
    // BUG #4 ILIYOREKEBISHWA: awali hakuna validation ya step 3/4 kabla ya
    // submit - email/phone zenye format mbaya zingeweza kupita moja kwa
    // moja kama mtumiaji hakuwahi ku-blur field hiyo. Sasa fields ZOTE
    // (step 1-4) zinathibitishwa kabla ya request kutumwa.
    const allFields = Object.values(STEP_REQUIRED_FIELDS).flat();
    const emailOrPhoneInvalid = (email && errors.email) || (phone && errors.phone);

    if (!validateFields(allFields) || emailOrPhoneInvalid) {
      if (emailOrPhoneInvalid) {
        toast.show({ message: errors.email || errors.phone, type: "error" });
      }
      return;
    }

    setIsSubmitting(true);
    const payload = { name, registrationNumber, schoolType, categoryIds, region, district, email, phone };

    try {
      const res = await apiMutation<SchoolRegistrationResponeData>("post", "/school/register", payload);

      if (res.status === "success") {
        const school = res.data.school;
        setRegisteredSchool(school);
        mutate();

        if (showSuccessModal) {
          setIsModalOpen(true);
        } else {
          toast.show({ message: "School added successfully!", type: "success" });
          router.replace(`/schools?refetch_data=needed`);
          resetStore();
        }

        onSuccessAction?.(res.data);
      }
    } catch (err: any) {
      showFeedback({
        type: "error",
        title: "Submission Error",
        message: err?.message || "An unexpected error occurred. Please try again.",
        actions: [
          { label: "Close", variant: "danger", onClick: () => {} },
          { label: "Retry", variant: "primary", onClick: () => handleFinalSubmit() },
        ],
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const completeSetup = () => {
    const sId = registeredSchool?.schoolId;
    router.replace(`/school/setup?schoolId=${sId}`);
    resetStore();
  };

  function handleNextStep() {
    const currentFields = STEP_REQUIRED_FIELDS[currentStep] || [];
    if (currentFields.length > 0 && !validateFields(currentFields)) return;
    nextStep();
  }

  /** Enter kwenye field yoyote ya step ya sasa - inasogeza mbele/inasubmit. */
  function handleStepSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;
    if (currentStep < TOTAL_STEPS) {
      handleNextStep();
    } else {
      handleFinalSubmit();
    }
  }

  const fieldsClasses = "border border-slate-100 bg-white";

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 gap-4 bg-card"
          >
            <div className="col-span-1 flex flex-col gap-1">
              <InputLabel label="School name" className="text-sm font-medium" required />
              <EduInput
                required
                restrict="alphanumeric"
                transform="capitalize"
                type="text"
                value={name}
                onChange={(val) => {
                  clearError("name");
                  setStepData({ name: val });
                }}
                onError={(err) => {
                  if (err) handleError("name", err);
                }}
                className={fieldsClasses}
              />
            </div>

            <div className="col-span-1 flex flex-col gap-1">
              <InputLabel label="Registration number" className="text-sm font-medium" required />
              <EduInput
                required
                type="id"
                transform="uppercase"
                placeholder="e.g. EM.12345"
                value={registrationNumber}
                onChange={(val) => {
                  clearError("registrationNumber");
                  setStepData({ registrationNumber: val });
                }}
                onError={(err) => {
                  if (err) handleError("registrationNumber", err);
                }}
                className={fieldsClasses}
              />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 gap-6 relative z-50 bg-card"
          >
            <div className="col-span-1 flex flex-col gap-1">
              <InputLabel label="School ownership" className="text-sm font-medium" required />
              <EduSelect
                labelKey="label"
                valueKey="value"
                multiple={false}
                value={schoolType}
                className={fieldsClasses}
                options={[
                  { label: "Private", value: "PRIVATE" },
                  { label: "Government", value: "GOVERNMENT" },
                ]}
                onChange={(val) => {
                  clearError("schoolType");
                  setStepData({ schoolType: val as "GOVERNMENT" | "PRIVATE" });
                }}
              />
            </div>

            <div className="col-span-1 flex flex-col gap-1">
              <InputLabel label="School level" className="text-sm font-medium" required />
              <EduSelect
                options={categories.map((c) => ({ label: c.name, value: c.id }))}
                labelKey="label"
                valueKey="value"
                value={categoryIds[0]}
                className={fieldsClasses}
                onChange={(val) => {
                  // BUG ILIYOREKEBISHWA: awali `selected?.value` - ilidhania
                  // onChange inarudisha object nzima, wakati contract halisi
                  // (sawa na field ya "School ownership" juu yake) ni RAW
                  // value moja kwa moja. `categoryIds` ilikuwa inajazwa
                  // `[undefined]` kila wakati.
                  clearError("categoryIds");
                  setStepData({ categoryIds: val ? [val as string] : [] });
                }}
              />
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 gap-4 bg-card"
          >
            <div className="col-span-1 flex flex-col gap-1">
              <InputLabel label="Located region" className="text-sm font-medium" />
              <EduInput
                restrict="letters"
                transform="capitalize"
                value={region || ""}
                className={fieldsClasses}
                onChange={(val) => {
                  clearError("region");
                  setStepData({ region: val || null });
                }}
                onError={(err) => {
                  if (err) handleError("region", err);
                }}
              />
            </div>

            <div className="col-span-1 flex flex-col gap-1">
              <InputLabel label="Located district" className="text-sm font-medium" />
              <EduInput
                restrict="letters"
                transform="capitalize"
                value={district || ""}
                className={fieldsClasses}
                onChange={(val) => {
                  clearError("district");
                  setStepData({ district: val || null });
                }}
                onError={(err) => {
                  if (err) handleError("district", err);
                }}
              />
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 gap-4 bg-card"
          >
            <div className="col-span-1 flex flex-col gap-1">
              <InputLabel label="Official email" className="text-sm font-medium" htmlFor="email" />
              <EduInput
                id="email"
                type="email"
                required={false}
                value={email || ""}
                className={fieldsClasses}
                onChange={(val) => {
                  clearError("email");
                  setStepData({ email: val || null });
                }}
                onError={(err) => {
                  if (err) handleError("email", err);
                }}
              />
            </div>

            <div className="col-span-1 flex flex-col gap-1">
              <InputLabel label="Official phone" className="text-sm font-medium" htmlFor="phone" />
              <EduInput
                id="phone"
                type="phone"
                required={false}
                value={phone || ""}
                className={fieldsClasses}
                onChange={(val) => {
                  clearError("phone");
                  setStepData({ phone: val || null });
                }}
                onError={(err) => {
                  if (err) handleError("phone", err);
                }}
              />
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="w-full h-1 px-1 relative overflow-hidden" aria-hidden="true">
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

      <form onSubmit={handleStepSubmit} className="w-full flex flex-col bg-inherit">
        <div className="flex flex-col md:flex-row min-h-[380px] bg-inherit">
          {/* Upande wa kushoto: maelezo - kwenye simu inakuwa juu, si kando */}
          <div className="w-full md:w-[38%] lg:w-[35%] shrink-0 p-6 sm:p-8 md:p-12 flex flex-col justify-center">
            <motion.div
              key={`info-${currentStep}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-[320px] mx-auto md:mx-0"
            >
              {/* aria-live: screen reader inatangaza jina la step mpya bila
                  kuhitaji mtumiaji kuchunguza page nzima upya */}
              <p className="sr-only" aria-live="polite">
                Step {currentStep} of {TOTAL_STEPS}: {STEP_INFO[currentStep - 1].title}
              </p>

              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-primary leading-tight">
                {STEP_INFO[currentStep - 1].title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 sm:mb-8 text-wrap">
                {STEP_INFO[currentStep - 1].desc}
              </p>

              <div
                className="flex gap-2"
                role="progressbar"
                aria-valuenow={currentStep}
                aria-valuemin={1}
                aria-valuemax={TOTAL_STEPS}
                aria-label={`Step ${currentStep} of ${TOTAL_STEPS}`}
              >
                {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      s === currentStep ? "w-8 bg-primary" : "w-2 bg-background"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Upande wa kulia: fomu */}
          <div className="flex-1 flex items-center justify-center p-6 sm:p-8 md:p-16 bg-inherit">
            <div className="w-full max-w-[450px] bg-inherit">
              <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
            </div>
          </div>
        </div>

        {/*
          BUG ILIYOREKEBISHWA: `justfy-between` (typo, class haipo kabisa
          kwenye Tailwind) - kwenye simu, vitufe havikuwa vinapangika
          ipasavyo kwa sababu class hiyo haikuwahi kutumika kabisa. Sasa
          `justify-between` sahihi + full-width buttons kwenye simu ndogo.
        */}
        <div className="p-6 sm:p-8 md:px-18 border-t-2 border-background flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between md:justify-end gap-3 sm:gap-4 bg-inherit rounded-b-[var(--radius-xl)]">
          <EduButton
            type="button"
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 1 || isSubmitting}
            icon={ArrowLeft}
            className="flex-1 sm:flex-none sm:min-w-40"
          >
            Back
          </EduButton>

          {currentStep < TOTAL_STEPS ? (
            <EduButton
              type="submit"
              icon={ArrowRight}
              iconPosition="right"
              className="flex-1 sm:flex-none sm:min-w-40"
            >
              Continue
            </EduButton>
          ) : (
            <EduButton
              type="submit"
              isLoading={isSubmitting}
              icon={Check}
              iconPosition="right"
              loadingText="Submitting"
              className="flex-1 sm:flex-none sm:min-w-40 border"
            >
              Submit
            </EduButton>
          )}
        </div>
      </form>

      <EduMainModal
        isOpen={isModalOpen}
        onClose={() => {
          resetStore();
          router.back();
          setIsModalOpen(false);
        }}
        className="p-3 border-muted-200 rounded-lg"
        size="sm"
      >
        <SchoolAdddeCard school={registeredSchool} onButtonClick={completeSetup} />
      </EduMainModal>
    </>
  );
}