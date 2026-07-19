"use client"
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useSidebarStore } from "@/store/layout/use-sidebar.store";
import { EduTooltip } from "@/components/elements";

interface SidebarItemProps {
  title: string;
  href: string;
  icon?: LucideIcon | any;
  active?: boolean;
  isSubItem?: boolean;
  badge?: number; 
}

export function SidebarItem({ 
  title, 
  href, 
  icon: Icon, 
  active, 
  isSubItem,
  badge 
}: SidebarItemProps) {
  const pathname = usePathname();
  const mode = useSidebarStore((state) => state.mode);
  
  const isActive = active || pathname === href;
  const isExpanded = mode === "expanded" || mode === "mobile";

  // --- 1. TENGANISHA CLASS ZA CONTAINER (Logic ya 50px vs 260px) ---
  const mainClasses = `h-10 md:h-9 text-sm font-medium ${isActive ? 'item-active  text-foreground bg-foreground/10 hover:bg-foreground/10' : ' text-foreground/70 hover:text-foreground hover:bg-foreground/5'}`;
  const subClasses = `py-2 px-3 text-xs ${isActive ? 'text-foreground font-bold' : 'text-muted hover:text-foreground'}`;

  const ItemContent = (
    <Link 
      href={href}
      className={`
        group relative flex items-center transition-all duration-100 ease-in-out
        ${isExpanded ? 'px-3 gap-3 mx-1 rounded-lg md:rounded-md' : 'justify-center w-9 p-2  rounded-full'}
        ${isSubItem ? subClasses : mainClasses} `}> 
          
      {/* ICON SECTION */}
      <div className="relative flex items-center justify-center shrink-0">
        {Icon && (
          <Icon 
            size={isSubItem ? 15 : 20} // Minimal icons ziko 20px kwa ajili ya 50px sidebar
            className={`transition-colors text-muted ${isActive ? 'text-foreground fill-foreground' : 'group-hover:text-foreground'}`} 
          />
        )}
        
        {/* Notification Dot (Minimal Mode pekee) */}
        {!isExpanded && badge && badge > 0 && !isSubItem && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full border-2 border-background" />
        )}
      </div>
      
      {/* TITLE & BADGE SECTION */}
      {(isExpanded || isSubItem) && (
        <motion.div 
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-between w-full overflow-hidden"
        >
          <span className="truncate">{title}</span>
          
          {badge && badge > 0 && (
            <span className="
              ml-2 px-1.5 py-0.5 
              bg-primary text-foreground 
              text-[9px] font-black rounded-full 
              min-w-[18px] text-center
            ">
              {badge > 99 ? '99+' : badge}
            </span>
          )}
        </motion.div>
      )}
    </Link>
  );

  // Tooltip kwa ajili ya Minimal Mode (Icons pekee)
  if (!isExpanded && !isSubItem) {
    const badgeCount = badge && badge > 99 ? "99+" : badge;
    const tooltipTitle = badge && badge > 0 ? `${title} (${badgeCount})` : title;
    return (
      <EduTooltip content={tooltipTitle} side="right">
        <div className="w-full flex justify-center py-1">
          {ItemContent}
        </div>
      </EduTooltip>
    );
  }

  return <div className="py-0.5">{ItemContent}</div>;
}