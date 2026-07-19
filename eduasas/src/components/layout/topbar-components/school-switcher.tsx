//Path: components/layout/sidebar-components/school-switcher.tsx
"use client";

import { ChevronsUpDown, GraduationCap } from "lucide-react";

export function SchoolSwitcher() {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-muted/50 cursor-pointer transition-all border border-transparent hover:border-muted/20 group">
      {/* Icon ya Shule */}
      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
        <GraduationCap className="w-4 h-4" />
      </div>
      
      {/* Jina la Shule */}
      <div className="flex flex-col text-left leading-none">
        <span className="text-xs font-bold truncate max-w-[100px]">Mchikichini Sec.</span>
        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
          Academic Year 2026
        </span>
      </div>

      <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
    </div>
  );
}