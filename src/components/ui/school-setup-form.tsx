// "use client";

// import { useState, useMemo, useEffect } from "react";
// import { useSchoolSetupStore } from "@/store/school";
// import { useCompatibleGrading } from "@/hooks/school";
// import { CompatibleGradingRule, GradingRange } from "@/types/school";
// import { EduButton } from "@/components/buttons";
// import { cn } from "@/lib/utils/helper";
// import { api, ApiResponse } from "@/lib/api";;
// import { DateUtils } from "@/lib/utils";
// import { EduLinearLoader, EduFloatingGuide, EduMainLoader, EduScreenLoader } from "@/components/elements";
// import { EduRadialGroup, EduDateField, EduSelect, EduMinimalRadio, EduBasicInput } from "@/components/inputs";
// import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast } from "sonner";
// import { useSearchParams, useRouter } from "next/navigation";
// import { useUser } from "@/hooks/users";

// export function SchoolSetupForm() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const schoolId = searchParams.get("schoolId");

//   const { schools, isLoading: isLoadingSchools } = useUser();

//   if (isLoadingSchools) {
//     return <EduScreenLoader />;
//   }

//   if (!schools || schools.length === 0) {
//     router.replace("/u/schools");
//     return null;
//   }

//   const currentSchool = schools.find((s) => s.schoolId === schoolId);
//   const { globalRules, isLoading: isLoadingRules } = useCompatibleGrading(currentSchool);

//   const {
//     currentStep, nextStep, prevStep,
//     primaryGrading, setGrading,
//     year, updateYear, resetSetup,
//     initializeTerms, updateTerm
//   } = useSchoolSetupStore();

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [hasTimedOut, setHasTimedOut] = useState(false);
//   const [modalView, setModalView] = useState<"NONE" | "SUCCESS" | "ERROR" | "ACTIVE_GUARD">("NONE");

//   // Timeout protection
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (isLoadingSchools || isLoadingRules) {
//         setHasTimedOut(true);
//       }
//     }, 10000);
//     return () => clearTimeout(timer);
//   }, [isLoadingSchools, isLoadingRules]);

//   // Guard status check
//   useEffect(() => {
//     if (!isLoadingSchools && schoolId && !currentSchool) {
//       toast.error("School not found.");
//     }
//     if (currentSchool && currentSchool.status !== "PENDING") {
//       setModalView("ACTIVE_GUARD");
//     }
//   }, [currentSchool, isLoadingSchools, schoolId]);

//   // AUTOMATIC DEFAULT SELECTION FOR SINGLE GRADING RULE
//   useEffect(() => {
//     if (globalRules && globalRules.length === 1 && !primaryGrading) {
//       setGrading!(globalRules[0].code);
//     }
//   }, [globalRules, primaryGrading, setGrading]);

//   const isLoading = (isLoadingSchools || isLoadingRules || isSubmitting) && !hasTimedOut;
//   const selectedRule = globalRules?.find((r: CompatibleGradingRule) => r.code === primaryGrading);
//   const hasPoints = selectedRule?.ranges.some((r: GradingRange) => r.points !== null && r.points !== undefined);

//   const terms = useSchoolSetupStore((state) => state.terms);
//   const totalSteps = useMemo(() => 2 + (terms?.length || 0), [terms?.length]);

//   useEffect(() => {
//     if (terms.length > 0) {
//       if (terms[0].startDate !== year.startDate) {
//         updateTerm(0, { startDate: year.startDate });
//       }
//       const lastIndex = terms.length - 1;
//       if (terms[lastIndex].endDate !== year.endDate) {
//         updateTerm(lastIndex, { endDate: year.endDate });
//       }
//     }
//   }, [year.startDate, year.endDate, terms.length]);

//   const validateWizard = () => {
//     for (const [index, term] of terms.entries()) {
//       if (!term.name.trim() || !term.startDate || !term.endDate) {
//         toast.error(`Incomplete info for ${term.name || 'Term ' + (index + 1)}`);
//         return false;
//       }
//     }

//     const firstTermStart = terms[0].startDate;
//     const lastTermEnd = terms[terms.length - 1].endDate;

//     if (firstTermStart !== year.startDate) {
//       toast.error(`First term must open on ${DateUtils.formatCustom(year.startDate, { withDay: false })}`);
//       return false;
//     }

//     if (lastTermEnd !== year.endDate) {
//       toast.error(`Final term must close on ${DateUtils.formatCustom(year.endDate, { withDay: false })}`);
//       return false;
//     }

//     for (let i = 1; i < terms.length; i++) {
//       const prevEnd = terms[i - 1].endDate;
//       const currentStart = terms[i].startDate;
//       if (currentStart <= prevEnd) {
//         toast.error(`${terms[i].name} cannot start before ${terms[i - 1].name} closes.`);
//         return false;
//       }
//     }
//     return true;
//   };

//   const handleNext = () => {
//     if (currentStep === 1 && !primaryGrading) {
//       return toast.error("Please select a grading system.");
//     }

//     if (currentStep === 2) {
//       if (!year.startDate || !year.endDate) {
//         return toast.error("Set both Start and End dates.");
//       }
//       if (year.startDate >= year.endDate) {
//         return toast.error("Closing date must be after the opening date.");
//       }
//       if (terms.length === 0) {
//         return toast.error("Select the number of terms.");
//       }
//     }

//     if (currentStep > 2) {
//       const termIdx = currentStep - 3;
//       const term = terms[termIdx];

//       if (!term.name.trim()) return toast.error("Term name is required.");
//       if (!term.startDate || !term.endDate) return toast.error(`Set dates for ${term.name}.`);

//       if (term.startDate < year.startDate) {
//         return toast.error(`${term.name} cannot open before academic year starts.`);
//       }
//       if (term.endDate > year.endDate) {
//         return toast.error(`${term.name} cannot close after academic year ends.`);
//       }

//       if (termIdx === 0 && term.startDate !== year.startDate) {
//         return toast.error(`First term must start exactly when the year begins.`);
//       }

//       if (termIdx > 0) {
//         const prevTerm = terms[termIdx - 1];
//         if (term.startDate <= prevTerm.endDate) {
//           return toast.error(`${term.name} must start after ${prevTerm.name} closes.`);
//         }
//       }
//     }

//     if (currentStep < totalSteps) nextStep();
//   };

//   const handleSubmit = async () => {
//     if (!validateWizard()) return;

//     const hasActive = terms.some(t => t.isCurrent);
//     if (!hasActive) return toast.error("Select the currently active term.");

//     setIsSubmitting(true);

//     const payload = {
//       year: {
//         value: Number(year.value),
//         startDate: year.startDate,
//         endDate: year.endDate
//       },
//       terms: terms.map(t => ({
//         name: t.name,
//         startDate: t.startDate,
//         endDate: t.endDate,
//         order: t.order,
//         isCurrent: t.isCurrent
//       })),
//       ...((primaryGrading && globalRules.length > 1) && { primaryGrading })
//     };

//     try {
//       if (!currentSchool) return;
//       const setupEndpointURL = `/school/setup?schoolUId=${currentSchool?.schoolUId}`;
//       const res = await api.post<any, ApiResponse>(setupEndpointURL, payload);

//       if (res.status === 'success') {
//         toast.success("School setup finalized successfully.");
//         router.replace(`/s?schoolId=${currentSchool.schoolId}`);
//       }
//     } catch (err) {
//       toast.error("Setup failed. Please try again.");
//     } {
//       setIsSubmitting(false);
//     }
//   };

//   const renderGradingStep = () => (
//     <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 gap-6 bg-inherit">
//       <EduRadialGroup<CompatibleGradingRule>
//         options={globalRules}
//         valueKey="code"
//         selectedValue={primaryGrading ?? ""}
//         onSelect={(item) => setGrading!(item.code)}
//         renderContent={(item) => (
//           <div className="flex items-center justify-between w-full px-2 uppercase text-[11px] tracking-widest font-black bg-inherit">
//             <span>{item.name}</span>
//             {globalRules.length === 1 && (
//               <span className="text-[9px] bg-primary/10 text-primary px-2 py-1 rounded-md">
//                 Default
//               </span>
//             )}
//           </div>
//         )}
//       />
//       {selectedRule && (
//         <EduFloatingGuide
//           title={`${selectedRule.name} Ranges`}
//           buttonText="Preview ranges"
//           buttonClassName="p-5 rounded-full max-w-50"
//           titleClassName="p-2 text-foreground"
//         >
//           <table className="w-full text-left border-separate border-spacing-0 bg-card">
//             <thead>
//               <tr className="bg-muted/40">
//                 <th className="p-4 text-[10px] font-black uppercase text-muted-foreground">Grade</th>
//                 <th className="p-4 text-[10px] font-black uppercase text-muted-foreground">Range</th>
//                 {hasPoints && <th className="p-4 text-[10px] font-black uppercase text-muted-foreground">Points</th>}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-border/40">
//               {selectedRule.ranges.map((r: GradingRange) => (
//                 <tr key={r.id} className="hover:bg-muted/10">
//                   <td className={cn("p-4 text-sm font-bold", r.isPass ? "text-green-500" : "text-red-500")}>{r.grade}</td>
//                   <td className="p-4 text-[11px] text-muted-foreground">{r.minMark} — {r.maxMark}</td>
//                   {hasPoints && <td className="p-4 text-[11px] text-muted-foreground">{r.points || "0"}</td>}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </EduFloatingGuide>
//       )}
//     </motion.div>
//   );

//   const renderYearConfigStep = () => (
//     <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 gap-6 bg-card p-1">
//       <EduDateField
//         label="Academic year"
//         mode="year"
//         initialValue={year.value.toString()}
//         onChange={(val) => updateYear({ startDate: val })}
//       />
//       <div className="flex flex-col md:flex-row gap-3 text-left bg-inherit">
//         <EduDateField
//           label="Start Date"
//           mode="full"
//           initialValue={year.startDate}
//           onChange={(val) => updateYear({ startDate: val })}
//         />
//         <EduDateField
//           label="End Date"
//           mode="full"
//           initialValue={year.endDate}
//           onChange={(val) => updateYear({ endDate: val })}
//         />
//       </div>
//       <EduSelect
//         label="Terms Count"
//         variant="neon"
//         options={[
//           { name: "One Term", counts: 1 },
//           { name: "Two Terms", counts: 2 },
//           { name: "Three Terms", counts: 3 },
//           { name: "Four Terms", counts: 4 }
//         ]}
//         labelKey="name"
//         valueKey="counts"
//         className="text-left"
//         onChange={(val) => {
//           const selected = val as { name: string; counts: number };
//           initializeTerms(selected.counts);
//         }}
//       />
//     </motion.div>
//   );

//   const renderTermStep = (index: number) => {
//     const term = terms[index];
//     if (!term) return null;

//     return (
//       <motion.div key={`term-${index}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 gap-8 text-left bg-card p-1">
//         <EduBasicInput
//           label="Term name"
//           restriction="alpha-numeric-space"
//           labelStrategy="floating"
//           value={term.name}
//           onChange={(e) => updateTerm(index, { name: e.target.value })}
//         />
//         <div className="flex flex-col md:flex-row gap-4 bg-inherit">
//           <EduDateField label="Opens" initialValue={term.startDate} onChange={(val) => updateTerm(index, { startDate: val })} />
//           <EduDateField label="Closes" initialValue={term.endDate} onChange={(val) => updateTerm(index, { endDate: val })} />
//         </div>

//         <div className="space-y-4 w-full bg-inherit">
//           <EduMinimalRadio
//             className="w-full flex-row justify-between bg-inherit"
//             indicatorPosition="left"
//             options={[
//               { label: "Active Now", value: true },
//               { label: "Scheduled", value: false }
//             ]}
//             selectedValue={term.isCurrent}
//             onSelect={(val) => updateTerm(index, { isCurrent: val })}
//           />
//         </div>
//       </motion.div>
//     );
//   };

//   const renderStep = () => {
//     if (currentStep === 1) return renderGradingStep();
//     if (currentStep === 2) return renderYearConfigStep();
//     return renderTermStep(currentStep - 3);
//   };

//   return (
//     <div className="w-full flex flex-col bg-inherit">
//       <div className="w-full h-1 relative overflow-hidden">
//         <AnimatePresence>{(isSubmitting || isLoading) && <EduLinearLoader height={3} />}</AnimatePresence>
//       </div>

//       <div className={cn("flex flex-col md:flex-row min-h-[400px] transition-all duration-300 bg-inherit", (isLoading || isSubmitting) && "opacity-0")}>
//         {/* INFO SIDE */}
//         <div className="w-full md:w-[45%] p-12 flex flex-col justify-center bg-inherit">
//           <div className="text-[10px] font-black text-primary mb-2 tracking-[0.3em] uppercase opacity-70">
//             Step {currentStep} / {totalSteps}
//           </div>

//           <h3 className="text-2xl font-bold mb-4 text-foreground tracking-tight">
//             {currentStep === 1 && "Grading Rules"}
//             {currentStep === 2 && "Academic Year"}
//             {currentStep > 2 && terms[currentStep - 3]?.name}
//           </h3>

//           <p className="text-sm text-wrap text-muted-foreground leading-relaxed mb-8">
//             {currentStep === 1 && "Automate performance tracking and criteria. Select a standard framework to begin setup."}
//             {currentStep === 2 && "Configure your corporate academic timelines and choose the operational terms count."}
//             {currentStep > 2 && `Specify the opening and closing boundaries for ${terms[currentStep - 3]?.name}.`}
//           </p>

//           {/* Progress Dots */}
//           <div className="flex gap-2">
//             {Array.from({ length: totalSteps }).map((_, i) => (
//               <div
//                 key={i}
//                 className={cn(
//                   "h-1 rounded-full transition-all duration-500",
//                   (i + 1) === currentStep ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
//                 )}
//               />
//             ))}
//           </div>
//         </div>

//         {/* FORM SIDE */}
//         <div className="flex-1 flex items-center justify-center p-8 bg-inherit">
//           <div className="w-full max-w-[420px] bg-inherit">
//             <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
//           </div>
//         </div>
//       </div>

//       {/* FOOTER */}
//       <div className="p-8 border-t border-border/60 flex items-center gap-3 md:justify-end justify-between min-h-[100px] relative overflow-hidden bg-inherit">
//         <AnimatePresence mode="wait">
//           {!isLoading ? (
//             <motion.div
//               key="buttons"
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               transition={{ duration: 0.2 }}
//               className="flex items-center gap-3 w-full md:justify-end justify-between bg-inherit"
//             >
//               <EduButton
//                 variant="ghost"
//                 onClick={prevStep}
//                 disabled={currentStep === 1 || isSubmitting}
//                 icon={ArrowLeft}
//                 className="flex-1 md:flex-none min-w-40"
//               >
//                 Back
//               </EduButton>

//               <EduButton
//                 onClick={currentStep < totalSteps ? handleNext : handleSubmit}
//                 isLoading={isSubmitting}
//                 icon={currentStep < totalSteps ? ArrowRight : CheckCircle2}
//                 loadingText="Setting up"
//                 className="flex-1 md:flex-none min-w-40"
//               >
//                 {currentStep < totalSteps ? "Continue" : "Finish up"}
//               </EduButton>
//             </motion.div>
//           ) : (
//             <motion.div
//               key="loader"
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 1.05 }}
//               className="flex items-center gap-3 w-full justify-center md:justify-end bg-inherit"
//             >
//               <EduMainLoader size={24} />
//               <motion.h3
//                 initial={{ x: 10, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ delay: 0.1 }}
//                 className="text-muted-foreground text-sm tracking-tight"
//               >
//                 Finishing setup...
//               </motion.h3>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }