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

interface SwitchSteps {
  switching: 0 | 1 | 2;
  verifying: 0 | 1 | 2;
  finalizing: 0 | 1 | 2;
}

interface ErrorDetail {
  title: string;
  msg: string;
}

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

  const getHostDomain = () => {
    // Usalama wa DOM/Window Object wakati wa SSR
    if (typeof window === "undefined") return "eduasas.co.tz";

    const parts = window.location.host.split(".");

    // Kama ipo kwenye localhost au IP
    if (parts.length <= 1 || window.location.host.includes("localhost")) {
      return window.location.host;
    }

    // Kwa domain kama eduasas.co.tz (vipande 3 vya mwisho: eduasas + co + tz)
    return parts.slice(-3).join(".");
  };

  const hostDomain = getHostDomain();
  const PROTOCOL = process.env.NEXT_PUBLIC_NET_PROTOCOL || "https";
  const DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || hostDomain || "eduasas.co.tz";

  useEffect(() => {
    const runHandshake = async () => {
      if (isProcessing.current || !isInitialized || isUserLoading || !currentSchool) return;

      isProcessing.current = true;
      const { schoolId, schoolUId, slug } = currentSchool;

      try {
        // 1. SWITCH SESSION & GET TOKEN
        setSteps({ switching: 1, verifying: 0, finalizing: 0 });

        // Tumia function iliyoboreshwa ya switchTenant inayorudisha response yenye token
        const res = await switchTenant(schoolUId, schoolId);

        if (!res || !res.redirectToken || res.schoolUId !== schoolUId) {
          throw new Error("Failed to switch a workspace.");
        }

        const generatedToken = res.redirectToken;

        // 2. VERIFY & SYNC PROVIDERS
        setSteps({ switching: 2, verifying: 1, finalizing: 0 });

        await refetchSchoolData();

        // 3. FINALIZING WORKSPACE
        setSteps({ switching: 2, verifying: 2, finalizing: 1 });

        // Ucheleweshaji mdogo kwa ajili ya usafi wa UX
        await new Promise((r) => setTimeout(r, 1000));

        setSteps({ switching: 2, verifying: 2, finalizing: 2 });
        await new Promise((r) => setTimeout(r, 300));

        toast.show({ message: "Workspace switched successfully. Redirecting...", type: "success" });

        // 4. REDIRECT WITH TOKEN & REDIRECT_TO PARAMETERS
        // Inampeleka mtumiaji kwenye consumer page ya subdomain mfano: https://school-a.eduasas.co.tz/consumer?token=XYZ&redirect_to=/dashboard
        const destinationUrl = `${PROTOCOL}://${slug}.${DOMAIN}/consumer?token=${generatedToken}&redirect_to=${encodeURIComponent(pushTo)}`;

        window.location.href = destinationUrl;

      } catch (err: any) {
        console.error(err)
        isProcessing.current = false;
        setErrorDetail({
          title: "Synchronization Failed",
          msg: err.message || "Failed to switch workspace context. Please try again.",
        });
        toast.show({ message: "Failed to switch contaxt. Retrying...", type: "error" });
      }
    };

    if (currentSchool) void runHandshake();
  }, [
    isInitialized,
    currentSchool,
    isUserLoading,
    setTenant,
    refetchSchoolData,
    queryClient,
    router,
    syncAttempt,
    switchTenant,
    PROTOCOL,
    DOMAIN,
    pushTo,
    toast,
  ]);

  // Muonekano wa awali wakati tunasubiri wasifu wa mtumiaji
  if (isUserLoading || !currentSchool) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <EduMainLoader size={30} loadingText="Looking for school details" />
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

function StatusRow({ label, state }: { label: string; state: 0 | 1 | 2 }) {
  const isActive = state === 1;

  return (
    <div className="flex items-center justify-start gap-3 transition-all duration-300 h-6">
      <div className="w-5 h-5 flex items-center justify-center shrink-0">
        {state === 0 && <div className="w-1.5 h-1.5 rounded-full bg-muted" />}
        {state === 1 && <EduMainLoader size={12} />}
        {state === 2 && <Check className="w-4 h-4 text-emerald-800 stroke-[3]" />}
      </div>
      <span
        className={`text-xs transition-all duration-300 ${isActive ? "text-muted-900 font-bold" : "text-muted-500 font-semibold"
          }`}
      >
        {label}
      </span>
    </div>
  );
}