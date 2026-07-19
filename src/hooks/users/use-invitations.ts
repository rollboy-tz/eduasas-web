// /**
//  * @fileoverview Staff Invitations Engine
//  * @description Inasimamia mzunguko wa maisha ya mialiko ya kazi (Accept, Decline, Archive).
//  * Inatumia Optimistic UI kwa ajili ya spidi ya juu na Batch state management.
//  * @author Injinia Rollboy (EduAsas Tech)
//  * @version 2.0.0 (TanStack Query)
//  */

// "use client";

// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { apiFetch } from "@/lib/api/api-fetch";
// import { api }  from "@/lib/api";
// import { UserStaffInvitation } from "@/types/account";
// import { useUser } from "./use-user";



// /**
//  * ### InvitationsHookReturn
//  * @property {UserStaffInvitation[]} invitations - Orodha ya mialiko.
//  * @property {boolean} hasPending - Ikiwa kuna mialiko mipya ya PENDING.
//  * @property {boolean} isLoading - Hali ya uvutaji data.
//  * @property {Function} acceptInvitation - Kukubali mwaliko.
//  * @property {Function} declineInvitation - Kukataa mwaliko.
//  * @property {Function} archiveInvitation - Kuficha mwaliko (Archive).
//  * @property {Function} unarchiveInvitation - Kurudisha mwaliko uliofichwa.
//  * @property {Function} refresh - Kulazimisha sync na server.
//  */

// /**
//  * Hook ya kitalamu kwa ajili ya User Staff Invitations.
//  * Inatumia mbinu ya Atomic Cache Invalidation.
//  * @returns {InvitationsHookReturn}
//  */
// export function useUserStaffInvitations() {
//   const queryClient = useQueryClient();
//   const { profile } = useUser();

//   const INVITE_QUERY_KEY = ['staff-invitations', profile?.id];
//   // 1. Fetching Data (GET)
//   const { data, isLoading, error } = useQuery<UserStaffInvitation[]>({
//     queryKey: INVITE_QUERY_KEY,
//     queryFn: () => apiFetch<UserStaffInvitation[]>("/my/staff/invitations"),
//     staleTime: 1000 * 60 * 5, // 5 minutes
//     gcTime: 1000 * 60 * 10,
//   });

//   const invitations = data || [];
//   const hasPending = invitations.some((inv) => inv.status === "PENDING" && !inv.archived);

//   // 2. Mutations (Optimistic UI Engine)
  
//   /** * @description Utility ya kufanya update kwenye cache kabla server haijajibu.
//    */
//   const updateCache = (id: string, patch: Partial<UserStaffInvitation>) => {
//     queryClient.setQueryData(INVITE_QUERY_KEY, (old: UserStaffInvitation[] = []) =>
//       old.map((inv) => (inv.id === id ? { ...inv, ...patch } : inv))
//     );
//   };

//   const mutation = useMutation({
//     mutationFn: (args: { url: string; method: 'post' | 'patch'; body?: any }) => 
//       api[args.method](args.url, args.body),
//     onSettled: () => queryClient.invalidateQueries({ queryKey: INVITE_QUERY_KEY }),
//   });

//   /**
//    * Kukubali Mwaliko.
//    * @param {string} id - ID ya mwaliko.
//    * @param {string} token - Token ya usalama.
//    */
//   const acceptInvitation = async (id: string, token: string) => {
//     updateCache(id, { status: "JOINED" });
//     await mutation.mutateAsync({ url: `/my/staff/invitations/accept/${id}`, method: 'post', body: { token } });
//   };

//   /**
//    * Kukataa Mwaliko.
//    * @param {string} id - ID ya mwaliko.
//    * @param {string} token - Token ya usalama.
//    */
//   const declineInvitation = async (id: string, token: string) => {
//     updateCache(id, { status: "DECLINED" });
//     await mutation.mutateAsync({ url: `/my/staff/invitations/decline/${id}`, method: 'post', body: { token } });
//   };

//   /**
//    * Kuficha mwaliko (Archive).
//    * @param {string} id - ID ya mwaliko.
//    */
//   const archiveInvitation = async (id: string) => {
//     updateCache(id, { archived: true });
//     await mutation.mutateAsync({ url: `/my/staff/invitations/archive/${id}`, method: 'patch' });
//   };

//   /**
//    * Kurudisha mwaliko (Unarchive).
//    * @param {string} id - ID ya mwaliko.
//    */
//   const unarchiveInvitation = async (id: string) => {
//     updateCache(id, { archived: false });
//     await mutation.mutateAsync({ url: `/my/staff/invitations/unarchive/${id}`, method: 'patch' });
//   };

//   return {
//     invitations,
//     hasPending,
//     isLoading,
//     isError: error,
//     acceptInvitation,
//     declineInvitation,
//     archiveInvitation,
//     unarchiveInvitation,
//     refresh: () => queryClient.invalidateQueries({ queryKey: INVITE_QUERY_KEY }),
//   };
// }