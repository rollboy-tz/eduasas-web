/**
 * @fileoverview School Data Engine
 * @description Inasimamia data za shule (Staff, School profile, User context).
 * Inatumia React Query kwa ajili ya automatic caching na invalidation.
 */

"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTenant } from "./tenant-provider";
import { apiFetch } from "@/lib/api/api-fetch"; // Tunatumia ile utility tuliyoitengeneza
import { SchoolContextResponse } from "@/types/school";
import { useSwitchTenant } from "@/lib/helpers/tenant-switch";

interface SchoolDataContextType {
  data: SchoolContextResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

const SchoolDataContext = createContext<SchoolDataContextType | undefined>(undefined);

/**
 * ### SchoolDataProvider
 * @param children - React components
 * @description Provider hii inazuia "Stale Data" kwa kutumia `tenantId` kama query key.
 */
export function SchoolDataProvider({ children }: { children: React.ReactNode }) {
  const { schoolUId: tenantId, isInitialized, setTenant } = useTenant();

  const { data, isLoading, isError, error, refetch } = useQuery<SchoolContextResponse, Error>({
    queryKey: ['school-context', tenantId],
    queryFn: async () => {

      const result = await apiFetch<SchoolContextResponse>("/school/context");

      if (tenantId && result.school.schoolUId !== tenantId) {

        console.warn("Integrity Mismatch: Purging stale/incorrect context...");
        window.dispatchEvent(new CustomEvent("app:sync-context", {
          detail: { schoolUId: tenantId }
        }));

        // Tunaiamini server kushinda chochote tunabadilisha tenant na kuweka tenant halali
        setTenant(result.school.schoolUId);
      }
      
      return result;
    },
    enabled: isInitialized && !!tenantId,
    staleTime: 1000 * 60 * 5, 
    retry: 1, 
  });

  // Memoization: Hii inazuia sub-components ku-render upya kila wakati
  const contextValue = useMemo(() => ({
    data,
    isLoading,
    isError,
    error,
    refetch
  }), [data, isLoading, isError, error, refetch]);

  return (
    <SchoolDataContext.Provider value={contextValue}>
      {children}
    </SchoolDataContext.Provider>
  );
}

/**
 * ### useSchoolData
 * Hook kuu ya kupata data za shule.
 * @throws {Error} Kama Provider haijawekwa kwenye tree.
 */
export const useSchoolData = (): SchoolDataContextType => {
  const context = useContext(SchoolDataContext);
  if (!context) {
    throw new Error("useSchoolData lazima itumike ndani ya SchoolDataProvider");
  }
  return context;
};