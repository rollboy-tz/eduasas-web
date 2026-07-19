// "use client";

// import { useUser } from "@/hooks/users";
// import { UserAffiliatedSchool } from "@/types/account";
// import { createContext, useContext, useState, ReactNode, useMemo, useEffect, useCallback, JSX } from "react";

// /**
//  * @interface TenantContextType
//  * @description Muundo wa Context pamoja na hali ya Initialization.
//  */
// export interface TenantContextType {
//   schoolUId: string | null;
//   schoolSlug: string | null;
//   isInitialized: boolean; // Hii ndio GATES (Inazuia component hazijaanza kazi kabla ya muda)
//   setTenant: (schoolUId: string) => void;
//   clearTenant: () => void;
// }

// const TenantContext = createContext<TenantContextType | undefined>(undefined);

// const LOCAL_STORAGE_KEY = "eduasas_active_tenant";

// export const TenantProvider = ({ children }: { children: ReactNode }): JSX.Element => {
//   const { profile, isLoading: isUserLoading } = useUser();
//   const [tenant, setTenantData] = useState<{ uid: string | null; slug: string | null }>({ uid: null, slug: null });
  
//   // Gatekeeper: Inakuwa false mpaka pale tutakapomaliza kuangalia localStorage na Profile
//   const [isInitialized, setIsInitialized] = useState(false);

//   const applyTenant = useCallback((uid: string, schools: UserAffiliatedSchool[]) => {
//     const found = schools.find((s) => s.schoolUId === uid);
//     if (found) {
//       setTenantData({ uid: found.schoolUId, slug: found.slug });
//     }
//     // Baada ya kujaribu ku-apply, tunafungua geti
//     setIsInitialized(true);
//   }, []);

//   useEffect(() => {
//     // Tunangoja User Profile ipatikane kwanza
//     if (isUserLoading) return;

//     const savedId = localStorage.getItem(LOCAL_STORAGE_KEY);
    
//     if (savedId && profile?.schools) {
//       applyTenant(savedId, profile.schools);
//     } else {
//       // Hata kama hakuna savedId, tunafunga initialization ili component zijue hakuna tenant
//       setIsInitialized(true);
//     }
//   }, [profile, isUserLoading, applyTenant]);

//   const setTenant = (schoolUId: string) => {
//     if (!profile?.schools) return;
    
//     applyTenant(schoolUId, profile.schools);
//     localStorage.setItem(LOCAL_STORAGE_KEY, schoolUId);

//     window.dispatchEvent(new CustomEvent("app:sync-context", {
//       detail: { schoolUId }
//     }));
//   };

//   const clearTenant = () => {
//     setTenantData({ uid: null, slug: null });
//     localStorage.removeItem(LOCAL_STORAGE_KEY);
//   };

//   const value = useMemo(() => ({
//     schoolUId: tenant.uid,
//     schoolSlug: tenant.slug,
//     isInitialized,
//     setTenant,
//     clearTenant
//   }), [tenant, isInitialized]);

//   return (
//     <TenantContext.Provider value={value}>
//       {children}
//     </TenantContext.Provider>
//   );
// };

// export const useTenant = (): TenantContextType => {
//   const context = useContext(TenantContext);
//   if (!context) {
//     throw new Error("useTenant() lazima itumike ndani ya <TenantProvider />.");
//   }
//   return context;
// };