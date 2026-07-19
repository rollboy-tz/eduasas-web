//Path: components/layout/sidebar-components/top-bar-breadcrumbs.tsx
"use client";

import { ChevronRight, Home } from "lucide-react";

export function TopBarBreadcrumbs() {
  return (
    <nav className="flex items-center gap-2 text-sm font-medium whitespace-nowrap overflow-hidden">
      <div className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
        <Home className="w-4 h-4" />
        <span className="hidden sm:inline">Home</span>
      </div>
      
      <ChevronRight className="w-3.5 h-3.5 text-muted/50" />
      
      <div className="text-foreground font-semibold truncate max-w-[120px] sm:max-w-none">
        Dashboard
      </div>
    </nav>
  );
}