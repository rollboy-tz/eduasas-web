// context/SidebarContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

interface SidebarContextType {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  isProfilePanelOpen: boolean;
  toggleCollapse: () => void;
  toggleMobile: () => void;
  toggleProfilePanel: () => void;
  closeAllMobilePanels: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfilePanelOpen, setIsProfilePanelOpen] = useState(false);
  const pathname = usePathname();

  // Funga vyote mtumiaji anapobadili ukurasa (Route change)
  useEffect(() => {
    setIsMobileOpen(false);
    setIsProfilePanelOpen(false);
  }, [pathname]);

  // Window Resize Reset Logic (Desktop <-> Mobile transition safety)
  useEffect(() => {
    const handleResize = () => {
      // Skrini ikishakuwa kuanzia LG breakpoint (1024px)
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
        setIsProfilePanelOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCollapse = useCallback(() => setIsCollapsed((prev) => !prev), []);

  // Kufungua Sidebar ya simu inapoteza Profile Panel
  const toggleMobile = useCallback(() => {
    setIsMobileOpen((prev) => {
      if (!prev) setIsProfilePanelOpen(false); // Funga profile panel ikifunguka
      return !prev;
    });
  }, []);

  // Kufungua Profile Panel ya simu inapoteza Sidebar ya simu
  const toggleProfilePanel = useCallback(() => {
    setIsProfilePanelOpen((prev) => {
      if (!prev) setIsMobileOpen(false); // Funga sidebar ikifunguka
      return !prev;
    });
  }, []);

  const closeAllMobilePanels = useCallback(() => {
    setIsMobileOpen(false);
    setIsProfilePanelOpen(false);
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        isMobileOpen,
        isProfilePanelOpen,
        toggleCollapse,
        toggleMobile,
        toggleProfilePanel,
        closeAllMobilePanels,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar lazima itumike ndani ya SidebarProvider");
  }
  return context;
}