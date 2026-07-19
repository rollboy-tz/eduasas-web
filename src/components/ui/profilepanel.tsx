// "use client";

// import { User, Bell} from "lucide-react";
// import { SmartTabWrapper } from "@/components/layout";
// import { useMobileLayoutStore } from "@/store/layout";
// import { cn } from "@/lib/utils/helper";
// import { NotificationContainer } from "@/components/layout";
// import { useNotifications } from "@/hooks/users";
// import { MobileProfileView } from "@/components/layout";

// /**
//  * ProfilePanel
//  * Panel ya kulia inayoteleza (Drawer) kwa ajili ya simu pekee.
//  * Inajumuisha Profile, Quick Notifications, na System Actions.
//  */
// export function ProfilePanel() {
//   const { isProfileOpen, toggleProfile } = useMobileLayoutStore();
//   const { unreadCount } = useNotifications();
//   const hasUnred = unreadCount > 0;
//   return (
//     <>
//       {/* OVERLAY: Inafunika background mtumiaji akifungua panel */}
//       <div
//         className={cn(
//           "fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] transition-opacity duration-300 md:hidden",
//           isProfileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
//         )}
//         onClick={toggleProfile}
//       />

//       {/* THE DRAWER PANEL */}
//       <aside
//         className={cn(
//           "fixed top-0 right-0 h-full w-[85%] max-w-[340px] rounded-tl-2xl rounded-bl-2xl bg-background z-[120] border-l border-muted/20 shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col overflow-hidden",
//           isProfileOpen ? "translate-x-0" : "translate-x-full"
//         )} >
//         <SmartTabWrapper
//           tabs={[
//             { id: 'profile', label: 'Profile', icon: User },
//             { id: 'notifications', label: 'Alerts', icon: Bell, hasBadge: hasUnred  }
//           ]}
//         >
//           {(activeTabId) => (
//             <>
//               {activeTabId === 'profile' && <MobileProfileView />}
//               {activeTabId === 'notifications' && <NotificationContainer />}
//             </>
//           )}
//         </SmartTabWrapper>

//       </aside>
//     </>
//   );
// }