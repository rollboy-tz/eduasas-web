// /**
//  * @fileoverview Permission Engine
//  * @description Inasimamia RBAC (Role Based Access Control) kwa kutumia `RestrictionLevel`.
//  * Inahakikisha kuwa shughuli nyeti kama DELETE au EDIT zinadhibitiwa kulingana na role za mwalimu.
//  */

// "use client";

// import React, { createContext, useContext, useMemo } from "react";
// import { useSchoolData } from "./school-data-provider";
// import { RestrictionLevel } from "@/types/portal";

// /**
//  * @interface PermissionContextType
//  * @description Mkataba wa ruhusa (permissions) zinazopatikana kwenye system.
//  */
// interface PermissionContextType {
//   isLocked: boolean;
//   isReadOnly: boolean;
//   isActive: boolean;
//   isSuperAdmin: boolean;
//   /**
//    * @function canPerformAction
//    * @description Hukagua kama mtumiaji anaruhusiwa kufanya action fulani.
//    * @example const canDelete = canPerformAction("DELETE");
//    */
//   canPerformAction: (action: "WRITE" | "DELETE" | "APPROVE" | "EDIT") => boolean;
// }

// const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

// /**
//  * ### PermissionProvider
//  * Inachuja data kutoka `SchoolDataProvider` na kuzitafsiri kuwa "Ruhusa".
//  * * @note Inatumia `useMemo` ili kuzuia recalculation ya permissions kila render.
//  */
// export const PermissionProvider = ({ children }: { children: React.ReactNode }) => {
//   const { data } = useSchoolData();

//   const permissions = useMemo(() => {
//     // Default state ikiwa data bado haijavutwa
//     if (!data) {
//       return { isLocked: true, isReadOnly: true, isActive: false, isSuperAdmin: false };
//     }

//     const isSuperAdmin = data.user.systemRole === "SUPER_ADMIN";
//     const staff = data.staff;
    
//     // Kupanga roles kwa priority (1 = juu kabisa) ili kupata RestrictionLevel inayotawala
//     const sortedRoles = [...(staff?.assignedRoles || [])].sort((a, b) => a.priority - b.priority);
//     const topRole = sortedRoles[0];
//     const restriction = topRole?.restrictionLevel as RestrictionLevel;

//     return {
//       isLocked: isSuperAdmin ? false : restriction === "LOCKED",
//       isReadOnly: isSuperAdmin ? false : restriction === "READ-ONLY",
//       isActive: staff?.status === "ACTIVE",
//       isSuperAdmin,
//     };
//   }, [data]);

//   /**
//    * @description Logic kuu ya usalama (The Guard). 
//    * SuperAdmin ana haki zote, wakati Locked accounts hazina haki yoyote.
//    */
//   const canPerformAction = (action: "WRITE" | "DELETE" | "APPROVE" | "EDIT") => {
//     if (permissions.isSuperAdmin) return true;
//     if (permissions.isLocked) return false;
    
//     // Kama ni READ-ONLY, hairuhusu kufanya mabadiliko ya data
//     if (["DELETE", "WRITE", "EDIT"].includes(action)) {
//       return !permissions.isReadOnly;
//     }
    
//     return true;
//   };

//   const contextValue = useMemo(() => ({
//     ...permissions,
//     canPerformAction
//   }), [permissions, canPerformAction]);

//   return (
//     <PermissionContext.Provider value={contextValue}>
//       {children}
//     </PermissionContext.Provider>
//   );
// };

// /**
//  * ### useStaffPermissions
//  * Hook ya kupata hali ya usalama ya mtumiaji aliyopo sasa.
//  * @example const { canPerformAction, isReadOnly } = useStaffPermissions();
//  * @throws {Error} Kama ikitumika nje ya PermissionProvider.
//  */
// export const useStaffPermissions = () => {
//   const context = useContext(PermissionContext);
//   if (!context) throw new Error("useStaffPermissions lazima itumike ndani ya PermissionProvider");
//   return context;
// };