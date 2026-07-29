// components/Header.tsx
"use client";

import { useSidebar } from "@/contexts/sidebar-context";
import { Bell, Menu, Search } from "lucide-react";

export default function Header() {
  const { toggleMobile } = useSidebar();

  return (
    <header className="h-11  backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      
      {/* Kitufe cha Hamburger Menu (Kinaonekana kwenye Mobile tu) */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobile}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden"
          aria-label="Open Sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Search Bar */}
        <div className="hidden sm:flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg w-64 md:w-80 border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tafuta kitu hapa..."
            className="bg-transparent text-sm focus:outline-none w-full text-gray-700"
          />
        </div>
      </div>

      {/* Kulia: Notifications & User */}
      <div className="flex items-center gap-3">
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="h-6 w-[1px] bg-gray-200" />

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-xs">
            AD
          </div>
          <span className="hidden md:inline-block text-xs font-semibold text-gray-800">
            EduAsas
          </span>
        </div>
      </div>

    </header>
  );
}