import { cache } from "react";
import { api, ApiResponse } from "../api";

export interface SchoolProfile {
  schoolUId: string;
  schoolId: string;
  name: string;
  slug: string;
  logo?: string | null;
  motto?: string | null;
  status: string;
}

/**
 * Fetches the public school profile by its slug.
 *
 * This function is cached per request so it can safely be called from both
 * `generateMetadata()` and the server layout without issuing duplicate requests.
 *
 * @param slug - School slug extracted from the subdomain.
 * @returns Public school profile.
 */
export const getSchoolProfile = cache(
  async (slug: string): Promise<SchoolProfile | null> => {
    if (!slug) return null;
    const response = await api.get<ApiResponse, SchoolProfile>(`/main/public/school-profile?slug=${encodeURIComponent(slug)}`);
    return response ?? null;
  }
);