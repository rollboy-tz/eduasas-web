"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BookText, BookPlus, MoreVertical, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/elements";
import { RegisteredSubject } from "@/types/school";

interface ActiveFlowListProps {
  subjects: RegisteredSubject[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  isLoading?: boolean;
  className?: string;
}

export function ActiveFlowList({
  subjects,
  selectedIds,
  onToggle,
  isLoading = false,
  className = ""
}: ActiveFlowListProps) {

  if (isLoading) {
    return (
      <div className={cn("flex flex-col gap-2 p-2", className)}>
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="w-full h-14 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <motion.ul
      layout
      className={cn("flex flex-col gap-1.5 p-2", className)}
    >
      <AnimatePresence mode="popLayout">
        {subjects.map((subject, index) => {
          const isSelected = selectedIds.includes(subject.id);
          const isCustom = subject.source === 'CUSTOM';

          return (
            <motion.li
              key={subject.id}
              layoutId={subject.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <div
                onClick={() => onToggle(subject.id)}
                className={cn(
                  "group w-full max-w-md p-3 flex items-center justify-between border rounded-lg cursor-pointer transition-all duration-200",
                  "bg-card hover:bg-accent/50 border-border",
                  isSelected && "border-primary/40 bg-primary/3"
                )}
              >
                <div className="flex items-center gap-3">
                  {/* Icon inabadilika kulingana na source */}
                  <div className={cn(
                    "p-2 rounded-md",
                    isCustom ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                  )}>
                    {isCustom ? <BookPlus size={16} /> : <BookText size={16} />}
                  </div>
                  
                  <div className="flex flex-col">
                    <span className={cn("font-semibolf trancate text-sm", isSelected ? "text-primary-800" : "text-foreground")}>
                      {subject.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      {subject.category} • {subject.source}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-bold bg-secondary px-2 py-1 rounded">
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