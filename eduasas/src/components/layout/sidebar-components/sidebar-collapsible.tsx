"use client"
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, LucideIcon, ArrowUpRight } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { useSidebarStore } from "@/store/layout/use-sidebar.store";
import { SidebarItem } from "./sidebar-item";
import { EduTooltip } from "@/components/elements";

interface SidebarCollapsibleProps {
  id: string;
  title: string;
  icon?: LucideIcon | any;
  items: any[];
  active?: boolean;
}

export function SidebarCollapsible({ id, title, icon: Icon, items, active }: SidebarCollapsibleProps) {
  const mode = useSidebarStore((state) => state.mode);
  const openGroupId = useSidebarStore((state) => state.openGroupId);
  const setOpenGroupId = useSidebarStore((state) => state.setOpenGroupId);
  
  const pathname = usePathname();
  const isExpanded = mode === "expanded";
  const isOpen = openGroupId === id;

  // Logic ya Ukaguzi wa Watoto
  const isChildActive = items.some(item => item.href === pathname);
  const isParentActive = active || isChildActive;

  // Fungua group moja kwa moja ikiwa mtoto yuko active na tuko expanded mode
  useEffect(() => {
    if (isChildActive && isExpanded) {
        setOpenGroupId(id);
    }
  }, [pathname, isExpanded, isChildActive, id, setOpenGroupId]);

  const handleToggle = () => {
    setOpenGroupId(isOpen ? null : id);
  };

  const SubItemsList = (
    <div className={`flex flex-col gap-1 relative ${isExpanded ? 'ml-9 mt-1 border-l border-white/5' : 'mt-1'}`}>
      {items.map((item, index) => {
        const isSubActive = pathname === item.href;
        return (
          <SidebarItem
            key={index}
            title={item.title}
            href={item.href}
            icon={item.icon || ArrowUpRight}
            isSubItem
            active={isSubActive}
          />
        );
      })}
    </div>
  );

  return (
    <div className="w-full py-0.5 px-2">
      {isExpanded ? (
        /* --- EXPANDED MODE (Accordion) --- */
        <div className="flex flex-col w-full">
          <button
            onClick={handleToggle}
            className={`
              group flex items-center justify-between w-full p-2.5 rounded-xl transition-all duration-300
              ${isParentActive ? 'bg-white/5 text-primary' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}
            `}
          >
            <div className="flex items-center gap-3">
              {Icon && <Icon size={20} className={`${isParentActive ? 'text-primary' : 'group-hover:text-white'}`} />}
              <span className="text-sm font-medium">{title}</span>
            </div>
            <ChevronDown 
              size={14} 
              className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} ${isParentActive ? 'text-primary' : 'text-muted-foreground'}`} 
            />
          </button>

          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                {SubItemsList}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* --- MINIMAL MODE 50px (Popover) --- */
        <Popover.Root open={isOpen} onOpenChange={(open) => setOpenGroupId(open ? id : null)}>
          <EduTooltip content={title} side="right">
            <Popover.Trigger asChild>
              <button 
                className={`
                  relative h-10 w-full flex items-center justify-center transition-all duration-300
                  ${isParentActive ? 'text-primary' : 'text-muted-foreground hover:text-white'}
                `}
              >
                {/* Active Indicator Bar kwa 50px Mode */}
                {isParentActive && (
                  <motion.div 
                    layoutId="active-bar"
                    className="absolute left-[-8px] w-[3px] h-6 bg-primary rounded-r-full shadow-[0_0_10px_rgba(var(--primary),0.8)]"
                  />
                )}
                
                {Icon && <Icon size={20} />}
                
                {/* Dot ya kashirikishi kuwa kuna menu imefunguliwa */}
                {isOpen && (
                   <span className="absolute top-1 right-2 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                )}
              </button>
            </Popover.Trigger>
          </EduTooltip>

          <Popover.Portal>
            <Popover.Content
              side="right"
              sideOffset={15}
              className={`
                z-[100] min-w-[220px] p-2 
                bg-[#1A1A1A] border border-white/5 
                rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] 
                animate-in fade-in slide-in-from-left-2
              `}
            >
              {/* Header ya Popover */}
              <div className="flex items-center gap-3 p-2 mb-2 border-b border-white/5">
                {Icon && <Icon size={16} className="text-primary" />}
                <p className="text-[11px] font-black uppercase tracking-widest text-white/80">{title}</p>
              </div>
              
              {/* List ya Watoto */}
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                {SubItemsList}
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      )}
    </div>
  );
}