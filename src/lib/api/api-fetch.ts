import { isAxiosError } from "axios";
import { api } from "./api";
import { ApiResponse } from "./api-respone";
import { ApiError, isApiError } from "./errors";

/**
 * ### apiFetch
 * @description Utility ya generic inayovuta data kutoka API na kurudisha data halisi (T).
 * Inashughulikia interceptors za API kwa nyuma. Inatupa **ApiError PEKEE** kila mara
 * kukiwa na tatizo — kamwe si `AxiosError` ghafi, si `unknown`, wala generic `Error`.
 *
 * @template T - Aina ya data inayotarajiwa kurudi kutoka server.
 * @param url - URL ya endpoint unayotaka kupiga.
 *
 * @example Na TanStack Query — peana TError generic ili `error` isiwe `Error` ya default
 * ```ts
 * const { data, error, isLoading } = useQuery<SchoolContextResponse, ApiError>({
 *   queryKey: ['schools'],
 *   queryFn: () => apiFetch<SchoolContextResponse>("/school/context"),
 * });
 *
 * if (error) {
 *   // TS inajua error ni ApiError moja kwa moja, hakuna narrowing inayohitajika
 *   toast.error(error.message);
 * }
 * ```
 *
 * @example Nje ya React Query, ndani ya try/catch
 * ```ts
 * try {
 *   const school = await apiFetch<SchoolContextResponse>("/school/context");
 * } catch (error) {
 *   if (isApiError(error)) console.log(error.message, error.errorCode);
 * }
 * ```
 *
 * @returns {Promise<T>} Data halisi (T) kutoka kwa server.
 * @throws {ApiError} - Daima ApiError.
 */
export async function apiFetch<T>(url: string): Promise<T> {
  try {
    const result = await api.get<any, ApiResponse<T>>(url);

    if (!result || (result.status !== "success" && result.status !== "warning")) {
      throw new ApiError({
        ...result,
        status: "error",
      } as ApiResponse<unknown>);
    }

    return result.data;
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error(`🚨 [apiFetch ERROR] ${url}:`, error);
    }

    // 1. Tayari ni ApiError (kutoka block ya juu) — pitisha moja kwa moja
    if (isApiError(error)) throw error;

    // 2. Backend ilijibu (4xx/5xx) na body — soma ujumbe HALISI badala ya
    //    generic Axios message ("Request failed with status code 404" n.k.)
    if (isAxiosError(error) && error.response?.data) {
      const backend = error.response.data as Partial<ApiResponse<unknown>>;
      throw new ApiError({
        success: false,
        status: "error",
        message: backend.message ?? `Server error (${error.response.status})`,
        action: backend.action ?? "NONE",
        data: backend.data ?? null,
        timestamp: backend.timestamp ?? new Date().toISOString(),
        errorCode: backend.errorCode ?? `HTTP_${error.response.status}`,
      } as ApiResponse<unknown>);
    }

    // 3. Axios error bila response — hakuna mawasiliano kabisa (offline/timeout/CORS)
    if (isAxiosError(error)) {
      const isTimeout = error.code === "ECONNABORTED";
      throw new ApiError({
        success: false,
        status: "error",
        message: isTimeout
          ? "Request timed out (timeout). Please try again."
          : "Failed to connect to the server. Check your network connection.",
        action: "NONE",
        data: null,
        timestamp: new Date().toISOString(),
        errorCode: error.code ?? "NETWORK_ERROR",
      } as ApiResponse<unknown>);
    }

    // 4. Kitu kingine kisichotarajiwa kabisa
    const message = error instanceof Error ? error.message : "Failed to fetch data";
    throw new ApiError({
      success: false,
      status: "error",
      message,
      action: "NONE",
      data: null,
      timestamp: new Date().toISOString(),
      errorCode: "FETCH_FAILURE",
    } as ApiResponse<unknown>);
  }
}