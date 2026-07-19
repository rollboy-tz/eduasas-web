"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SubjectSuggestion } from "@/types/school";
import { SelectoList } from "../../../elements/smart-interact";
import { Book, Popsicle } from "lucide-react";
import { useCategories } from "@/hooks/school";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui";
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
  onLongPress: (id: string) => void;
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
 * * @example
 * <FlowList 
 * subjects={data} 
 * selectedIds={selected} 
 * onToggle={handleToggle}
 * enableAnimations={true}
 * />
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
  
  // Loading skeleton state
  if (isLoading ) {
    return (
      <div className={`flex flex-col gap-2 p-2 ${className}`}>
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="w-full" />
        ))}
      </div>
    );
  }

  return (
    <motion.ul
      layout
      className={`selcto-list-container flex flex-col min-h-[200px] px-2 ${className}`}
    >
      <AnimatePresence mode="popLayout">
        {subjects.map((subject) => (
          <motion.li 
            key={subject.id} 
            // layoutId inaruhusu kadi "kutambuliwa" na Framer ikihama container
            layoutId={enableAnimations ? subject.id : undefined} 
            initial={enableAnimations ? { opacity: 0, y: 20 } : false}
            animate={enableAnimations ? { opacity: 1, y: 0 } : false}
            exit={enableAnimations ? { opacity: 0, scale: 0.95 } : undefined}
            transition={{ duration: 0.2 }}
          >
            <SelectoList<SubjectSuggestion> 
              
              item={subject}
              id={subject.id}
              isSelected={selectedIds.includes(subject.id)}
              onToggle={() => onToggle(subject.id)}
              onLongPress={() => onLongPress(subject.id)}
              children={(props) => (
                <div
                {...props.attributes} 
                {...props.listeners} 
                style={props.style}
                className={cn("group selecto-list w-full p-2 flex flex-col border-b text-start items-center border-border cursor-pointer hover:bg-card-foreground/40 gap-1", props.isSelected ? "bg-primary/10": "")}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex gap-2 items-center">
                        <Book size={17} className="text-foreground"/>
                        <span className="font-medium">{props.item.name}</span>
                    </div>
                    <span className="badge badge-info text-[10px]">{props.item.code}</span>
                  </div>
                </div>
              )}
            />
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}