/**
 * @file use-badges.ts
 * @description Hook ya kitalamu inayounganisha live counts kutoka vyanzo mbalimbali (Notifications, Invitations).
 * Inasoma data kutoka kwenye SWR Cache pekee, hivyo haina mzigo wowote wa ziada kwenye server.
 * @author Rollboy TZ(EduAsas Tech)
 */

'use client'

import { useNotifications, useUserStaffInvitations } from "@/hooks/users";

/**
 * useBadges
 * Hook kuu ya kusimamia idadi ya alama za taarifa (badges) katika mfumo mzima.
 * * @returns {Object} 
 * - getBadgeCount: (href: string) => number (Hutoa idadi kulingana na link)
 * - totalAlerts: number (Jumla ya alerts zote mpya)
 * - hasAnyPending: boolean (Kama kuna chochote kinasubiri kufanyiwa kazi)
 */
export function useBadges() {
  // 1. Kuvuta data kutoka kwenye SWR Cache (Zero Network Overhead)
  const { unreadCount } = useNotifications();
  const { invitations } = useUserStaffInvitations();

  /**
   * Kokotoa mialiko ya kazi:
   * Tunachuja mialiko inayohitaji action (PENDING) na ambayo haijafichwa (NOT ARCHIVED).
   */
  const pendingInvitationsCount = invitations.filter(
    (inv) => inv.status === "PENDING" && !inv.archived
  ).length;

  /**
   * @constant badgeMap
   * Ramani inayounganisha URL path na data ya badge.
   * Ongeza path mpya hapa kadiri mfumo unavyokua.
   */
  const badgeMap: Record<string, number> = {
    // Notifications mapping
    "/notifications": unreadCount,
    "/dashboard/notifications": unreadCount,

    // Staff Invitations mapping
    "/invitations": pendingInvitationsCount,
    "/dashboard/invitations": pendingInvitationsCount,
    
    // Mfano wa kutumia kama boolean (dot pekee)
    // "/settings": pendingInvitationsCount > 0 ? 1 : 0,
  };

  /**
   * getBadgeCount
   * Inatafuta idadi ya badge kwa ajili ya link husika.
   * @param {string} href - Link ya menu item (e.g. "/notifications")
   */
  const getBadgeCount = (href?: string): number => {
    if (!href) return 0;
    
    // Tunatafuta match kamili au tunarudisha 0
    return badgeMap[href] || 0;
  };

  return { 
    getBadgeCount,
    totalAlerts: unreadCount + pendingInvitationsCount,
    hasAnyPending: (unreadCount + pendingInvitationsCount) > 0
  };
}