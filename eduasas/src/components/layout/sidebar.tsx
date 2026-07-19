"use client"
import { useMemo } from "react";
import { useAppStore } from "@/store/layout/use-app.store";
import { useSidebarStore } from "@/store/layout/use-sidebar.store";
import { motion, AnimatePresence } from "framer-motion";
import { SidebarController } from "./sidebar-components";
import { cn } from "@/lib/utils/helper";

interface SidebarProps {
  children: React.ReactNode;
}

/**
 * Sidebar Wrapper iliyoboreshwa:
 * 1. Inatumia useMemo kuzuia Infinite Loop Errors.
 * 2. Inahakikisha 50px precision kwenye Minimal mode.
 * 3. Inajumuisha Scrollable Navigation Zone.
 */
export function Sidebar({ children }: SidebarProps) {
  const isMobileView = useAppStore((state) => state.isMobileView);
  const mode = useSidebarStore((state) => state.mode);
  const toggleSidebar = useSidebarStore((state) => state.toggleMobile);

  /**
   * FOMULA YA UTULIVU:
   * Tunakokotoa 'state' na 'width' hapa komponeti inapopumua.
   * Hii inahakikisha getSnapshot inabaki na cache sahihi (Tiba ya loop error).
   */
  const behavior = useMemo(() => {
    let currentState = mode;
    
    // Logic ya Mobile Overriding
    if (isMobileView) {
      currentState = mode === "mobile" ? "mobile" : "hidden";
    }

    const widths = {
      expanded: "w-[220px]",
      minimal: "w-[50px]",
      hidden: "w-0",
      mobile: "w-[280px]"
    };

    return {
      state: currentState,
      widthClass: widths[currentState as keyof typeof widths]
    };
  }, [mode, isMobileView]);

  return (
    <>
      {/* 1. Mobile Overlay */}
      <AnimatePresence>
        {behavior.state === "mobile" && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => toggleSidebar()}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* 2. Sidebar Main Shell */}
      <motion.aside
        initial={false}
        animate={{ 
          x: behavior.state === "hidden" ? -280 : 0 
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={cn(
          "group fixed left-0 top-0 h-screen flex flex-col z-[50]",
          "border-r border-border transition-[width] duration-300 ",
          "bg-background rounded-tr-2xl rounded-br-2xl",
          "md:rounded-tr-none md:rounded-br-none",
          behavior.widthClass, behavior.state === "mobile" ? "shadow-2xl" : ""
        )}
      >
        <div className="flex flex-col h-full w-full relative">
          {/* Header Zone: Controller Button */}
          {!isMobileView && <SidebarController />}
            {children}
        </div>
      </motion.aside>
    </>
  );
}