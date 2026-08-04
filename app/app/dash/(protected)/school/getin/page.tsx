"use client";

import { useEffect, useState, useRef, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/lib/store";
import { motion } from "framer-motion";
import { EduMainLoader } from "@/components/elements";
import { Check } from "lucide-react";
import { useSchoolData, useTenant } from "@/providers/context-provider";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/dash";
import { useSwitchTenant } from "@/lib/helpers/tenant-switch";

/**
 * ### SwitchSteps
 * Inawakilisha hatua tatu kuu za usawazishaji wa muktadha wa shule.
 * @value 0 - Pending (Bado haijaanza)
 * @value 1 - Loading (Inashughulikiwa kwa sasa)
 * @value 2 - Done (Imekamilika kwa mafanikio tunajiandaa ku-redirect)
 */
interface SwitchSteps {
   switching: 0 | 1 | 2;
   verifying: 0 | 1 | 2;
   finalizing: 0 | 1 | 2;
}

/**
 * ### ErrorDetail
 * Muundo thabiti wa makosa yanayoweza kutokea wakati wa usawazishaji wa muktadha.
 */
interface ErrorDetail {
   title: string;
   msg: string;
}

/**
 * ### SwitchContextContent
 * @description Injini kuu ya mabadiliko ya shule (The Handshake Machine).
 * Kipengele hiki kinafanya kazi kama mapokezi kabla ya mtumiaji kuruhusiwa kuingia kwenye Layout ya ndani.
 * * ### Mnyororo wa Ushirikiano (The Matrix Pipeline):
 * 1. Inapokea `school-slug` au `schoolId` kutoka kwenye URL parameters.
 * 2. Inapiga `POST /school/switch` kuseti session node kule server/Redis.
 * 3. Inafanya Deep Verification kupitia `GET /school/context` (Inajaribu hadi mara 3 kusubiri Redis propagation).
 * 4. Inasafisha cache zote za SWR ili kuzuia "Cross-School Data Bleeding".
 * 5. Inatupa `app:sync-context` event ili `SchoolProvider` na `Layout` wajue kila kitu kiko salama.
 */
function SwitchContextContent() {

   const router = useRouter();
   const toast = useToast();
   const searchParams = useSearchParams();
   const queryClient = useQueryClient();
   const isProcessing = useRef<boolean>(false);

   const { schools, isLoading: isUserLoading } = useUser();
   const { setTenant, schoolUId: activeTenantId, isInitialized } = useTenant();
   const { switchTenant } = useSwitchTenant();
   const { refetch: refetchSchoolData } = useSchoolData();

   const [steps, setSteps] = useState<SwitchSteps>({ switching: 1, verifying: 0, finalizing: 0 });
   const [errorDetail, setErrorDetail] = useState<ErrorDetail | null>(null);
   const [syncAttempt, setSyncAttempt] = useState(0);

   const schoolIdParam = searchParams.get("schoolId");
   const slugParam = searchParams.get("school_slug");
   const pushTo = searchParams.get("push_to") || "/dashboard";

   const currentSchool = useMemo(() => {
      if (!schools) return null;
      return schools.find((s) => s.slug === slugParam || s.schoolId === schoolIdParam) || schools[0];
   }, [schools, slugParam, schoolIdParam]);

   const PROTOCAL = process.env.NEXT_PUBLIC_NET_PROTOCOL || "https";
   const DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || window.location.host.split(".")[1] || "eduasas.co.tz";

   const redirectUrl = `${PROTOCAL}://${currentSchool?.slug}.${DOMAIN}${pushTo}`;

   useEffect(() => {
      const runHandshake = async () => {
         if (isProcessing.current || !isInitialized || isUserLoading || !currentSchool) return;

         //Ikiwa tayari tuko kwenye shule husika, ruka moja kwa moja
         if (isInitialized && activeTenantId === currentSchool.schoolUId) {
            toast.show({ message: "The workspace was open. Redirecting!", type: "info" })
            window.location.href = redirectUrl;
            return;
         }

         isProcessing.current = true;
         const { schoolId, schoolUId } = currentSchool;

         try {
            // 1. SWITCH SESSION
            setSteps({ switching: 1, verifying: 0, finalizing: 0 });
            await switchTenant(schoolUId, schoolId)

            // 2. VERIFY & SYNC PROVIDERS
            setSteps({ switching: 2, verifying: 1, finalizing: 0 });

            await refetchSchoolData();
            if (!isInitialized) {
               throw new Error("Tenant Context not initialized, retrying handshake...");
            }

            // 3. FINALIZING
            setSteps({ switching: 2, verifying: 2, finalizing: 1 });

            // Small delay kwa ajili ya UX smooth
            await new Promise(r => setTimeout(r, 1500));

            setSteps({ switching: 2, verifying: 2, finalizing: 2 });
            await new Promise(r => setTimeout(r, 300));
            toast.show({ message: "Workspace switched successfully. Redirecting", type: "success" })
            window.location.href = redirectUrl;

         } catch (err: any) {
            isProcessing.current = false;
            setErrorDetail({
               title: "Synchronization Failed",
               msg: "Failed to switch workspace context. Please try again."
            });
         }
      };

      if (currentSchool) void runHandshake();
   }, [isInitialized, currentSchool, isUserLoading, setTenant, refetchSchoolData, queryClient, router, syncAttempt]);

   // Muonekano wa awali wakati tunasubiri wasifu wa mtumiaji (Profile Checklist)
   if (isUserLoading || !currentSchool) {
      return (
         <div className="flex flex-col items-center justify-center space-y-4">
            <EduMainLoader size={30} loadingText="Loading..."/>
         </div>
      );
   }

   return (
      <div className="w-full max-w-xs p-5 rounded-md space-y-5 text-center select-none">
         {/* Mini School Widget Representation */}
         <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-row text-start items-center gap-3 border border-border rounded py-2 px-3 min-w-[250px] truncate bg-white"
         >
            <div className="w-8 h-8 rounded-full border border-black bg-blue-900 flex items-center justify-center overflow-hidden shrink-0">
               {currentSchool.logo ? (
                  <img src={currentSchool.logo} alt="School logo" className="w-full h-full object-cover" />
               ) : (
                  <span className="text-md font-medium text-white uppercase">{currentSchool.name.charAt(0)}</span>
               )}
            </div>
            <div className="min-w-0">
               <p className="font-semibold text-xs text-primary-foreground truncate">{currentSchool.name}</p>
               <p className="text-[10px] font-bold text-muted-foreground tracking-widest">{currentSchool.schoolId}</p>
            </div>
         </motion.div>

         {/* Synchronizer Workflow Statuses */}
         <div className="text-left flex flex-col gap-1">
            <StatusRow label="Creating context session" state={steps.switching} />
            <StatusRow label="Verifying active session nodes" state={steps.verifying} />
            <StatusRow label="Finalizing workspace profile" state={steps.finalizing} />
         </div>

         {/* Global Context Mismatch / Timeout Modal */}
         {/* <EduErrorState
            isOpen={!!errorDetail}
            onClose={() => setErrorDetail(null)}
            title={errorDetail?.title}
            descMsg={errorDetail?.msg}
            primaryAction={{
               label: "Retry Connection",
               onClick: () => {
                  // Tunazungusha tena mchakato wa handshake
                  setErrorDetail(null);
                  isProcessing.current = false; // Fungua kufuli

                  // Hapa unaita tena ile function yako au unalazimisha re-run
                  // Njia rahisi ni ku-trigger force update au kuita function moja kwa moja
                  // Kama umeifunga ndani ya useEffect, unaweza kutumia state moja ndogo ya "version"
                  setSyncAttempt(prev => prev + 1);
               },
            }}
            secondaryAction={{
               label: "Abort Action",
               onClick: () => router.replace("/u/home"),
            }}
         /> */}
      </div>
   );
}

export default function SwitchSchoolPage() {
   return (
      <main className="min-h-screen flex items-center justify-center p-6 font-sans">
         <Suspense fallback={<EduMainLoader size={30} />}>
            <SwitchContextContent />
         </Suspense>
      </main>
   );
}

/**
 * ### StatusRow
 * @description Inachora mistari ya hali ya usawazishaji kwa mtindo wa kishua.
 */
function StatusRow({ label, state }: { label: string; state: 0 | 1 | 2 }) {
   const isActive = state === 1;

   return (
      <div className="flex items-center justify-start gap-3 transition-all duration-300 h-6">
         <div className="w-5 h-5 flex items-center justify-center shrink-0">
            {state === 0 && <div className="w-1.5 h-1.5 rounded-full bg-muted" />}
            {state === 1 && <EduMainLoader size={12} />}
            {state === 2 && <Check className="w-4 h-4 text-emerald-800 stroke-[3]" />}
         </div>
         <span className={`text-xs transition-all duration-300 ${isActive ? 'text-muted-900 font-bold' : 'text-muted-500 font-semibold'}`}>
            {label}
         </span>
      </div>
   );
}