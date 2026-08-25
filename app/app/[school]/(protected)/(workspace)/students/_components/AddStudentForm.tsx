// path: src/components/students/enroll-student-form.tsx

"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  Loader2,
  X,
  UserPlus,
  CheckCircle2,
} from "lucide-react";
import { useEnrollStudentStore } from "@/store/school/students-form-store";
import { EduInput } from "@/components/fields/EduInput";
import { EduSelect } from "@/components/fields/EduSelect";
import { EduDateInput } from "@/components/fields/EduDateInput/EduDateInput";
import { InputLabel } from "@/components/ui";
import { useClassProfile, useSchoolClasses, useStudents } from "@/hooks/school";
import { CopyButton, EduMainLoader, ThreeLoadingDot } from "@/components/elements";
import { EnrollStudentOutput, EnrollStudentResult } from "@/types/school";
import { isApiError } from "@/lib/api";
import { enrollSchema } from "./EnrollmentSchema";
import { useToast } from "@/lib/store";

interface ClassDataProp {
  classId: string;
  sectionId: string;
  streamId?: string;
}

interface EnrollStudentFormProps {
  classData?: ClassDataProp;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  onClose?: () => void;
}

export function EnrollStudentForm({
  classData,
  onSuccess,
  onError,
  onClose,
}: EnrollStudentFormProps) {
  const toast = useToast();
  const {
    formData,
    setProfileData,
    setAcademicData,
    setGuardianData,
    resetForm,
  } = useEnrollStudentStore();

  const { enrollStudent, isEnrolling: isSubmitting } = useStudents();

  const hasClassContext = Boolean(classData?.classId && classData?.sectionId);

  const steps = hasClassContext
    ? [
      { id: "profile", title: "Personal Profile" },
      { id: "academic", title: "Academic Records" },
      { id: "guardian", title: "Guardian Details" },
      { id: "preview", title: "Review & Confirm" },
    ]
    : [
      { id: "placement", title: "Class Placement" },
      { id: "profile", title: "Personal Profile" },
      { id: "academic", title: "Academic Records" },
      { id: "guardian", title: "Guardian Details" },
      { id: "preview", title: "Review & Confirm" },
    ];

  const [activeTab, setActiveTab] = useState<string>(steps[0].id);
  const [selectedClassId, setSelectedClassId] = useState<string>(
    classData?.classId || ""
  );

  const [isAgreed, setIsAgreed] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);
  const [studentRes, setStudentRes] = useState<EnrollStudentResult>({ studentId: "", systemId: "", message: "" })
  const [submitError, setSubmitError] = useState<string | null>(null);

  const activeIndex = steps.findIndex((s) => s.id === activeTab);
  const currentStep = steps[activeIndex];

  const { classes, isLoading } = useSchoolClasses();
  const { classProfile, isLoading: loadingClass } = useClassProfile(selectedClassId);

  type OptionItem = { value: string; key: string };

  const genders: OptionItem[] = [
    { value: "MALE", key: "Male" },
    { value: "FEMALE", key: "Female" },
  ];

  const relationships: OptionItem[] = [
    { value: "PARENT", key: "Parent" },
    { value: "FATHER", key: "Father" },
    { value: "MOTHER", key: "Mother" },
    { value: "GUARDIAN", key: "Guardian" },
  ];

  const classesOption: OptionItem[] = classes.map((cls) => ({
    value: cls.id,
    key: cls.displayName,
  }));

  const sectionsOption: OptionItem[] = (classProfile?.sections || []).map(
    (section) => ({
      value: section.id,
      key: section.name,
    })
  );

  useEffect(() => {
    if (
      sectionsOption.length === 1 &&
      formData.academic.sectionId !== sectionsOption[0].value
    ) {
      setAcademicData({ sectionId: sectionsOption[0].value });
    }
  }, [sectionsOption, formData.academic.sectionId, setAcademicData]);

  const streamsOption: OptionItem[] = (classProfile?.streams || []).map(
    (stream) => ({
      value: stream.id,
      key: stream.name,
    })
  );

  useEffect(() => {
    if (
      streamsOption.length === 1 &&
      formData.academic.streamId !== streamsOption[0].value
    ) {
      setAcademicData({ streamId: streamsOption[0].value });
    }
  }, [streamsOption, formData.academic.streamId, setAcademicData]);

  // STEP VALIDATION WITH PROFESSIONAL ENGLISH TOAST MESSAGES
  const validateStep = (stepId: string): boolean => {
    if (stepId === "placement") {
      if (!selectedClassId) {
        toast.show({ message: "Please select a target class to proceed.", type: "error" });
        return false;
      }
      if (!formData.academic.sectionId) {
        toast.show({ message: "Please assign a specific section.", type: "error" });
        return false;
      }
    }

    if (stepId === "profile") {
      if (!formData.profile.firstName?.trim()) {
        toast.show({ message: "First name is required.", type: "error" });
        return false;
      }
      if (!formData.profile.lastName?.trim()) {
        toast.show({ message: "Last name is required.", type: "error" });
        return false;
      }
      if (!formData.profile.gender) {
        toast.show({ message: "Please select gender.", type: "error" });
        return false;
      }
      if (!formData.profile.dateOfBirth) {
        toast.show({ message: "Date of birth is required.", type: "error" });
        return false;
      }
    }

    if (stepId === "academic") {
      if (!formData.academic.admissionNo?.trim()) {
        toast.show({ message: "Admission number is required.", type: "error" });
        return false;
      }
      if (!formData.academic.entryYear) {
        toast.show({ message: "Entry year is required.", type: "error" });
        return false;
      }
    }

    if (stepId === "guardian") {
      if (!formData.guardian.fullName?.trim()) {
        toast.show({ message: "Guardian full name is required.", type: "error" });
        return false;
      }
      if (!formData.guardian.relationship) {
        toast.show({ message: "Please select guardian relationship.", type: "error" });
        return false;
      }
      if (!formData.guardian.phone?.trim()) {
        toast.show({ message: "Guardian contact number is required.", type: "error" });
        return false;
      }
    }

    return true;
  };

  const handleNextStep = () => {
    if (!validateStep(activeTab)) return;

    if (activeIndex < steps.length - 1) {
      setActiveTab(steps[activeIndex + 1].id);
    }
  };

  const handleTabChange = (targetStepId: string) => {
    const targetIndex = steps.findIndex((s) => s.id === targetStepId);

    if (targetIndex > activeIndex) {
      for (let i = activeIndex; i < targetIndex; i++) {
        if (!validateStep(steps[i].id)) return;
      }
    }

    setActiveTab(targetStepId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    try {
      const rawPayload = {
        ...formData,
        academic: {
          ...formData.academic,
          entryYear: Number(formData.academic.entryYear),
          sectionId: classData?.sectionId || formData.academic.sectionId,
          streamId: classData?.streamId || formData.academic.streamId || null,
        },
        profile: {
          ...formData.profile,
          photoUrl: null,
        },
      };

      const payload = enrollSchema.parse(rawPayload);
      const response = await enrollStudent(payload as EnrollStudentOutput);

      setSubmitted(true);

      if (onSuccess) {
        onSuccess(response);
      }

      setStudentRes(response.data);

    } catch (err: any) {
      setSubmitted(false);

      if (err?.name === "ZodError" || err?.issues) {
        const firstIssue = (err.issues || err.errors)?.[0];
        setSubmitError(`Validation Error: ${firstIssue?.message || "Please check your input details."}`);
      } else if (isApiError(err)) {
        setSubmitError(err.message || "Unable to complete student enrollment. Please try again.");
      } else {
        setSubmitError("An unexpected system error occurred. Please try again later.");
      }
    }
  };

  const handleResetAndNew = () => {
    if (resetForm) resetForm();
    setIsAgreed(false);
    setSubmitted(false);
    setSubmitError(null);
    setActiveTab(steps[0].id);
  };

  const inputStyle = "bg-white border border-slate-200 rounded-md";

  const prevStepIdx = activeIndex > 0 ? activeIndex - 1 : null;
  const nextStepIdx = activeIndex < steps.length - 1 ? activeIndex + 1 : null;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-[540px] bg-white rounded-md flex flex-col justify-between py-5 px-2 overflow-hidden"
    >
      {/* 1. COMPACT STEPPER HEADER */}
      <div className="shrink-0 pb-2 border-b border-slate-100 flex flex-col items-center gap-1.5">
        <div className="flex items-center justify-center w-full max-w-[180px] mx-auto min-h-[28px]">
          {prevStepIdx !== null ? (
            <button
              type="button"
              onClick={() => handleTabChange(steps[prevStepIdx].id)}
              className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold opacity-40 hover:opacity-80 transition-all cursor-pointer shrink-0 scale-90"
            >
              <Check className="h-2.5 w-2.5" />
            </button>
          ) : (
            <div className="w-5 h-5 shrink-0" />
          )}

          <div className="flex-1 h-[2px] mx-2.5 bg-slate-200" />

          <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-blue-500/20 shrink-0 scale-105 transition-all">
            {activeIndex + 1}
          </div>

          <div className="flex-1 h-[2px] mx-2.5 bg-slate-200" />

          {nextStepIdx !== null ? (
            <button
              type="button"
              onClick={() => handleTabChange(steps[nextStepIdx].id)}
              className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold opacity-60 hover:opacity-100 transition-all cursor-pointer shrink-0 scale-90"
            >
              {nextStepIdx + 1}
            </button>
          ) : (
            <div className="w-5 h-5 shrink-0" />
          )}
        </div>

        <h3
          key={currentStep.id}
          className="text-xs font-bold text-slate-800 tracking-wide uppercase animate-in fade-in duration-200"
        >
          {currentStep.title}
        </h3>
      </div>

      {/* 2. FORM BODY */}
      <div className="overflow-y-auto pr-1 flex-1 space-y-3.5 py-3">
        {/* STEP 0: PLACEMENT */}
        {!hasClassContext && activeTab === "placement" && (
          <div className="flex flex-col gap-3.5">
            <div className="flex items-start gap-2.5 p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-blue-800">
              <AlertCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <span className="font-semibold block text-blue-950 mb-0.5">
                  Class Placement Notice
                </span>
                Please select the target class and section/stream to assign this student before proceeding with enrollment.
              </div>
            </div>

            <div className="space-y-1">
              <InputLabel label="Select Class" required />
              {isLoading ? (
                <div className="h-10 w-full bg-slate-50 animate-pulse rounded-md border border-slate-200 flex items-center px-3 gap-2 text-slate-400 text-xs">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>
                    Loading classes<ThreeLoadingDot className="text-xs" />
                  </span>
                </div>
              ) : (
                <EduSelect
                  className={inputStyle}
                  options={classesOption}
                  valueKey="value"
                  labelKey="key"
                  value={selectedClassId}
                  onChange={(v) => {
                    setSelectedClassId(v as string);
                    setAcademicData({ sectionId: "", streamId: undefined });
                  }}
                />
              )}
            </div>

            {loadingClass ? (
              <div className="space-y-1">
                <div className="h-3 w-20 bg-slate-100 animate-pulse rounded" />
                <div className="h-10 w-full bg-slate-100 animate-pulse rounded-md border border-slate-200 flex items-center px-3 gap-2 text-slate-400 text-xs">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>
                    Fetching class details<ThreeLoadingDot className="text-xs" />
                  </span>
                </div>
              </div>
            ) : (
              <>
                {sectionsOption.length > 0 && (
                  <div className="space-y-1 animate-in fade-in duration-200">
                    <InputLabel label="Select Section" required />
                    <EduSelect
                      className={inputStyle}
                      options={sectionsOption}
                      valueKey="value"
                      disabled={sectionsOption.length === 1}
                      labelKey="key"
                      value={
                        sectionsOption.length === 1
                          ? sectionsOption[0].value
                          : formData.academic.sectionId
                      }
                      onChange={(v) => setAcademicData({ sectionId: v as string })}
                    />
                  </div>
                )}

                {streamsOption.length > 0 && (
                  <div className="space-y-1 animate-in fade-in duration-200">
                    <InputLabel label="Stream (Optional)" />
                    <EduSelect
                      className={inputStyle}
                      options={streamsOption}
                      disabled={streamsOption.length === 1}
                      valueKey="value"
                      labelKey="key"
                      value={
                        streamsOption.length === 1
                          ? streamsOption[0].value
                          : formData.academic.streamId
                      }
                      onChange={(v) =>
                        setAcademicData({ streamId: (v as string) || "" })
                      }
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* STEP 1: PERSONAL PROFILE */}
        {activeTab === "profile" && (
          <div className="flex flex-col gap-3.5">
            <div className="space-y-1">
              <InputLabel label="First Name" required />
              <EduInput
                className={inputStyle}
                type="name"
                required
                placeholder="e.g. James"
                value={formData.profile.firstName}
                onChange={(v) => setProfileData({ firstName: v })}
              />
            </div>

            <div className="space-y-1">
              <InputLabel label="Middle Name" />
              <EduInput
                className={inputStyle}
                type="name"
                placeholder="e.g. John"
                value={formData.profile.middleName}
                onChange={(v) => setProfileData({ middleName: v })}
              />
            </div>

            <div className="space-y-1">
              <InputLabel label="Last Name" required />
              <EduInput
                className={inputStyle}
                type="name"
                required
                placeholder="e.g. Doe"
                value={formData.profile.lastName}
                onChange={(v) => setProfileData({ lastName: v })}
              />
            </div>

            <div className="space-y-1">
              <InputLabel label="Gender" required />
              <EduSelect
                className={inputStyle}
                options={genders}
                valueKey="value"
                placeholder="Select gender"
                labelKey="key"
                value={formData.profile.gender}
                onChange={(g) =>
                  setProfileData({ gender: g as "MALE" | "FEMALE" })
                }
              />
            </div>

            <div className="space-y-1">
              <InputLabel label="Date of Birth" required />
              <EduDateInput
                className={inputStyle}
                placeholder="Birth date"
                value={formData.profile.dateOfBirth}
                onChange={(date) => setProfileData({ dateOfBirth: date })}
              />
            </div>
          </div>
        )}

        {/* STEP 2: ACADEMIC DETAILS */}
        {activeTab === "academic" && (
          <div className="flex flex-col gap-3.5">
            <div className="space-y-1">
              <InputLabel label="Admission No" required />
              <EduInput
                className={inputStyle}
                type="id"
                required
                placeholder="ADM/2026/001"
                value={formData.academic.admissionNo}
                onChange={(v) => setAcademicData({ admissionNo: v })}
              />
            </div>

            <div className="space-y-1">
              <InputLabel label="Entry Year" required />
              <EduDateInput
                className={inputStyle}
                mode="year"
                required
                placeholder="2026"
                value={
                  formData.academic.entryYear
                    ? String(formData.academic.entryYear)
                    : ""
                }
                onChange={(v) => setAcademicData({ entryYear: v })}
              />
            </div>

            <div className="space-y-1">
              <InputLabel label="PREMS No" />
              <EduInput
                className={inputStyle}
                type="text"
                placeholder="P1234567890"
                value={formData.academic.premsNumber}
                onChange={(v) => setAcademicData({ premsNumber: v })}
              />
            </div>

            <div className="space-y-1">
              <InputLabel label="BEMIS No" />
              <EduInput
                className={inputStyle}
                type="text"
                placeholder="B9876543210"
                value={formData.academic.bemisNumber}
                onChange={(v) => setAcademicData({ bemisNumber: v })}
              />
            </div>

            <div className="space-y-1">
              <InputLabel label="NECTA Index No" />
              <EduInput
                className={inputStyle}
                type="text"
                placeholder="S0123-0001-2026"
                value={formData.academic.indexNo}
                onChange={(v) => setAcademicData({ indexNo: v })}
              />
            </div>
          </div>
        )}

        {/* STEP 3: GUARDIAN INFORMATION */}
        {activeTab === "guardian" && (
          <div className="flex flex-col gap-3.5">
            <div className="space-y-1">
              <InputLabel label="Guardian Full Name" required />
              <EduInput
                className={inputStyle}
                type="fullname"
                required
                placeholder="e.g. Mr John Doe"
                value={formData.guardian.fullName}
                onChange={(v) => setGuardianData({ fullName: v })}
              />
            </div>

            <div className="space-y-1">
              <InputLabel label="Relationship" required />
              <EduSelect
                className={inputStyle}
                options={relationships}
                valueKey="value"
                labelKey="key"
                value={formData.guardian.relationship}
                onChange={(r) => setGuardianData({ relationship: r as string })}
              />
            </div>

            <div className="space-y-1">
              <InputLabel label="Phone Number" required />
              <EduInput
                className={inputStyle}
                type="phone"
                required
                placeholder="+255712345678"
                value={formData.guardian.phone}
                onChange={(v) => setGuardianData({ phone: v })}
              />
            </div>

            <div className="space-y-1">
              <InputLabel label="Email Address" />
              <EduInput
                className={inputStyle}
                type="email"
                placeholder="johndoe@gmail.com"
                value={formData.guardian.email}
                onChange={(v) => setGuardianData({ email: v })}
              />
            </div>

            <div className="space-y-1">
              <InputLabel label="Home Address" />
              <EduInput
                className={inputStyle}
                type="text"
                placeholder="e.g. Temeke, Dar es Salaam"
                value={formData.guardian.homeAddress}
                onChange={(v) => setGuardianData({ homeAddress: v })}
              />
            </div>
          </div>
        )}

        {/* STEP: REVIEW & CONFIRM */}
        {activeTab === "preview" && (
          <div className="flex flex-col gap-3 text-xs animate-in fade-in duration-200">
            {isSubmitting ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-500">
                <EduMainLoader />
                <div className="text-center space-y-1">
                  <span className="font-semibold text-slate-800">
                    Enrolling Student<ThreeLoadingDot />
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Please wait while we save the records.
                  </p>
                </div>
              </div>
            ) : isSubmitted ? (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 animate-in zoom-in-95 duration-200">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 ring-4 ring-emerald-50">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <div className="space-y-3 w-full max-w-xs mx-auto text-center">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base tracking-tight">
                      Enrollment Completed!
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Student record has been successfully created.
                    </p>
                  </div>

                  {/* Detail Summary Card */}
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-800">
                      {formData.profile.firstName} {formData.profile.middleName}{" "}
                      {formData.profile.lastName}
                    </span>

                    <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200/60 text-blue-700 px-2.5 py-1 rounded-md">
                      <span className="text-xs font-medium  text-blue-600/80">Student ID:</span>
                      <span className="font-mono text-xs font-bold">{studentRes.systemId}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleResetAndNew}
                    className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    <UserPlus className="h-3.5 w-3.5" /> Enroll Another
                  </button>
                  {onClose && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-blue-700 transition-all cursor-pointer shadow-sm shadow-blue-500/20"
                    >
                      Done
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                {submitError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-lg text-rose-700 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSubmitError(null)}
                      className="text-rose-400 hover:text-rose-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                <div className="p-2 bg-blue-50/60 border border-blue-100 rounded-lg text-blue-900 text-[11px] flex items-center justify-between">
                  <span>
                    Review the details below carefully before confirming enrollment.
                  </span>
                </div>

                {/* 1. PERSONAL PROFILE PREVIEW */}
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-1">
                    <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                      Personal Profile
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("profile")}
                      className="text-blue-600 font-semibold hover:underline text-[11px]"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <div className="col-span-2">
                      <span className="text-slate-400 block text-[10px]">
                        Full Name:
                      </span>
                      <strong className="text-slate-800">
                        {formData.profile.firstName}{" "}
                        {formData.profile.middleName}{" "}
                        {formData.profile.lastName}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">
                        Gender:
                      </span>
                      <strong className="text-slate-800">
                        {formData.profile.gender || "-"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">
                        Date of Birth:
                      </span>
                      <strong className="text-slate-800">
                        {formData.profile.dateOfBirth || "-"}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* 2. CLASS PLACEMENT PREVIEW */}
                {!hasClassContext && (
                  <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg space-y-1.5">
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-1">
                      <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                        Class Placement
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveTab("placement")}
                        className="text-blue-600 font-semibold hover:underline text-[11px]"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-slate-600">
                      <div>
                        <span className="text-slate-400 block text-[10px]">
                          Class:
                        </span>
                        <strong className="text-slate-800">
                          {classesOption.find((c) => c.value === selectedClassId)
                            ?.key || "-"}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">
                          Section:
                        </span>
                        <strong className="text-slate-800">
                          {sectionsOption.find(
                            (s) => s.value === formData.academic.sectionId
                          )?.key || "-"}
                        </strong>
                      </div>
                      {streamsOption.length > 0 && (
                        <div>
                          <span className="text-slate-400 block text-[10px]">
                            Stream:
                          </span>
                          <strong className="text-slate-800">
                            {streamsOption.find(
                              (s) => s.value === formData.academic.streamId
                            )?.key || "-"}
                          </strong>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. ACADEMIC RECORDS PREVIEW */}
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-1">
                    <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                      Academic Records
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("academic")}
                      className="text-blue-600 font-semibold hover:underline text-[11px]"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[10px]">
                        Admission No:
                      </span>
                      <strong className="text-slate-800 font-mono">
                        {formData.academic.admissionNo || "-"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">
                        Entry Year:
                      </span>
                      <strong className="text-slate-800">
                        {formData.academic.entryYear || "-"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">
                        PREMS No:
                      </span>
                      <strong className="text-slate-800 font-mono">
                        {formData.academic.premsNumber || "-"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">
                        BEMIS No:
                      </span>
                      <strong className="text-slate-800 font-mono">
                        {formData.academic.bemisNumber || "-"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">
                        Index No:
                      </span>
                      <strong className="text-slate-800 font-mono">
                        {formData.academic.indexNo || "-"}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* 4. GUARDIAN DETAILS PREVIEW */}
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg space-y-1.5">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-1">
                    <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                      Guardian Details
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("guardian")}
                      className="text-blue-600 font-semibold hover:underline text-[11px]"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Name:</span>
                      <strong className="text-slate-800">
                        {formData.guardian.fullName || "-"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Phone:</span>
                      <strong className="text-slate-800">
                        {formData.guardian.phone || "-"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">
                        Relationship:
                      </span>
                      <strong className="text-slate-800">
                        {formData.guardian.relationship || "-"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Email:</span>
                      <strong className="text-slate-800">
                        {formData.guardian.email || "-"}
                      </strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 block text-[10px]">
                        Address:
                      </span>
                      <strong className="text-slate-800">
                        {formData.guardian.homeAddress || "-"}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* 5. DECLARATION CHECKBOX */}
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2 pt-3">
                  <input
                    type="checkbox"
                    id="declaration"
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label
                    htmlFor="declaration"
                    className="text-[11px] text-slate-600 leading-snug cursor-pointer select-none"
                  >
                    I confirm that the details provided above are accurate and verified for student enrollment.
                  </label>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* 3. FOOTER NAVIGATION */}
      {!isSubmitted && (
        <div className="mt-2 pt-2.5 border-t border-slate-100 flex items-center justify-between shrink-0">
          {activeIndex > 0 ? (
            <button
              type="button"
              onClick={() => setActiveTab(steps[activeIndex - 1].id)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer px-2.5 py-1.5 rounded-md hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {activeIndex < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 active:scale-95 transition-all cursor-pointer shadow-sm shadow-blue-500/20 ml-auto"
            >
              Next Step <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!isAgreed || isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 active:scale-95 transition-all cursor-pointer shadow-sm shadow-blue-500/20 ml-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" /> Submit Enrollment
                </>
              )}
            </button>
          )}
        </div>
      )}
    </form>
  );
}