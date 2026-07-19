"use client";

import { useEffect, useMemo } from "react";
import { Sidebar, TopBar, ProfilePanel, GlobalSearch } from "@/components/layout";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useSidebarStore } from "@/store/layout/use-sidebar.store";
import { useAppStore } from "@/store/layout/use-app.store";
import { useMenuData } from "@/hooks/layout/use-sidebar-data";
import { SidebarComposer, SidebarFooter, SidebarHeader, SidebarWrapper } from "@/components/layout/sidebar-components";
import { TopBarLeft, TopBarRight, TopBarBreadcrumbs } from "@/components/layout/topbar-components";
import { useUser } from "@/hooks/users";
import { useAuth } from "@/providers";
import { useTenantInitializer } from "@/providers/context-provider";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const isMobileView = useAppStore((state) => state.isMobileView);
  const mode = useSidebarStore((state) => state.mode);
  const syncDeviceMode = useSidebarStore((state) => state.syncDeviceMode);
  const pathname = usePathname();
  const { profile } = useUser();
  const { isAuthenticated, sessionKey } = useAuth();
  const { isLoading: loadingTenant } = useTenantInitializer(isAuthenticated, sessionKey);
  const { menuGroups } = useMenuData('user', profile?.id);

  useEffect(() => {
    syncDeviceMode(isMobileView);
  }, [isMobileView, syncDeviceMode]);

  const dynamicPadding = useMemo(() => {
    if (isMobileView || mode === "hidden") return 0;
    if (mode === "minimal") return 50;
    if (mode === "expanded") return 220;
    return 50;
  }, [isMobileView, mode]);

  if (!profile) return null;
  return (
    // 1. OUTER WRAPPER: Inazuia page nzima ku-scroll (Viewport Lock)
    <div className="h-screen w-full bg-background overflow-hidden flex relative">

      {/* 2. SIDEBAR: Iko fixed kitalamu upande wa kushoto */}
      <Sidebar>
        {/* Header: Iko juu, haitembei */}
        <SidebarHeader isOpen={mode === "expanded" || mode === "mobile"} />

        {/* Wrapper sasa hivi itashughulika na mambo ya ku-scroll TU */}
        <SidebarWrapper>
          <SidebarComposer menuData={menuGroups} currentPath={pathname} />
        </SidebarWrapper>

        {/* Footer: Iko chini kabisa, haitembei */}
        <SidebarFooter isOpen={mode === "expanded"} />
      </Sidebar>

      {/* 3. CONTENT AREA: Inachukua screen iliyobaki */}
      <motion.div
        initial={false}
        animate={{ paddingLeft: dynamicPadding }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="h-full w-full flex flex-col relative overflow-hidden"
      >

        {/* 4. TOPBAR: Tunaiweka flex-shrink-0 ili isisukumwe na content */}
        <div className="flex-shrink-0 z-40 bg-background/80 backdrop-blur-md">
          <TopBar>
            <TopBarLeft>
              <TopBarBreadcrumbs />
            </TopBarLeft>
            <TopBarRight />
          </TopBar>
        </div>

        {/* 5. SCROLLABLE AREA: Hii ndio pekee inayoruhusiwa ku-scroll */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar relative">
          <div className="max-w-[1600px] mx-auto min-h-full">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {children}
            </motion.div>
          </div>

          <ProfilePanel />
          <GlobalSearch />
        </main>

      </motion.div>
    </div>
  );
}