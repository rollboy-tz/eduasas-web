/**
 * @fileoverview Auth Security Engine (The Fortress)
 * @description Inasimamia utambulisho wa user, inafunga milango ya data kwa kufuta cache 
 * mara tu session inapobadilika. Hii ndiyo safu ya kwanza ya ulinzi (First Line of Defense).
 */

"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { TenantProvider } from "./context-provider/tenant-provider";
import { useQueryClient } from "@tanstack/react-query";
import { validateSessionApi } from "@/lib/helpers";
import { EduActionModal, EduMainLoader, EduScreenLoader } from "@/components/elements";

import { api }  from "@/lib/api";
import { SchoolDataProvider } from "./context-provider";
import { getUserKey } from "@/lib/utils";


/**
 * @interface AuthContextType
 * @description Mkataba wa Auth Engine kwa ajili ya components zote za system.
 */
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionKey: string | null;
  handleLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Routes ambazo hazihitaji Auth (Zinapunguza mizigo ya API call)
const PUBLIC_ROUTES = new Set(["/auth/sign-in", "/auth/sign-up", "/auth/forgot-password"]);

/**
 * ### AuthProvider (The Guard)
 * @description Inashughulikia:
 * 1. Cache Purging (Kuzuia data leakage).
 * 2. Session Validation (Kuzuia unauthorized access).
 * 3. Global Event Synchronization (Kufunga mifumo yote kwenye Logout).
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionKey, setSessionKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>("");

  const queryClient = useQueryClient();
  const isLoggingOut = useRef(false);
  const pathname = usePathname();
  const isPublicRoute = PUBLIC_ROUTES.has(pathname);
  
  /**
   * @function handleLogout
   * @description Inafuta kila alama ya session kwenye Browser Memory na Cache.
   * @throws {Error} Kama logout ya server itafeli, system inajilazimisha kufuta cache.
   */
  const handleLogout = useCallback(async () => {
    if (isLoggingOut.current) return;
    isLoggingOut.current = true;

    try {
      // 1. HARD PURGE: Futa kila kitu kwenye cache (Memory)
      queryClient.clear();
      // 2. Clear browser storage (Persistent)
      localStorage.clear();
      sessionStorage.clear();

      // 3. Signal Server
      await api.post("/auth/logout");
    } catch (error) {
      console.error("[SECURITY] Logout sequence forced client-side cleanup.");
    } finally {
      // 4. Force Reload (Kusafisha kabisa state ya JavaScript)
      window.location.href = `/auth/sign-in`;
    }
  }, [queryClient]);

  /* -------------------------------------------------------
     EVENT LISTENERS - "The Sync Engine"
     ------------------------------------------------------- */
  useEffect(() => {
    /**
     * @description Inafuta cache kabla ya kuingia kwa mtumiaji mpya.
     * Hii inazuia "Stale Session Leakage".
     */
    const sessionKey = getUserKey();
    const onNewSession = () => {
      queryClient.clear();
      setSessionKey(sessionKey)
      setAuthenticated(true);
    };

    window.addEventListener("eduasas:login", onNewSession as EventListener);
    window.addEventListener("eduasas:logout", handleLogout as EventListener);

    return () => {
      window.removeEventListener("eduasas:login", onNewSession as EventListener);
      window.removeEventListener("eduasas:logout", handleLogout as EventListener);
    };
  }, [handleLogout, queryClient]);

  /* -------------------------------------------------------
     INITIAL SESSION CHECK
     ------------------------------------------------------- */
     useEffect(() => {
      if (isPublicRoute) { 
        setIsLoading(false); 
        return; 
      }
    
      const validate = async () => {
        setIsLoading(true);
        try {
          const isValid = await validateSessionApi(); 
          setAuthenticated(isValid);
        } catch {
          setAuthenticated(false);
        } finally {
          setIsLoading(false);
        }
      };
    
      validate();
    }, [isPublicRoute]);

  if (isLoading && !isPublicRoute) {
    return <EduScreenLoader />;
  }



  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, handleLogout, sessionKey }}>
      {/* Ulinzi: TenantProvider inategemea Auth status */}
      <TenantProvider>
        <SchoolDataProvider>
          {children}
        </SchoolDataProvider>
      </TenantProvider>

      {/* RE-AUTHENTICATION MODAL */}
      <EduActionModal
        isOpen={isModalOpen}
        onClose={() => { }}
        variant="error"
        title="Session Expired"
        actions={[{ label: "Sign In", variant: "primary", onClick: handleLogout }]}
      >
        <p className="text-sm">{modalMessage}</p>
      </EduActionModal>
    </AuthContext.Provider>
  );
}

/**
 * @hook useAuth
 * @returns {AuthContextType} Ufikiaji wa Auth state na Logout function.
 * @throws {Error} Ikijaribu kutumika nje ya AuthProvider.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must used inside AuthProvider");
  return context;
};