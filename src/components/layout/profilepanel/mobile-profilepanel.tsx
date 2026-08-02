// components/MobileProfilePanel.tsx
"use client";

import React, { useState } from "react";
import { useSidebar } from "@/context/sidebar-context";
import {
  X,
  User,
  Bell,
  LogOut,
  Settings,
  Shield,
  HelpCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function MobileProfilePanel() {
  const { isProfilePanelOpen, toggleProfilePanel, closeAllMobilePanels } = useSidebar();
  const [activeTab, setActiveTab] = useState<"profile" | "notifications">("profile");

  if (!isProfilePanelOpen) return null;

  return (
    <>
      {/* 1. BACKDROP OVERLAY */}
      <div
        onClick={closeAllMobilePanels}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
      />

      {/* 2. RIGHT CONTAINER PANEL */}
      <aside className="fixed top-0 right-0 z-50 h-screen w-80 max-w-[85vw] bg-white border-l border-gray-200 shadow-2xl flex flex-col justify-between lg:hidden animate-in slide-in-from-right duration-300">
        
        {/* PANEL HEADER */}
        <div>
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                AD
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900 leading-tight">
                  Admin User
                </span>
                <span className="text-xs text-gray-400">admin@eduasas.com</span>
              </div>
            </div>

            <button
              onClick={toggleProfilePanel}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* TABS SWITCHER (Profile vs Notifications) */}
          <div className="flex border-b border-gray-100 p-1 bg-gray-50/50">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "profile"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all relative ${
                activeTab === "notifications"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Taarifa</span>
              <span className="w-2 h-2 bg-blue-600 rounded-full" />
            </button>
          </div>

          {/* PANEL CONTENT BODY */}
          <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            {activeTab === "profile" ? (
              /* TAB 1: PROFILE QUICK ACTIONS */
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">
                  Akaunti na Mfumo
                </p>

                {[
                  { icon: User, label: "Profile Yangu", href: "#" },
                  { icon: Settings, label: "Mipangilio ya Mfumo", href: "#" },
                  { icon: Shield, label: "Ulinzi na Usalama", href: "#" },
                  { icon: HelpCircle, label: "Msaada / Help Center", href: "#" },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={idx}
                      href={item.href}
                      onClick={closeAllMobilePanels}
                      className="flex items-center gap-3 p-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-all"
                    >
                      <Icon className="w-4 h-4 text-gray-400" />
                      <span>{item.label}</span>
                    </a>
                  );
                })}
              </div>
            ) : (
              /* TAB 2: NOTIFICATIONS TRAY */
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Taarifa Mpya
                  </p>
                  <button className="text-[11px] font-medium text-blue-600 hover:underline">
                    Soma Zote
                  </button>
                </div>

                <div className="space-y-2">
                  {[
                    {
                      title: "Mwanafunzi Mpya",
                      desc: "Juma Hamisi amesajiliwa Kidato cha 1",
                      time: "Dk 5 zilizopita",
                      unread: true,
                    },
                    {
                      title: "Malipo ya Ada",
                      desc: "Risiti #TRX-9081 imethibitishwa",
                      time: "Saa 1 lililopita",
                      unread: false,
                    },
                  ].map((notif, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-xs transition-all ${
                        notif.unread
                          ? "bg-blue-50/50 border-blue-100"
                          : "bg-white border-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-800">
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {notif.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PANEL FOOTER: LOGOUT BUTTON */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={closeAllMobilePanels}
            className="w-full flex items-center justify-center gap-2 p-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100/80 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Ondoka (Logout)</span>
          </button>
        </div>

      </aside>
    </>
  );
}