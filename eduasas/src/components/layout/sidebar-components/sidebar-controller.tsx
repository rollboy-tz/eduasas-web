"use client"
import { PanelLeft } from "lucide-react";
import { useSidebarStore } from "@/store/layout/use-sidebar.store";
import { EduTooltip } from "@/components/elements";
import { useAppStore } from "@/store/layout/use-app.store";
import { motion, AnimatePresence } from "framer-motion";

export const SidebarController = () => {
  const { mode, setMinimal, setExpanded } = useSidebarStore();
  const isMobileView = useAppStore(s => s.isMobileView);

  // Kwenye simu, hatuonyeshi huu mlinzi wa pembeni (Unatumia Hamburger Menu kule juu)
  if (isMobileView) return null;

  const isExpanded = mode === "expanded";

  const handleToggle = () => {
    if (isExpanded) {
      setMinimal(); // Inarudi kuwa 50px
    } else {
      setExpanded(); // Inakuwa 260px
    }
  };

  return (
    <div className="absolute -right-3.5 top-[45%] z-[60]">
      <EduTooltip content={isExpanded ? "Collapse Panel" : "Expand Panel"} side="right">
        <button 
          onClick={handleToggle}
          className={`
            flex items-center justify-center p-1.5 bg-background 
            border border-border rounded-full shadow-xl
            transition-all duration-300 opacity-0
            cursor-pointer text-white group-hover:opacity-100
          `} 
          type="button"
        >
          <motion.div
            initial={false}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {isExpanded ? (
              <PanelLeft size={14} className="group-hover:text-foreground transition-colors" />
            ) : (
              <PanelLeft size={14} className="group-hover:text-foreground transition-colors" />
            )}
          </motion.div>
        </button>
      </EduTooltip>
    </div>
  );
};