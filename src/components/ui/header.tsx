// components/Header.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSidebar } from "@/context/sidebar-context";
import { useSearch } from "@/context/search-context";
import { Search, Bell, HelpCircle, Menu, Plus } from "lucide-react";

interface HeaderProps {
  leftAction?: React.ReactNode;
  title?: string;
}

export default function Header({ leftAction, title = "Dashboard" }: HeaderProps) {
  const { toggleMobile, toggleProfilePanel } = useSidebar();
  const { openSearch } = useSearch();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const mainContainer = document.querySelector("main");
    const handleScroll = () => {
      if (mainContainer && mainContainer.scrollTop > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    mainContainer?.addEventListener("scroll", handleScroll);
    return () => mainContainer?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`h-14 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-all duration-200 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-b border-gray-200/80 shadow-sm"
          : "bg-gray-50/50 border-b border-transparent lg:bg-transparent"
      }`}
    >
      {/* 1. KUSHOTO: MOBILE MENU & LEFT ACTION */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={toggleMobile}
          className="p-1.5 text-gray-600 hover:bg-white hover:shadow-sm rounded-lg lg:hidden transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>

        {leftAction ? (
          leftAction
        ) : (
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200/80 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-all">
            <Plus className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Add School</span>
          </button>
        )}
      </div>

      {/* 2. KATIKATI: TITLE NDOGO */}
      <div className="flex items-center justify-center">
        <h1 className="text-xs sm:text-sm font-semibold text-gray-800 tracking-tight capitalize">
          {title}
        </h1>
      </div>

      {/* 3. KULIA: MINIMALIST GROUPED ICONS */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-white border border-gray-200/80 rounded-xl p-1 shadow-sm">
          
          {/* SEARCH TRIGGER */}
          <button
            onClick={openSearch}
            title="Search (Ctrl + K)"
            className="flex items-center gap-1.5 px-2 py-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition-all"
          >
            <Search className="w-4 h-4" />
            <kbd className="hidden md:inline-flex items-center gap-0.5 text-[9px] font-mono font-medium text-gray-400 bg-gray-100 px-1 rounded">
              ⌘K
            </kbd>
          </button>

          <div className="h-3.5 w-[1px] bg-gray-200 mx-0.5" />

          {/* DESKTOP ONLY: NOTIFICATIONS BUTTON */}
          <button
            title="Notifications"
            className="hidden lg:flex relative p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition-all"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-600 rounded-full" />
          </button>

          <div className="hidden lg:block h-3.5 w-[1px] bg-gray-200 mx-0.5" />

          {/* HELP CENTER BUTTON (Inaonekana Kote) */}
          <button
            title="Help Center"
            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition-all"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        {/* SMALL DEVICES ONLY: AVATAR BUTTON (Triggers Mobile Profile Panel) */}
        <button
          onClick={toggleProfilePanel}
          className="lg:hidden p-0.5 border border-gray-200 rounded-full hover:ring-2 hover:ring-blue-500/20 transition-all"
          title="Open Profile Menu"
        >
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] relative">
            AD
            {/* Notification Indicator Dot kwenye Mobile Avatar */}
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 border border-white rounded-full" />
          </div>
        </button>
      </div>
    </header>
  );
}