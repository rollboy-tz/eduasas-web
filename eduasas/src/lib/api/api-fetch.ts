import { api } from "./api";
import { ApiResponse } from "./api-respone";
import { ApiError } from "./errors";

/**
 * ### apiFetch
 * @description Utility ya generic inayovuta data kutoka API na kurudisha data halisi (T).
 * Inashughulikia interceptors za API kwa nyuma.
 * * @template T - Aina ya data inayotarajiwa kurudi kutoka server.
 * @param url - URL ya endpoint unayotaka kupiga.
 * * @example
 * // Matumizi na TanStack Query (React Query)
 * const { data, error, isLoading } = useQuery({
 * queryKey: ['schools'],
 * queryFn: () => apiFetch<SchoolContextResponse>("/school/context")
 * });
 * * @returns {Promise<T>} Data halisi (T) kutoka kwa server.
 * @throws {ApiResponse} Inatupa error object ya API ikitokea tatizo.
 */
export async function apiFetch<T>(url: string): Promise<T> {
  try {
    const result = await api.get<any, ApiResponse<T>>(url);

    if (!result || (result.status !== "success" && result.status !== "warning")) {
      throw new ApiError({
        ...result, 
        status: "error"
      } as ApiResponse)
    }

    return result.data;

  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error(`🚨 [apiFetch ERROR] ${url}:`, error);
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError({
      success: false,
      status: "error",
      message: error.message || "Failed to fetch data",
      action: "NONE",
      data: null,
      timestamp: new Date().toISOString(),
      errorCode: "FETCH_FAILURE"
    });
  }
}