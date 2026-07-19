// src/components/layout/sidebar-components/sidebar-footer.tsx
'use client'

import { UserAvatar } from "@/components/layout/user-profile/user-mobile-avatar";
import { cn } from "@/lib/utils/helper";
import { useUser } from "@/hooks/users";
import { ChevronUp } from "lucide-react";
import { logoutAndRedirect } from "@/lib/helpers/logout-and-redirect";
import { EduFloatingDiv } from "@/components/elements";

export function SidebarFooter({ isOpen }: { isOpen: boolean }) {

  const { profile } = useUser();

  const handleLogout = () => {
    logoutAndRedirect(); // Unapitisha client kama argument
  };

  return (
    <EduFloatingDiv
      trigger={
        <div
          className={cn(
            "h-12 w-full flex items-center transition-all cursor-pointer duration-300 outline-none group border-none bg-transparent",
            isOpen ? "px-4 gap-3" : "justify-center"
          )}
        >
          {/* Avatar Section */}
          <div className="relative flex-shrink-0 flex items-center justify-center pointer-events-none">
            <UserAvatar size="sm" className="shadow-sm" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-background rounded-full" />
          </div>

          {/* Profile Info */}
          {isOpen && (
            <div className="flex flex-col flex-1 text-left overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300 pointer-events-none">
              <span className="text-[11px] font-black truncate capitalize tracking-tight leading-none">
                {profile?.firstName || "User"}
              </span>
              <span className="text-[9px] text-primary font-bold truncate tracking-widest mt-1">
                {profile?.email || profile?.phone || "No Email"}
              </span>
            </div>
          )}

          {isOpen && (
            <ChevronUp className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors ml-auto" />
          )}
        </div>}

    >
      {/* POPOVER CONTENT */}
      <div className="p-2 flex flex-col gap-1 bg-card shadow-lg">
        <div className="pb-2 border-b border-border/50 mb-1">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Profile</p>
          <h1 className="text-sm font-bold">{profile?.firstName} {profile?.lastName}</h1>
        </div>
        {/* Hapa unaweza kuweka profile menu items zako */}
        <button className="text-xs text-left p-2 hover:bg-muted rounded-lg transition-colors">Settings</button>
        <button onClick={() => handleLogout()} className="text-xs text-left p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors">Logout</button>
      </div>
    </EduFloatingDiv>
  );
}