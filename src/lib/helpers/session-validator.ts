/**
 * @file session-validator.ts
 * @description Inasimamia uthibitisho wa session ya mtumiaji (User Session).
 * Imeboreshwa kutumia TanStack Query kwa ajili ya caching, single-flight protection, 
 * na kuzuia "False Unauthenticated" states pale mtandao unapokuwa unasumbua (Timeout/Network Errors).
 */

import { useQuery } from "@tanstack/react-query";
import { apiFetch,  ApiError } from "@/lib/api"; // Badilisha path kulingana na mradi wako

/* =========================================================
   1. CORE FETCHER (THE ENGINE)
   ========================================================= */

/**
 * ### validateSessionApi
 * @description Hii ndiyo injini inayopiga API server kuthibitisha session.
 * Inatumia `apiFetch` utility na ina akili ya kutofautisha kati ya "Network Error" 
 * (ambayo inapaswa kurudiwa) na "Auth Error" (ambayo inamaanisha user ametoka kweli).
 * 
 * @returns {Promise<boolean>} Inarudisha `true` kama session ipo hai.
 * @throws {Error | ApiError} Inatupa error ikiwa tatizo ni mtandao/timeout ili TanStack Query iweze kufanya `retry`.
 */
export async function validateSessionApi(): Promise<boolean> {
  try {
    // Tunatumia apiFetch yako. Ikitoboa bila kutupa error, tunajua session ipo valid.
    await apiFetch<any>("/auth/validate");
    return true;

  } catch (error: any) {
    // HAPA NDIPO TUNATATUA ILE SHIDA YA TIMEOUT
    // Tunachunguza kama error hii imesababishwa na session kuisha (401/403)
    const isAuthError =
      error?.response?.status === 401 ||
      error?.response?.status === 403 ||
      error?.errorCode === "UNAUTHORIZED" || // Kulingana na ApiError class yako
      error?.status === "error" && error?.message?.toLowerCase().includes("unauthorized");

    if (isAuthError) {
      // 1. Session imekwisha kiukweli (User token expired/invalid)
      // Tunamtonya jamaa (global listener) asafishe kila kitu
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("app:validate-session"));
      }
      return false; // Hapa ndio tunarudisha false kihalali
    }

    // 2. Kama sio Auth Error (Mfano: Timeout, 500 Server Error, No Internet)
    // USIRUDISHE FALSE! Tupa (throw) error hii juu ili TanStack Query 
    // iipokee na kufanya maamuzi ya "kujaribu tena" (Retry).
    throw error;
  }
}


/* =========================================================
   2. TANSTACK QUERY HOOK (THE MANAGER)
   ========================================================= */

/**
 * ### useSessionValidation
 * @description Hii ni custom hook ya TanStack Query inayosimamia lifecycle ya session.
 * Inachukua nafasi ya ile logic ya zamani (requestPromise, lastResult) kwa kutoa:
 * - **Caching:** Inatunza majibu ya API yasirudiwe rudiwe (staleTime).
 * - **Deduplication:** Hata component 10 zikiita hii hook kwa wakati mmoja, API call inakuwa moja tu.
 * - **Resilience:** Ikitokea timeout (Network Error), inajaribu kupiga API tena (Retry) kabla ya kukata tamaa.
 * 
 * @example
 * ```tsx
 * const { data: isSessionValid, isLoading, isError } = useSessionValidation();
 * 
 * if (isLoading) return <LoadingScreen/>;
 * if (isError) return <NetworkErrorAlert/>; // Mtandao unasumbua (Baada ya retries kufeli)
 * if (!isSessionValid) return <Redirect to="/login"/>; // Session imeisha
 * ```
 */
export function useSessionValidation() {
  return useQuery({
    // queryKey ndiyo kitambulisho. Tukitaka kufuta cache manually, tunatumia jina hili
    queryKey: ["session-validity"],
    
    // Function yetu ya juu ndio inapiga kazi hapa
    queryFn: validateSessionApi,
    
    // UI Optimization: Tunaitunza 'true' kwa sekunde 30 kabla ya kupiga tena API
    staleTime: 30 * 1000, 
    
    // Inakaa kwenye memory kwa dakika 5 hata kama user hayupo kwenye tab
    gcTime: 5 * 60 * 1000, 
    
    // Tunazuia kupiga API kila user akirudi kwenye window kutoka tab nyingine (inaokoa bandwidth)
    refetchOnWindowFocus: false, 
    
    // HII NDIO MAGIC: Ikiwa `validateSessionApi` itatupa (throw) error ya mtandao, 
    // TanStack itajaribu tena mara 2 kabla ya kusema `isError: true`
    retry: 2,
    
    // Inaweka "pumziko" kati ya retry na retry (Exponential backoff)
    // Retry 1: Baada ya sekunde 1, Retry 2: Baada ya sekunde 2...
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
}