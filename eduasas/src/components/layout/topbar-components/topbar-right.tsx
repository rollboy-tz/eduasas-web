"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Bell, HelpCircle,
  CheckCheck, Moon,
  Sun, Monitor, Check,
  UserIcon
} from "lucide-react";
import { useTheme } from "next-themes";
import { EduTooltip } from "@/components/elements";
import { EduFloatingDiv } from "../../elements/edu-floating-card";
import { useAppStore, useMobileLayoutStore } from "@/store/layout"; // Store yetu mpya
import { TopBarSearchTrigger } from "./topbar-serch-trigger";
import { UserAvatar } from "../user-profile/user-mobile-avatar";
import { NotificationContainer } from "../min-notifications-container";

export function TopBarRight() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Mobile Trigger Logic
  const toggleProfile = useMobileLayoutStore((state) => state.toggleProfile);
  const isMobile = useAppStore((state: { isMobileView: boolean; }) => state.isMobileView);

  const themes = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="flex items-center gap-1.5 relative">
      <TopBarSearchTrigger />
      {/* 1. HELP CENTER - Inaonekana Desktop tu */}
      <div className="hidden md:block">
        <EduTooltip content="Help Center" side="bottom">
          <button
            onClick={() => router.push("/help")}
            className="p-2 rounded-full item-hover text-muted-foreground transition-all active:scale-95"
          >
            <HelpCircle className="w-5 h-5 hover:text-foreground" />
          </button>
        </EduTooltip>
      </div>

      {/* 2. NOTIFICATIONS - Inaonekana Desktop tu */}
      <div className="hidden md:block">
        <EduFloatingDiv
          side="bottom"
          className="w-80 overflow-hidden"
          trigger={
            <div className="p-2 rounded-full item-hover text-muted-foreground transition-all active:scale-95 relative cursor-pointer flex items-center justify-center h-9 w-9">
              <Bell className="w-5 h-5" />
              {/* Badge sasa imekaa kimkakati zaidi bila kusukuma icon */}
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full ring-2 ring-background animate-pulse" />
            </div>
          }
        >
          <NotificationContainer />
        </EduFloatingDiv>
      </div>

      {/* 3. THEME SWITCHER - Inaonekana Desktop tu */}
      <div className="hidden md:block">
        <EduFloatingDiv
          side="bottom"
          className="w-40 p-1 bg-popover/90 backdrop-blur-md border border-border rounded shadow-2xl"
          trigger={
            // /* Tumeondoa relative hapa, tumeiweka ndani ya button kwa usalama */
            <div className="p-2 rounded-full item-hover text-muted-foreground transition-all active:scale-95 cursor-pointer flex items-center justify-center relative h-9 w-9">
              <Sun className="w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute w-5 h-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              {/* Tumeondoa top-2 left-2 ili absolute itumie center ya parent flex */}
            </div>
          }
        >
          <div className="flex flex-col gap-0.5 shadow-xl bg-popover">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${theme === t.id
                  ? "bg-rinf text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <t.icon className="w-4 h-4" />
                  {t.label}
                </div>
                {theme === t.id && <Check className="w-3 h-3" />}
              </button>
            ))}
          </div>
        </EduFloatingDiv>
      </div>

      <div className="hidden md:block">
        {/*Tumeondoa relative hapa, tumeiweka ndani ya button kwa usalama */}
        <button className="rounded-full p-2 bg-ring transition-colors" onClick={toggleProfile} >
          <UserIcon size={18} className="w-5 h-5 hover:text-foreground cursor-pointer fill-foreground" />
          <span className="absolute top-1 right-0 w-1.5 h-1.5 bg-primary rounded-full ring-2 ring-background" />
        </button>

      </div>

      {/* 4. MOBILE PROFILE TRIGGER - Inaonekana kwenye Mobile pekee */}
      <div className="block md:hidden">
        <button className="rounded-full p-2 bg-ring transition-colors" onClick={toggleProfile} >
          <UserIcon size={18} className="w-5 h-5 hover:text-foreground cursor-pointer fill-foreground" />
          <span className="absolute top-1 right-0 w-1.5 h-1.5 bg-primary rounded-full ring-2 ring-background" />
        </button>
      </div>
    </div>
  );
}