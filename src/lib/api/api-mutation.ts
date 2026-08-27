/**
 * @file src/lib/api-mutation.ts
 * @description Centralized Mutation Handler kwa ajili ya POST, PUT, PATCH, DELETE operations.
 */

import { isAxiosError } from "axios";
import { api } from "./api";
import { ApiResponse } from "./api-respone";
import { ApiError, isApiError } from "./errors";

type MutationMethod = "post" | "put" | "patch" | "delete";

/**
 * Inafanya API mutation (Create, Update, Delete) kwa usalama.
 * Inakamata errors zote na inahakikisha **ApiError PEKEE** ndiyo
 * inayotupwa nje ya function hii — kamwe si `AxiosError` ghafi, si
 * `unknown`, si generic `Error`. Kila mara ujumbe halisi wa backend
 * (`message`/`errorCode`/`action`) unatunzwa, hata kwenye network
 * errors au timeouts.
 *
 * @template TResponse - Aina ya data iliyo ndani ya 'data' property ya ApiResponse.
 * @template TPayload - Aina ya payload unayotuma (default: unknown, si `any`).
 * @param method - HTTP method ya kutumia.
 * @param url - Endpoint ya API.
 * @param data - (Optional) Payload ya kutuma kwenye API.
 * @returns Promise<ApiResponse<TResponse>> - ApiResponse nzima ikiwa success/warning.
 * @throws {ApiError} - Daima ApiError — tumia `isApiError()` kwenye catch yako.
 *
 * @example
 * const response = await apiMutation<Student>("post", "/students", { name: "John", age: 15 });
 * if (response.status === "success") console.log(response.data);
 *
 * @example
 * try {
 *   await apiMutation("delete", "/schools/123");
 * } catch (error) {
 *   if (isApiError(error)) {
 *     console.log(error.message, error.errorCode); // ujumbe HALISI wa backend
 *   }
 * }
 */
export async function apiMutation<TResponse = unknown, TPayload = unknown>(
  method: MutationMethod,
  url: string,
  data?: TPayload
): Promise<ApiResponse<TResponse>> {
  try {
    const response = await api({ method, url, data });
    const result = response as unknown as ApiResponse<TResponse>;

    if (result.status !== "success" && result.status !== "warning") {
      throw new ApiError(result as unknown as ApiResponse<unknown>);
    }

    return result;
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.error(`🚨 [apiMutation ERROR] ${url}:`, error);
    }

    // 1. Tayari ni ApiError (kutoka block ya juu, mfano status === "error") — pitisha moja kwa moja
    if (isApiError(error)) throw error;

    // 2. Backend ilijibu (4xx/5xx) na body — HII ndiyo "error halisi" iliyokuwa inapotea awali.
    //    Backend yako inarudisha JSON yenye muundo wa ApiResponse hata kwenye error,
    //    kwa hiyo tunaisoma moja kwa moja badala ya kutumia generic Axios message.
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

    // 3. Axios error bila response — hakuna mawasiliano kabisa na server
    //    (offline, timeout, DNS, CORS, connection refused). Tofautisha sababu
    //    ili UI iweze kuonyesha ujumbe unaofaa (si "Network Error" ya kawaida).
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

    // 4. Kitu kingine kabisa kisichotarajiwa (bug ya JS runtime, si Axios wala ApiError)
    const message = error instanceof Error ? error.message : "Mutation failed";
    throw new ApiError({
      success: false,
      status: "error",
      message,
      action: "NONE",
      data: null,
      timestamp: new Date().toISOString(),
      errorCode: "UNKNOWN_ERROR",
    } as ApiResponse<unknown>);
  }
}