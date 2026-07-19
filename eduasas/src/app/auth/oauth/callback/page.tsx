"use client";

import { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, ApiResponse} from "@/lib/api";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasCalled = useRef(false);

  useEffect(() => {
    // Kizuizi cha React StrictMode kisipige mara mbili (Double-call protection)
    if (hasCalled.current) return;
    hasCalled.current = true;

    const finalizeOAuth = async () => {
      const code = searchParams.get("code");
      const stateEncoded = searchParams.get("state") || "{}";

      // 1. Kuchambua State kwa usalama wa hali ya juu
      let state = { returnUrl: "/u/home", mode: "login", backUrl: "/auth/sign-in" };
      try {
        state = JSON.parse(decodeURIComponent(stateEncoded));
      } catch (e) {
        console.error("State Decode Error:", e);
      }

      // Pre-calculate backUrl ili iwe tayari kwa dharura yoyote
      const finalBackUrl = state.backUrl?.startsWith("/") 
        ? state.backUrl 
        : `/auth/${state.backUrl || "sign-in"}`;

      if (!code) {
        router.replace(`${finalBackUrl}?error=missing_code`);
        return;
      }

      try {
        const origin = window.location.origin;
        const redirectUri = `${origin}/auth/oauth/google`;

        /**
         * 🔥 THE HANDSHAKE
         * Tunatumia 'api' (Axios) ili interceptor ikamate Set-Cookie headers
         * na x-client-headers zote kutoka Backend.
         */
        const response = await api.post<any, ApiResponse>("/auth/google/callback", {
          code,
          mode: state.mode || "login",
          redirectUri
        });

        if (response && response.success) {
          // Kila kitu kiko sawa! Cookies zimeshawekwa na Browser kupitia Backend
          // Tunatumia replace badala ya push kuzuia user kurudi nyuma (Back button)
          router.replace(state.returnUrl || "/u/home");
        } else {
          const errorMsg = response?.message || "Oauth failed";
          router.replace(`${finalBackUrl}?error=${encodeURIComponent(errorMsg)}`);
        }
      } catch (err: any) {
        console.error("Critical Callback Crash Prevented:", err);
        const serverMessage = err.response?.data?.message || "Authentication error";
        router.replace(`${finalBackUrl}?error=${encodeURIComponent(serverMessage)}`);
      }
    };

    finalizeOAuth();
  }, [searchParams, router]);

  return (
    <div style={{ 
      height: "100vh", backgroundColor: "#151515", 
      display: "flex", justifyContent: "center", alignItems: "center",
      flexDirection: "column" 
    }}>
      {/* Glow Effect Loader */}
      <div style={{
        width: "50px", height: "50px", border: "4px solid #1a1a1a",
        borderTop: "4px solid #00ffcc", borderRadius: "50%",
        animation: "spin 1s linear infinite", boxShadow: "0 0 20px #00ffcc"
      }} />
      <h2 style={{ 
        marginTop: "30px", color: "#00ffcc", fontFamily: "sans-serif", 
        fontSize: "14px", letterSpacing: "2px", fontWeight: "300" 
      }}>
        TUNAIMARISHA ULINZI...
      </h2>

      <style jsx>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// Next.js inataka useSearchParams iwe ndani ya Suspense
export default function AuthOAuthCallback() {
  return (
    <Suspense fallback={
      <div style={{ height: "100vh", backgroundColor: "#151515" }} />
    }>
      <CallbackHandler />
    </Suspense>
  );
}