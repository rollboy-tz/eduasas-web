/**
 * @file src/lib/api-mutation.ts
 * @description Centralized Mutation Handler kwa ajili ya POST, PUT, PATCH, DELETE operations.
 */

import { api } from "./api";
import { ApiResponse } from "./api-respone";
import { ApiError } from "./errors";

/**
* Inafanya API mutation (Create, Update, Delete) kwa usalama.
* Inakamata errors zote, inafanya logi za request, na inahakikisha data inarudi kwa Type-Safe format 
* kama ApiResponse nzima (pamoja na status, message, na data).
*
* @template T - Aina ya data iliyo ndani ya 'data' property ya ApiResponse (default: any).
* @param {'post' | 'put' | 'patch' | 'delete'} method - HTTP method ya kutumia.
* @param {string} url - Endpoint ya API.
* @param {any} [data] - (Optional) Payload ya kutuma kwenye API.
* @returns {Promise<ApiResponse<T>>} - Inarudisha ApiResponse object nzima ya API.
* @throws {ApiError} - Inatupa ApiError kama request ikifeli au backend ikirudisha status 'error'.
*
* @example
* // 1. Mfano wa POST: Ku-create mwanafunzi mpya na kusoma status
* const response = await apiMutation<Student>("post", "/students", { name: "John", age: 15 });
* if (response.status === "success") {
*   console.log("Mwanafunzi kaingia:", response.data);
* }
*
* @example
* // 2. Mfano wa PATCH: Ku-update profile ya mtumiaji
* const updateRes = await apiMutation<User>("patch", "/users/profile", { bio: "Hello world" });
* alert(updateRes.message); // "Profile updated successfully"
*
* @example
* // 3. Mfano wa DELETE: Kufuta shule na kuangalia 'action' inayofuata
* const deleteRes = await apiMutation("delete", "/schools/123");
* if (deleteRes.action === "REDIRECT_DASHBOARD") {
*   router.push("/dashboard");
* }
*/
export async function apiMutation<T = any>(
  method: "post" | "put" | "patch" | "delete",
  url: string,
  data?: any
): Promise<ApiResponse<T>> {
  try {
    // 1. Tunapiga mutation
    const response = await api({ method, url, data });

    // 2. Casting response nzima kuwa ApiResponse<T>
    const result = response as unknown as ApiResponse<T>;

    // 3. Validation: Kama ni error, tupa ApiError
    // Tunaacha 'success' na 'warning' zipite kama kawaida
    if (result.status !== "success" && result.status !== "warning") {
      throw new ApiError(result as any);
    }

    // 4. Tunarudisha 'result' nzima (ApiResponse object)
    return result;

  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error(`🚨 [apiMutation ERROR] ${url}:`, error);
    }

    if (error instanceof ApiError) throw error;

    // 5. Fallback kwa unexpected errors (bado tunarudisha ApiResponse object)
    throw new ApiError({
      success: false,
      status: "error",
      message: error.message || "Mutation failed",
      action: "NONE",
      data: null,
      timestamp: new Date().toISOString(),
      errorCode: "MUTATION_FAILURE"
    } as ApiResponse<any>);
  }
}