/**
 * @fileoverview School Classes Engine
 * @description Inasimamia utambulisho, usajili, uhariri na orodha ya madarasa katika shule.
 * @author Injinia Rollboy (EduAsas Tech)
 * @version 1.2.0
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ClassProfile, SchoolClass } from "@/types/school";
import { apiFetch, apiMutation } from "@/lib/api";

const CLASSES_KEY = ["school-classes"];

/**
 * ### useSchoolClasses
 * Hook ya kusimamia orodha ya madarasa yote ya shule (Fetch List & Create).
 */
export function useSchoolClasses() {
  const queryClient = useQueryClient();

  // 1. Fetching Classes List (GET)
  const { data, isLoading, error } = useQuery<SchoolClass[]>({
    queryKey: CLASSES_KEY,
    queryFn: () => apiFetch<SchoolClass[]>("/school/academic/classes"),
    staleTime: 1000 * 60 * 5, // Cache ya dakika 5
  });

  // 2. Mutation Engine (CREATE CLASS)
  const createMutation = useMutation({
    mutationFn: (payload: { classCode: string }) =>
      apiMutation("post", "/school/academic/classes", payload),

    onSuccess: () => queryClient.invalidateQueries({ queryKey: CLASSES_KEY }),
  });

  const createClass = async (classCode: string) => {
    return await createMutation.mutateAsync({ classCode });
  };

  return {
    classes: data || [],
    isLoading,
    isError: error,
    createClass,
    isCreating: createMutation.isPending,
    refresh: () => queryClient.invalidateQueries({ queryKey: CLASSES_KEY }),
  };
}

/**
 * ### useClassProfile
 * Hook ya kuvuta Class Profile mahususi na kufanya edits/updates.
 * @param classId - ID au Identifier ya Class iliyotokana na classCode
 */
export function useClassProfile(classId?: string) {
  const queryClient = useQueryClient();
  const PROFILE_KEY = ["school-class-profile", classId];

  // 1. Fetching Single Class Profile (GET)
  const { data, isLoading, error } = useQuery<ClassProfile>({
    queryKey: PROFILE_KEY,
    queryFn: () => apiFetch<ClassProfile>(`/school/academic/classes/${classId}`),
    enabled: !!classId, // Inapiga API iwapo tu classId ipo
    staleTime: 1000 * 60 * 2,
  });

  // 2. Mutation Engine (UPDATE / EDIT CLASS)
  const updateMutation = useMutation({
    mutationFn: (payload: any) =>
      apiMutation("patch", `/school/academic/classes/${classId}`, payload),

    onSuccess: () => {
      // Refresh zote mbili: profile ya sasa na orodha kuu ya madarasa
      queryClient.invalidateQueries({ queryKey: PROFILE_KEY });
      queryClient.invalidateQueries({ queryKey: CLASSES_KEY });
    },
  });

  const updateClass = async (payload: any) => {
    return await updateMutation.mutateAsync(payload);
  };

  return {
    classProfile: data,
    isLoading,
    isError: error,
    updateClass,
    isUpdating: updateMutation.isPending,
    refreshProfile: () =>
      queryClient.invalidateQueries({ queryKey: PROFILE_KEY }),
  };
}