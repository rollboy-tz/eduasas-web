//Path: src/providers/school-context-provider.tsx

"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api }  from "@/lib/api";
import { 
  SchoolContextResponse, 
  RestrictionLevel,
  SchoolContext as ISchoolContext,
  StaffContext,
  UserContext
} from "@/types/school";
import { EduErrorState } from "@/components/elements";

/* =========================================================
   TYPES & INTERFACES
   ========================================================= */

export type ContextStatus = "idle" | "loading" | "ready" | "no-context" | "error";

export interface ContextErrorInfo {
  title: string;
  message: string;
  type: "fail" | "network" | "server" | "denied";
}

/**
 * ### SchoolContextType
 * Mkataba wa data na mbinu zote zinazotolewa na SchoolProvider kwa mfumo mzima.
 */
export interface SchoolContextType {
  school: ISchoolContext | null;
  staff: StaffContext | null;
  user: UserContext | null;
  status: ContextStatus;
  isLoading: boolean;
  isReady: boolean;
  hasContext: boolean;
  refreshContext: () => Promise<void>;
  clearContext: () => void;
  
  // Security & Permission Helpers
  isLocked: boolean;
  isReadOnly: boolean;
  isActive: boolean;
  isOwner: boolean;
  isSuperAdmin: boolean;
  primaryRole: string | null;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

/* =========================================================
   PROVIDER IMPLEMENTATION
   ========================================================= */

/**
 * ### SchoolProvider
 * @description Kikombe kikuu cha usimamizi wa muktadha (Context Session).
 * Ni mlinzi mkuu anayewasiliana na Server, Redis, na mabadiliko ya URL.
 * 
 * ### Ushirikiano wa Matrix (The Security Alignment):
 * 1. **Bypass Core URLs:** Kama njia haina `/s/`, haizuii screen na loader; inafungua njia kwa kasi.
 * 2. **Cross-Tab Shield:** Inasikiliza `app:sync-context` yenye payload ili kujisawazisha yenyewe bila vurugu.
 * 3. **Error Boundary Fallback:** Ikifeli kabisa, inamwaga modal na kumtupa mtumiaji portal kuu `/u/home`.
 */
export function SchoolProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [data, setData] = useState<SchoolContextResponse | null>(null);
  const [status, setStatus] = useState<ContextStatus>("idle");
  const isFetching = useRef<boolean>(false);

  const [errorInfo, setErrorInfo] = useState<ContextErrorInfo>({
    title: "Synchronization Error",
    message: "An unexpected error occurred while loading your workspace.",
    type: "server"
  });

  /**
   * ### isSchoolRoute
   * @description Inakagua kama mtumiaji yupo kwenye maeneo ya ndani ya shule.
   * Hii inazuia loader za kijinga kuzuia kurasa za kimataifa kama `/u/home` au `/u/profile`.
   */
  const isSchoolRoute = useMemo(() => pathname?.startsWith("/s/"), [pathname]);

  /**
   * ### fetchSchoolContext
   * @async
   * @description Inavuta muktadha halisi wa session kutoka kwa server/Redis.
   */
  const fetchSchoolContext = useCallback(async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    setStatus("loading");

    try {
      const res = await api.get<undefined, { data: SchoolContextResponse }>(
        "/school/context",
        { _noToast: true } as any
      );

      setData(res.data);
      setStatus("ready");
    } catch (err: any) {
      const errorCode = err?.response?.data?.errorCode;
      
      if (errorCode === "CONTEXT_REQUIRED" || err?.response?.status === 404) {
        setData(null);
        setStatus("no-context");
        return;
      }

      setErrorInfo({
        title: `Workspace Sync Error (${err?.response?.status || 500})`,
        message: err?.response?.data?.message || "Critical failure verifying school context session.",
        type: "server",
      });
      setStatus("error");
    } finally {
      isFetching.current = false;
    }
  }, []);

  /**
   * ### clearContext
   * @description Inasafisha kumbukumbu ya muktadha kienyeji.
   */
  const clearContext = useCallback(() => {
    setData(null);
    setStatus("no-context");
  }, []);

  // Kikichocheo cha Awali (Initial Bootstrapper)
  useEffect(() => {
    void fetchSchoolContext();
  }, [fetchSchoolContext]);

  // =========================================================
  // INTER-COMPONENT HANDSHAKE (Mawasiliano na Switcher & Layout)
  // =========================================================
  useEffect(() => {
    /**
     * Inapokea signal kutoka kwa `SwitchSchoolPage` ikiwa na payload kamili.
     * Inazuia upigaji wa API usio na lazima kama tayari data inafanana.
     */
    const onSyncContext = (e: Event) => {
      const customEvent = e as CustomEvent<{ slug: string; schoolId: string }>;
      const payload = customEvent.detail;

      if (data?.school?.schoolId === payload?.schoolId) {
        // Data tayari ipo sawa kwenye hii tab, weka ready na sepa
        setStatus("ready");
        return;
      }
      
      // Kama kuna mabadiliko (Cross-Tab au New Switch), piga handshake upya na server
      void fetchSchoolContext();
    };

    const onKillContext = () => clearContext();

    window.addEventListener("app:sync-context", onSyncContext);
    window.addEventListener("app:kill-context", onKillContext);

    return () => {
      window.removeEventListener("app:sync-context", onSyncContext);
      window.removeEventListener("app:kill-context", onKillContext);
    };
  }, [fetchSchoolContext, clearContext, data]);

  // =========================================================
  // PERMISSION CALCULATOR (The Security Core)
  // =========================================================
  const helpers = useMemo(() => {
    if (!data) {
      return {
        isLocked: false, isReadOnly: false, isActive: false,
        isOwner: false, isSuperAdmin: false, primaryRole: null,
      };
    }

    const isSuperAdmin = data.user?.systemRole === "SUPER_ADMIN";
    const roles = data.staff?.assignedRoles ?? [];
    
    // Kupanga majukumu kwa vipaumbele vya ki-usalama (Lower priority number = Higher power)
    const sortedRoles = [...roles].sort((a, b) => a.priority - b.priority);
    const topRole = sortedRoles[0];
    
    const restriction = topRole?.restrictionLevel as RestrictionLevel | undefined;
    const staffStatus = data.staff?.status;

    const primaryRole = isSuperAdmin ? "SUPER_ADMIN" : topRole?.roleKey ?? null;

    return {
      isSuperAdmin,
      // SUPER_ADMIN havurugwi na vikwazo vya ndani ya shule
      isLocked: isSuperAdmin ? false : restriction === "LOCKED",
      isReadOnly: isSuperAdmin ? false : restriction === "READ-ONLY",
      isActive: isSuperAdmin ? true : staffStatus === "ACTIVE",
      isOwner: isSuperAdmin ? true : roles.some((r) => r.roleKey === "OWNER"),
      primaryRole,
    };
  }, [data]);

  // Mapokezi ya Thamani za Context
  const contextValue = useMemo<SchoolContextType>(() => ({
    school: data?.school ?? null,
    staff: data?.staff ?? null,
    user: data?.user ?? null,
    status,
    isLoading: status === "idle" || status === "loading",
    isReady: status === "ready",
    hasContext: status === "ready" && !!data?.school,
    refreshContext: fetchSchoolContext,
    clearContext,
    ...helpers,
  }), [data, status, helpers, fetchSchoolContext, clearContext]);

  // =========================================================
  // SMART RENDERING INJECTOR (Kuzuia Blank Screens & Infinite Loaders)
  // =========================================================

  // Ukuta wa Makosa (The Error Boundary State)
  if (status === "error" && isSchoolRoute) {
    return (
      <EduErrorState
        isOpen={true}
        onClose={() => setStatus("no-context")}
        title={errorInfo.title}
        descMsg={errorInfo.message}
        primaryAction={{ 
          label: "Retry Handshake", 
          onClick: () => { void fetchSchoolContext(); } 
        }}
        secondaryAction={{ 
          label: "Abort & Exit Workspace", 
          onClick: () => router.replace("/u/home") 
        }}
      />
    );
  }

  return (
    <SchoolContext.Provider value={contextValue}>
      {children}
    </SchoolContext.Provider>
  );
}

/* =========================================================
   HOOKS ARCHITECTURE (Enterprise API)
   ========================================================= */

/**
 * ### useSchoolContext
 * @description Hook mama kwa ajili ya kuvuta state kamili ya muktadha wa shule uliopo.
 * @throws Kosa la chuma kama ikitumiwa nje ya `<SchoolProvider />`.
 */
export const useSchoolContext = (): SchoolContextType => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error("Security Violation: useSchoolContext lazima itumike ndani ya SchoolProvider pekee.");
  }
  return context;
};

/**
 * ### useSchoolContextOptional
 * Hook nyepesi inayorudisha context kama ipo, na null kama haipo.
 * Hii haitupii Error, hivyo ni salama kutumia kwenye SwitchSchoolPage.
 */
export const useSchoolContextOptional = () => {
  return useContext(SchoolContext) as SchoolContextType;
};

/**
 * ### useSchoolContextInfo
 * @description Hook nyepesi kwa ajili ya kurasa za Dashboard/UI zinazohitaji tu utambulisho wa shule.
 * @example const { school, isReady } = useSchoolContextInfo();
 */
export const useSchoolContextInfo = () => {
  const { school, isReady, hasContext, status, refreshContext, clearContext } = useSchoolContext();
  return { school, isReady, hasContext,refreshContext, clearContext, contextStatus: status };
};

/**
 * ### useStaffPermissions
 * @description Hook maalum ya ki-usalama (RBAC Security). Inapaswa kuguswa kabla ya kuruhusu 
 * vitufe vya kufuta, kuhariri, au kuandika data (mfano: Madawati ya fedha au mitihani).
 * @example const { isReadOnly, isLocked } = useStaffPermissions();
 */
export const useStaffPermissions = () => {
  const { isLocked, isReadOnly, isActive, isOwner, isSuperAdmin, primaryRole } = useSchoolContext();
  return { isLocked, isReadOnly, isActive, isOwner, isSuperAdmin, primaryRole };
};