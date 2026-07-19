// /**
//  * @fileoverview School Staff Invitations Engine
//  * @description Inasimamia mzunguko wa mialiko ya wafanyakazi (Sent, Cancelled, Resent).
//  * Inatumia Partitioned Cache Key kwa usalama wa juu wa Multi-Tenancy.
//  * @author Injinia Rollboy (EduAsas Tech)
//  * @version 2.0.0
//  */

// "use client";

// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { apiFetch } from "@/lib/api/api-fetch";
// import { api }  from "@/lib/api";
// import { 
//   InstitutionalInvitation, 
//   SendInvitationPayload 
// } from "@/types/portal/staff-invitation.types";
// import { useUser } from "../users";
// import { useSchoolData } from "@/providers/context-provider";

// /**
//  * ### InvitationsHookReturn
//  * @property {InstitutionalInvitation[]} invitations - List ya mialiko iliyotumwa.
//  * @property {Object} metrics - Takwimu za mialiko (Sent, Pending, Joined, etc).
//  * @property {boolean} isLoading - Hali ya upakiaji.
//  * @property {Function} sendInvitation - Kutuma mwaliko mpya.
//  * @property {Function} cancelInvitation - Kughairi mwaliko.
//  * @property {Function} resendInvitation - Kutuma tena mwaliko.
//  */

// export function useSchoolStaffInvitations() {
//   const queryClient = useQueryClient();
//   const { profile } = useUser();
//   const { data: tenant } = useSchoolData();

//   // Ulinzi wa usalama: Key hii inahakikisha data ni specific kwa shule na user
//   const INVITE_KEY = ['school-invitations', tenant?.school.slug, profile?.id];

//   // 1. Fetching (GET)
//   const { data, isLoading, error } = useQuery<InstitutionalInvitation[]>({
//     queryKey: INVITE_KEY,
//     queryFn: () => apiFetch<InstitutionalInvitation[]>("/school/staff/invitations/sent"),
//     enabled: !!tenant?.school.slug && !!profile?.id,
//     staleTime: 1000 * 60 * 3, 
//   });

//   const invitations = data || [];

//   // 2. Metrics Engine
//   const metrics = {
//     totalSent: invitations.length,
//     totalPending: invitations.filter(inv => inv.status === "PENDING").length,
//     totalJoined: invitations.filter(inv => inv.status === "JOINED").length,
//     totalExpired: invitations.filter(inv => inv.status === "EXPIRED").length,
//     totalDeclined: invitations.filter(inv => inv.status === "DECLINED").length,
//     totalCancelled: invitations.filter(inv => inv.status === "CANCELLED").length,
//   };

//   // 3. Mutation Engine (CRUD)
//   const mutation = useMutation({
//     mutationFn: (args: { url: string; method: 'post' | 'patch'; body?: any }) => 
//       api[args.method](args.url, args.body),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: INVITE_KEY }),
//   });

//   /**
//    * @function sendInvitation
//    * @description Inatuma mwaliko mpya kwenda backend.
//    */
//   const sendInvitation = async (payload: SendInvitationPayload) => {
//     return mutation.mutateAsync({ 
//       url: "/school/staff/invitations/send", 
//       method: 'post', 
//       body: payload 
//     });
//   };

//   /**
//    * @function cancelInvitation
//    * @description Inasitisha mwaliko uliotangulia.
//    */
//   const cancelInvitation = async (id: string) => {
//     // Optimistic: Update status locally
//     queryClient.setQueryData(INVITE_KEY, (old: InstitutionalInvitation[] = []) =>
//       old.map(inv => inv.id === id ? { ...inv, status: 'CANCELLED' } : inv)
//     );
    
//     await mutation.mutateAsync({ 
//       url: `/school/staff/invitations/cancel/${id}`, 
//       method: 'post' 
//     });
//   };

//   /**
//    * @function resendInvitation
//    * @description Inatuma tena mwaliko kwa yuleyule aliyetumwa awali.
//    */
//   const resendInvitation = async (id: string) => {
//     await mutation.mutateAsync({ 
//       url: `/school/staff/invitations/resend/${id}`, 
//       method: 'post' 
//     });
//   };

//   return {
//     invitations,
//     metrics,
//     isLoading,
//     isError: error,
//     sendInvitation,
//     cancelInvitation,
//     resendInvitation,
//     refresh: () => queryClient.invalidateQueries({ queryKey: INVITE_KEY }),
//   };
// }