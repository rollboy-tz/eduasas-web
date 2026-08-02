// components/Header.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSidebar } from "@/context/sidebar-context";
import { useSearch } from "@/context/search-context";
import { Search, Bell, Sidebar, Plus } from "lucide-react";

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
      data-app-header
      className={`h-14 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-all duration-200 ${isScrolled
          ? "bg-white/5 backdrop-blur-md border-b border-gray-200/80"
          : "bg-white/5 border-b border-transparent lg:bg-transparent"
        }`}
    >
      {/* 1. KUSHOTO: MOBILE MENU & LEFT ACTION */}
      <div className="flex items-center gap-1 sm:gap-3 p-1 bg-white shadow-sm rounded-full">
        <button
          onClick={toggleMobile}
          className="p-1.5 text-gray-600 lg:hidden hover:bg-gray-200  rounded-full cursor-pointer transition-all"
        >
          <Sidebar className="w-5 h-5" />
        </button>

        <div className="lg:hidden h-4 w-[1px] bg-gray-300 mx-0.5" />

        {leftAction ? (
          leftAction
        ) : (
          <button className="flex items-center gap-1.5 px-3 py-1.5 lg:p-1 rounded-full text-xs font-medium text-gray-700 hover:bg-gray-100 transition-all cursor-pointer">
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
        <div className="flex items-center bg-white border border-gray-200/80 rounded-full p-1 shadow-sm">

          {/* SEARCH TRIGGER */}
          <button
            onClick={openSearch}
            title="Search (Ctrl + K)"
            className="flex items-center gap-1 p-1.5 text-gray-500 hover:text-gray-900 hover:bg-muted-200/80 rounded-full transition-all cursor-pointer"
          >
            <Search className="w-6 h-6 lg:h-4 lg:w-4" />
          </button>

          <div className="h-4 w-[1px] bg-gray-300 mx-0.5" />

          {/* DESKTOP ONLY: NOTIFICATIONS BUTTON */}
          <button
            title="Notifications"
            className="hidden lg:flex relative p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-600 rounded-full" />
          </button>

          {/* SMALL DEVICES ONLY: AVATAR BUTTON (Triggers Mobile Profile Panel) */}
          <button
            onClick={toggleProfilePanel}
            className="lg:hidden p-0.5 border border-gray-200 rounded-full hover:ring-2 hover:ring-blue-500/20 transition-all cursor-pointer ml-1"
            title="Open Profile Menu"
          >
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] relative">
              AD
              {/* Notification Indicator Dot kwenye Mobile Avatar */}
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 border border-white rounded-full" />
            </div>
          </button>
        </div>


      </div>
    </header>
  );
}