// import { useState, useCallback } from 'react';
// import { useQueryClient } from '@tanstack/react-query';
// //import { useTenant } from '@/providers/context-provider';
// import { api } from '@/lib/api';

// /**
//  * ### useSwitchTenant Hook
//  * Inasimamia mzunguko mzima wa maisha ya Workspace (Switching & Closing).
//  */
// export const useSwitchTenant = () => {
//   const [isSwitching, setIsSwitching] = useState(false);
//   //const { setTenant, clearTenant } = useTenant();
//   const queryClient = useQueryClient();

//   /**
//    * @function switchTenant
//    * Inabadilisha shule na kusawazisha cache zote.
//    */
//   const switchTenant = useCallback(async (schoolUId: string, schoolId: string ) => {
//     if (isSwitching) return;
    
//     setIsSwitching(true);
//     try {
//       await api.post("/school/switch", { schoolUId, schoolId });

//       // Safisha cache zote za shule kabla ya kuhamia mpya
//       await queryClient.removeQueries({ queryKey: ['school-context'] });

//       /setTenant(schoolUId);

//       await queryClient.invalidateQueries({ queryKey: ['school-context'] });
//     } catch (error) {
//       console.error("Switching error:", error);
//       throw error;
//     } finally {
//       setIsSwitching(false);
//     }
//   }, [isSwitching, setTenant, queryClient]);


  
//   /**
//    * @function closeTenant
//    * Inafunga shule, inasafisha cache, na inarudisha user kwenye hali ya kutokuwa na shule.
//    */
//   const closeTenant = useCallback(async () => {
//     if (isSwitching) return;
    
//     setIsSwitching(true);
//     try {
//       // 1. Tuma request ya kusitisha session kule server
//       await api.post("/school/clear-context");

//       // 2. Safisha kila kitu
//       await queryClient.removeQueries({ queryKey: ['school-context'] });
      
//       // 3. Weka state kuwa null kwenye provider na localStorage
//       clearTenant();
      
//     } catch (error) {
//       console.error("Closing error:", error);
//       throw error;
//     } finally {
//       setIsSwitching(false);
//     }
//   }, [isSwitching, clearTenant, queryClient]);

//   return { switchTenant, closeTenant, isSwitching };
// };