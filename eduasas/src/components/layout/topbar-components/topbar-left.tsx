"use client";

import React from "react";
import { Menu } from "lucide-react";
import { useSidebarStore } from "@/store/layout";
import { useAppStore } from "@/store/layout";

interface TopBarLeftProps {
  children?: React.ReactNode;
  onToggleSidebar?: () => void;
}

export function TopBarLeft({ children }: TopBarLeftProps) {
  const toggleSideBar = useSidebarStore((state) => state.toggleMobile);


  return (
    <div className="flex items-center gap-4">
      {/* Toggle Button: Inatumia muted foreground */}
      <button 
        onClick={() => toggleSideBar()}
        className="p-2 -ml-2 md:hidden rounded-md item-hover text-foreground transition-colors active:scale-95"
        aria-label="Toggle Sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Dynamic Content: Hapa ndipo schools switcher au breadcrumbs zitakaa */}
      <div className="flex items-center gap-2 overflow-hidden">
        {children}
      </div>
    </div>
  );
}