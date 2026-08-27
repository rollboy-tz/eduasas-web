"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SubjectSuggestion } from "@/types/school";
import { Book } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/elements";

/**
 * @interface FlowListProps
 * @description Configuration ya FlowList. 
 * Inaruhusu kudhibiti features za listi kupitia flags.
 */
interface FlowListProps {
  /** Data ya listi ya masomo */
  subjects: SubjectSuggestion[];
  /** Array ya IDs zilizochaguliwa (controlled state) */
  selectedIds: string[];
  /** Callback ya kuhadili toggling */
  onToggle: (id: string) => void;
  /** Callback ya long press (kwa ajili ya drag/actions za ziada) */
  onLongPress?: (id: string) => void;
  /** Feature Flag: Washa/Zima loading skeleton */
  isLoading?: boolean;
  /** Feature Flag: Washa/Zima animations za kuingia na kutoka */
  enableAnimations?: boolean;
  /** CSS Class ya ziada kwa ajili ya styling ya container */
  className?: string;
}

/**
 * @component FlowList
 * @description Inatengeneza listi ya vitu (subjects) yenye "Waterfall Animation".
 * Inatumia `AnimatePresence` na `layoutId` kuhakikisha kadi zinateleza 
 * kutoka listi moja kwenda nyingine bila kukatika (teleportation effect).
 */
export function FlowList({
  subjects,
  selectedIds,
  onLongPress,
  onToggle,
  isLoading = false,
  enableAnimations = true,
  className = ""
}: FlowListProps) {

  // Loading skeleton state yenye muonekano mzuri wa kupishana (stagger effect)
  if (isLoading) {
    return (
      <div className={cn("flex flex-col gap-2 p-2 min-h-[200px]", className)}>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-full h-12 rounded-lg" />
        ))}
      </div>
    );
  }

  // Ujumbe ikiwa listi ipo tupu
  if (subjects.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-6 text-center min-h-[200px] text-muted-foreground", className)}>
        <Book size={32} className="mb-2 opacity-40" />
        <div className="flex flex-col text-sm">
          <span>
            No subject suggetion found currently.
          </span>
          <span className="text-xs text-muted-400">
            Add custom subjects if need more.
          </span>
          
          </div>
      </div>
    );
  }

  return (
    <motion.ul
      layout
      className={cn(
        "selecto-list-container flex flex-col min-h-[200px] p-2 gap-1.5 overflow-y-auto",
        className
      )}
    >
      <AnimatePresence mode="popLayout">
        {subjects.map((subject, index) => {
          const isSelected = selectedIds.includes(subject.id);

          return (
            <motion.li
              key={subject.id}
              layoutId={enableAnimations ? subject.id : undefined}
              initial={enableAnimations ? { opacity: 0, y: -20 } : false} // Zinaanza juu kidogo zikiwa zimejificha
              animate={enableAnimations ? { opacity: 1, y: 0 } : false}
              exit={enableAnimations ? { opacity: 0, scale: 0.95 } : undefined}
              transition={{
                duration: 0.25,
                // Hii ndiyo inafanya ziteremke moja baada ya nyingine kutokana na namba yake (index)
                delay: enableAnimations ? index * 0.05 : 0,
                ease: "easeOut"
              }}
            >
              <div
                onClick={() => onToggle(subject.id)}
                onContextMenu={(e) => {
                  if (onLongPress) {
                    e.preventDefault();
                    onLongPress(subject.id);
                  }
                }}
                className={cn(
                  "group selecto-list w-full p-3 flex flex-col border text-start items-center rounded-lg cursor-pointer transition-colors duration-150 gap-1",
                  "border-border bg-card hover:bg-card-foreground/5",
                  isSelected && "border-primary/40 bg-primary/3 text-primary-foreground"
                )}
              >
                <div className="items-center justify-between flex w-full">
                  <div className="flex gap-2.5 items-center">
                    <Book
                      size={17}
                      className={cn("text-muted transition-colors", isSelected && "text-primary")}
                    />
                    <span className={cn("font-medium text-sm text-muted-800", isSelected && "font-semibold")}>
                      {subject.name}
                    </span>
                  </div>
                  <span className={cn(
                    "px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-secondary text-secondary-foreground",
                    isSelected && "bg-primary/50 text-white"
                  )}>
                    {subject.code}
                  </span>
                </div>
              </div>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </motion.ul>
  );
}