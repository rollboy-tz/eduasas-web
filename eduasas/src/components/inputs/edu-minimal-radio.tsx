"use client";


import { cn } from "@/lib/utils/helper";
import { motion } from "framer-motion";

interface EduMinimalRadioProps<T> {
  options: T[];
  selectedValue: any;
  onSelect: (value: any) => void;
  labelKey?: keyof T;
  valueKey?: keyof T;
  className?: string; // Container class
  buttonClassName?: string; // Button class
  activeColor?: string;
  indicatorPosition?: "left" | "right"; // MPYA: Positioning
}

export function EduMinimalRadio<T>({
  options,
  selectedValue,
  onSelect,
  labelKey = "label" as keyof T,
  valueKey = "value" as keyof T,
  className,
  buttonClassName,
  activeColor = "bg-primary",
  indicatorPosition = "right", // Default ni kulia kama mwanzo
}: EduMinimalRadioProps<T>) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {options.map((option, idx) => {
        const isSelected = option[valueKey] === selectedValue;

        return (
          <button
            key={idx}
            type="button"
            onClick={() => onSelect(option[valueKey])}
            className={cn(
              "group relative flex items-center justify-between p2 transition-all duration-300",
              indicatorPosition === "left" && "justify-end gap-4", // Gap kama dot ipo kushoto
              buttonClassName // Customize kutoka nje
            )}
          >
            {/* TEXT SECTION */}
            <div className={cn(
              "flex flex-col text-left flex-1",
              indicatorPosition === "left" && "order-2"
            )}>
              <span className={cn(
                "text-sm font-bold transition-colors duration-300",
                isSelected ? "text-foreground" : "text-muted group-hover:text-foreground/60"
              )}>
                {String(option[labelKey])}
              </span>
              {(option as any).description && (
                <span className="text-[10px] text-muted/20 uppercase tracking-tighter">
                  {(option as any).description}
                </span>
              )}
            </div>

            {/* RADIO INDICATOR */}
            <div className={cn(
              "h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0",
              indicatorPosition === "left" && "order-1",
              isSelected ? "border-primary" : "border-[var(--text-muted)]"
            )}>
              {isSelected && (
                <motion.div
                  layoutId="minimal-radio-dot"
                  className={cn("h-2 w-2 rounded-full relative flex items-center justify-center", activeColor)}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                >
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </motion.div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}