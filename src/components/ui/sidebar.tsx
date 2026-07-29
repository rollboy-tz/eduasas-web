// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarGroups } from "@/data/sidebar-links";
import { EduAsasLogo } from "./edu-asas-logo";
import { useSidebar } from "@/contexts/sidebar-context";
import { LogOut, School, ChevronLeft, ChevronRight, X } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, isMobileOpen, toggleCollapse, closeMobile } = useSidebar();

  return (
    <>
      {/* 1. MOBILE BACKDROP (Overlay ya mweusi ikifunguka kwenye simu) */}
      {isMobileOpen && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* 2. SIDEBAR CONTAINER */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-screen bg-neutral-1 border-r border-border flex flex-col justify-between p-4 transition-all duration-300 ease-in-out ${
          // Mobile responsive placement
          isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"
        } ${
          // Desktop collapsed width vs full width
          isCollapsed ? "lg:w-15" : "lg:w-64"
        }`}
      >
        {/* TOP SECTION: BRANDING & TOGGLE BUTTON */}
        <div>
          <div className="flex items-center justify-between px-2 py-2 mb-4">
            <EduAsasLogo 
                titleClasses="font-black text-lg"
                titleHiden={isCollapsed}
            />

            {/* Mobile Close Button */}
            <button
              onClick={closeMobile}
              className="p-1 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* MIDDLE SECTION: LINKS */}
          <nav className="space-y-6">
            {sidebarGroups.map((group, groupIdx) => (
              <div key={groupIdx}>
                {/* Section Header (Inafichwa ikiwa minimal mode) */}
                {!isCollapsed && (
                  <p className="px-3 text-[11px] font-semibold text-gray-400 tracking-wider uppercase mb-2">
                    {group.groupLabel}
                  </p>
                )}

                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={isCollapsed ? item.title : undefined} // Tooltip ya msingi kwenye minimal mode
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? "bg-blue-50 text-blue-600 font-semibold"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        } ${isCollapsed ? "justify-center px-0" : ""}`}
                      >
                        <Icon
                          className={`w-5 h-5 shrink-0 ${
                            isActive ? "text-blue-600" : "text-gray-400"
                          }`}
                        />
                        {!isCollapsed && (
                          <span className="truncate">{item.title}</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* BOTTOM SECTION: PROFILE & DESKTOP TOGGLE */}
        <div className="border-t border-gray-100 pt-4 space-y-3">
          {/* User Profile View */}
          <div
            className={`flex items-center gap-3 px-2 py-1.5 ${
              isCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                AD
              </div>
              {!isCollapsed && (
                <div className="flex flex-col truncate">
                  <span className="text-sm font-semibold text-gray-800 truncate">
                    Admin User
                  </span>
                  <span className="text-xs text-gray-400 truncate">
                    admin@school.com
                  </span>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                title="Logout"
                className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Desktop Minimal Toggle Button (Collapse Button) */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex items-center justify-center w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl transition-colors text-xs font-medium gap-2"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Finya Sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}