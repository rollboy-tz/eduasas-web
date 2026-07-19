/**
 * @fileoverview Master Classes Engine
 * @description Inavuta orodha ya madarasa yaliyoidhinishwa (Master Classes) 
 * na kuyachuja kulingana na mahitaji ya mfumo.
 * @author Injinia Rollboy (EduAsas Tech)
 * @version 1.0.0 (TanStack Query)
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/api-fetch";
import {  MasterClassesResponse } from "@/types/school/master-class";

/**
 * ### MasterClassesHookReturn
 * @property {MasterClass[]} classes - Orodha ya madarasa yaliyopangwa.
 * @property {boolean} isLoading - Hali ya upakiaji.
 * @property {any} isError - Hitilafu zilizotokea.
 */

/**
 * ### useMasterClasses
 * Hook ya kitalamu kwa ajili ya kuvuta orodha ya Master Classes kutoka kwenye mfumo.
 * @returns {MasterClassesHookReturn}
 */
export function useMasterClasses() {
  // 1. Fetching (GET)
  const { data, error, isLoading } = useQuery<MasterClassesResponse>({
    queryKey: ['master-classes', 'discovery'],
    queryFn: () => apiFetch<MasterClassesResponse>("/school/academic/classes/discovery"),
    
    // Performance: Madarasa hayabadiliki kila sekunde, 
    // tunaiweka cache iwe ya muda mrefu (dakika 30)
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  // 2. Logic: Hakikisha data ipo, kama haipo tunarudisha array tupu
  // Hapa unaweza kuongeza sort logic kama kuna kipaumbele cha madarasa (e.g. Form 1 -> Form 4)
  const classes = data?.data ? [...data.data] : [];

  return {
    classes,
    isLoading,
    isError: error,
  };
}