"use client";

import React, { useEffect, useRef } from "react";
import { Search, Command, X, User, FileText, Settings } from "lucide-react";
import { useMobileLayoutStore } from "@/store/layout";

export function GlobalSearch() {
  const { isSearchOpen, toggleSearch } = useMobileLayoutStore();
  const inputRef = useRef<HTMLInputElement>(null);

  // 1. Shortcuts za Keyboard (Ctrl + K kufungua, ESC kufunga)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Logic ya Ctrl + K au Cmd + K (Kufungua/Kugeuza)
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleSearch();
      }

      // Logic ya ESC (Kufunga tu)
      if (e.key === "Escape" && isSearchOpen) {
        e.preventDefault();
        toggleSearch(); // Hii itafunga kwa sababu isSearchOpen ilikuwa true
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggleSearch, isSearchOpen]); // Tumeongeza isSearchOpen hapa ili ESC iwe na uhakika wa hali iliyopo

  // 2. Focus input moja kwa moja ikifunguka
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4">
      {/* BACKGROUND OVERLAY (Blur effect) */}
      <div
        className="fixed inset-0 backdrop-blur-xs animate-in fade-in duration-200"
        onClick={toggleSearch}
      />

      {/* SEARCH BOX */}
      <div className="relative w-full max-w-2xl bg-background border border-muted/30 shadow-2xl rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200">

        {/* INPUT AREA */}
        <div className="flex items-center px-4 border-b border-muted/20 bg-muted/5">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            ref={inputRef}
            placeholder="Tafuta mwanafunzi, mwalimu au moduli..."
            className="flex-1 bg-transparent border-none focus:ring-0 px-3 py-4 text-sm text-foreground outline-none"
          />
          <kbd className="hidden sm:flex h-6 items-center gap-1 rounded border border-muted bg-muted/50 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">ESC</span>
          </kbd>
          <button onClick={toggleSearch} className="sm:hidden p-1 ml-2">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* RESULTS PLACEHOLDER (Hapa ndipo data zitakuja baadae) */}
        <div className="max-h-[60vh] overflow-y-auto p-2">

          <p className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Mapendekezo ya Haraka
          </p>

          <div className="space-y-1 mt-1">
            {/* Placeholder Items */}
            {[
              { icon: User, label: "Tafuta Mwanafunzi", category: "Wanafunzi" },
              { icon: FileText, label: "Ripoti za Mitihani", category: "Akademia" },
              { icon: Settings, label: "Mipangilio ya Mfumo", category: "System" },
            ].map((item, i) => (
              <button
                key={i}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors group text-left"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {item.category}
                </span>
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}