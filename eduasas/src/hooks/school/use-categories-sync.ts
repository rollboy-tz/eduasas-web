/**
 * @fileoverview School Categories Sync Engine
 * @description Inavuta na kusawazisha (sync) orodha ya aina za shule (School Categories) 
 * na kuingiza kwenye Global Store (Zustand).
 * @author Injinia Rollboy (EduAsas Tech)
 * @version 2.0.0
 */

"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/api-fetch";
import { SchoolCategory } from "@/types/school";
import { useSchoolCategoriesStore } from "@/store/school";

/**
 * ### useCategories
 * @property {boolean} isLoading - Hali ya upakiaji wa data.
 * @property {any} error - Hitilafu zilizotokea wakati wa sync.
 */

/**
 * ### useCategories
 * Hook ya kitalamu kwa ajili ya kuvuta na ku-sync school categories na global store.
 * @returns {CategoriesSyncHookReturn}
 */
export const useCategories = () => {
  const setCategories = useSchoolCategoriesStore((state) => state.setCategories);

  // 1. Fetching (GET) - Data hizi ni za public, hivyo tunaziweka kwenye cache ya muda mrefu
  const { data, error, isLoading } = useQuery<SchoolCategory[]>({
    queryKey: ['public-school-categories'],
    queryFn: () => apiFetch<SchoolCategory[]>("/public/school-categories"),
    
    // Performance Settings (Caching for Global Data)
    staleTime: 1000 * 60 * 60, // 1 Hour - Data za aina za shule hazibadiliki mara kwa mara
    gcTime: 1000 * 60 * 60 * 2, // 2 Hours
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  // 2. Sync Engine - Inatuma data kwenye Zustand Store mara tu inapopatikana
  useEffect(() => {
    if (data) {
      setCategories(data);
    }
  }, [data, setCategories]);

  const categories = data ||  [];
  return { 
    categories,
    isLoading, 
    error 
  };
};