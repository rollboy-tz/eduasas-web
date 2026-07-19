/**
 * @fileoverview School Classes Engine
 * @description Inasimamia utambulisho, usajili, na orodha ya madarasa katika shule.
 * @author Injinia Rollboy (EduAsas Tech)
 * @version 1.0.0
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/api-fetch";
import { api }  from "@/lib/api";
import { SchoolClassesResponse } from "@/types/school";

/**
 * ### useSchoolClasses
 * Hook ya kusimamia madarasa ya shule (Fetch & Create).
 */
export function useSchoolClasses() {
  const queryClient = useQueryClient();
  const CLASSES_KEY = ['school-classes'];

  // 1. Fetching (GET)
  const { data, isLoading, error } = useQuery<SchoolClassesResponse>({
    queryKey: CLASSES_KEY,
    queryFn: () => apiFetch<SchoolClassesResponse>("/school/academic/classes"),
    staleTime: 1000 * 60 * 5, // Cache ya dakika 5 ili data iwe mpya
  });

  // 2. Mutation Engine (CREATE)
  const mutation = useMutation({
    mutationFn: (payload: { classCode: string }) => 
      api.post("/school/academic/classes", payload),
    
    // Invalidate ili ku-force refetch ya list baada ya kuongeza darasa jipya
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CLASSES_KEY }),
  });

  /**
   * @function createClass
   * @description Inasajili darasa jipya shuleni kwa kutumia classCode.
   */
  const createClass = async (classCode: string) => {
    return await mutation.mutateAsync({ classCode });
  };

  return {
    classes: data?.data || [],
    isLoading,
    isError: error,
    createClass,
    isCreating: mutation.isPending,
    refresh: () => queryClient.invalidateQueries({ queryKey: CLASSES_KEY }),
  };
}