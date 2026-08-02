"use client";

import { usePathname } from "next/navigation";
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils/helper";

import { useSidebar } from "@/context/sidebar-context";

import { SidebarComposer } from "./sidebar-composer";

import { sidebarMockData } from "@/data/sidebar.mock";
import { EduAsasLogo } from "@/components/ui";
import { EduFloatingDiv } from "@/components/modals";
import { DesktopProfilePanel } from "../profilepanel/desktop-profilepanel";
import { DesktopPanelTrigger } from "../profilepanel/desktop-panel-trigger";

/**
 * Props zinazohitajika na component ya `Sidebar`.
 */
interface SidebarContainerProps {
  /** 
   * Data ya menyu itakayotumiwa na sidebar (optional).
   * Ikiwa haikutolewa, itatumia `sidebarMockData` kama msingi.
   */
  menuData?: any[];
}

/**
 * Component kuu ya Sidebar inayoshughulikia muundo wa kompyuta (Desktop) na simu (Mobile).
 * 
 * Inajumuisha:
 * - Sehemu ya juu (Header) yenye Logo na batani ya kufunga kwenye simu.
 * - Eneo la menyu (Nav) linalochakatwa na `SidebarComposer`.
 * - Sehemu ya chini (Footer) yenye Profile Panel na batani ya kunja/kupanua (Collapse/Expand).
 */
export default function Sidebar({
  menuData = sidebarMockData,
}: SidebarContainerProps) {
  const pathname = usePathname();

  const { isCollapsed, isMobileOpen, toggleCollapse, toggleMobile } =
    useSidebar();

  return (
    <>
      {/* MOBILE OVERLAY: Inaonekana tu kwenye simu pindi menyu inapokuwa wazi */}
      {isMobileOpen && (
        <div
          onClick={toggleMobile}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed lg:static",
          "top-0 left-0",
          "h-screen",
          "z-50",
          "flex flex-col",
          "border-r border-border",
          "transition-all duration-300",
          // "overflow-hidden",

          /* MOBILE STYLING */
          isMobileOpen
            ? "translate-x-0 w-72"
            : "-translate-x-full lg:translate-x-0",

          /* DESKTOP STYLING */
          isCollapsed ? "lg:w-[80px]" : "lg:w-70"
        )}
      >
        {/* HEADER: Logo na Batani ya kufungia kwenye Mobile */}
        <div className="h-12 flex items-center justify-between px-4">
          <EduAsasLogo
            titleHiden={isCollapsed}
            titleClasses="font-black tracking-wide"
          />

          <button
            onClick={toggleMobile}
            className="lg:hidden p-2 rounded-lg hover:bg-muted-100 dark:hover:bg-muted-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* MENU AREA: Orodha ya menyu zinazoweza kuscroll-iwa */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar p-3">
          <SidebarComposer
            menuData={menuData}
            currentPath={pathname}
            collapsed={isCollapsed}
          />
        </nav>

        {/* FOOTER: Profile trigger pamoja na batani ya Collapse/Expand kwa Desktop */}
        <div className="flex flex-col border-t border-border p-3">
          <EduFloatingDiv
            trigger={
              <DesktopPanelTrigger userNameHidden={isCollapsed} />
            }
            side="right"
            spacing={2}
          >
            <DesktopProfilePanel />
          </EduFloatingDiv>

          <button
            onClick={toggleCollapse}
            className="hidden lg:flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm text-muted-500 hover:bg-muted-100 dark:hover:bg-muted-800 transition"
          >
            {isCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <>
                <ChevronLeft size={18} />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}