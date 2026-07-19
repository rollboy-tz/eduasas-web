// components/inputs/EduRadialGroup.tsx

import React from "react";
import { cn } from "@/lib/utils/helper";

interface EduRadialGroupProps<T> {
  options: T[];
  valueKey: keyof T; // Key inayotumika kama ID (mfano: 'code' au 'id')
  selectedValue: string | number;
  onSelect: (item: T) => void;
  renderContent: (item: T) => React.ReactNode; // Jinsi card itakavyoonekana
  className?: string;
  buttonClassName?: string;
}

export function EduRadialGroup<T>({
  options,
  valueKey,
  selectedValue,
  onSelect,
  renderContent,
  className,
  buttonClassName,
}: EduRadialGroupProps<T>) {
  return (
    <div className={cn("grid grid-cols-1 gap-3", className)}>
      {options.map((item, index) => {
        const isSelected = String(item[valueKey]) === String(selectedValue);

        return (
          <div
            key={index}
            onClick={() => onSelect(item)}
            className={cn(
              "group relative cursor-pointer p-4 rounded-xl border transition-all duration-200 flex items-center justify-between gap-4 select-none",
              // Minimal Contrast Design - Hakuna shadow, hakuna glow
              isSelected
                ? "border-primary bg-primary/[0.03] text-foreground"
                : "border-border/60 bg-card/40 hover:border-border-foreground/30 hover:bg-muted/10 text-muted-foreground hover:text-foreground",
              buttonClassName
            )}
          >
            {/* Left: Content Area (Inachukua nafasi kubwa) */}
            <div className="flex-1 min-w-0 transition-transform duration-200 group-active:scale-[0.99]">
              {renderContent(item)}
            </div>

            {/* Right: Custom Premium Radio Indicator */}
            <div 
              className={cn(
                "h-5 w-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300",
                isSelected 
                  ? "border-primary/70 bg-primary bg-primary/10" 
                  : "border-border group-hover:border-muted-foreground/60"
              )}
            >
              {/* Inner dot - inatokea kwa zoom-in kishua */}
              <div 
                className={cn(
                  "h-2 w-2 rounded-full bg-primary transition-all duration-200 transform scale-0",
                  isSelected && "scale-100"
                )}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}