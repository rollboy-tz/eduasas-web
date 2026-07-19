import { apiFetch } from "@/lib/api/api-fetch";
import { SchoolContextResponse } from "@/types/school";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTenant } from "./tenant-provider";

export const useTenantInitializer = (isAuthenticated: boolean, sessionKey: string | null) => {
  const { setTenant } = useTenant();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['school-context', sessionKey],
    queryFn: () => apiFetch<SchoolContextResponse>("/school/context"),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!isAuthenticated && !!sessionKey,
  });

  useEffect(() => {
    if (data) {
      setTenant(data.school.schoolUId);
    }
  }, [data, setTenant]);

  return { data, isLoading, refetch };
};