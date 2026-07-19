"use client";

import React from "react";
import { Search, Command } from "lucide-react";
import { useMobileLayoutStore } from "@/store/layout";

export function TopBarSearchTrigger() {
  // Tunachukua function ya kufungua search kutoka store yetu
  const toggleSearch = useMobileLayoutStore((state) => state.toggleSearch);

  return (
    <div className="flex-1 max-w-md">
      {/* 1. DESKTOP SEARCH TRIGGER */}
      <div
        onClick={toggleSearch}
        className="hidden md:flex items-center w-full gap-3 px-3 py-1.5 rounded-xl bg-card/40 border border-border text-muted hover:bg-muted/60 transition-all group"
      >
        <Search className="w-4 h-4 group-hover:text-primary transition-colors cursor-pointer" />
        <span className="text-sm flex-1 text-left text-muted">Search something...</span>
        
        {/* Shortcut hint ya kijanja */}
        <div className="flex items-center gap-1 bg-background border border-muted/50 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium cursor-pointer">
          <Command className="w-2.5 h-2.5" />
          <span>K</span>
        </div>
      </div>

      {/* 2. MOBILE SEARCH TRIGGER (Inaonekana kwenye Simu tu) */}
      <button
        onClick={toggleSearch}
        className="md:hidden p-2 rounded-full item-hover text-muted-foreground active:scale-90 transition-all"
      >
        <Search className="w-5 h-5" />
      </button>
    </div>
  );
}