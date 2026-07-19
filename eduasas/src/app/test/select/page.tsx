"use client";

import React from "react";
import { EduSelect } from "@/components/inputs/edu-select";
import {
  LayoutGrid,
  GraduationCap,
  BookOpen,
  Settings,
  Moon,
  Activity,
  UserCheck,
  Search,
  Lock,
  Zap,
  Globe
} from "lucide-react";

/**
 * PAGE: SELECT LAB v4.1 (Final Logic Test)
 * --------------------------------------------------------
 * 1. Adaptive Radius: Size LG (10px), MD (8px), SM (6px).
 * 2. Label Strategies: Floating vs Fixed vs None.
 * 3. Default Logic: Placeholder/Label vs Auto-Select.
 * 4. Border Styling: Neon (Blue focus) vs Flat (Dimmed focus).
 */

export default function SelectLabPage() {
  const roles = [
    { id: "R1", name: "System Admin", icon: Settings },
    { id: "R2", name: "Lead Teacher", icon: BookOpen },
    { id: "R3", name: "Student Rep", icon: GraduationCap }
  ];

  const levels = [
    { id: 1, title: "Ordinary Level (O-Level)" },
    { id: 2, title: "Advanced Level (A-Level)" }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 space-y-12 transition-colors duration-300">

      {/* HEADER SECTION */}
      <div className="max-w-6xl mx-auto border-b border-slate-500/20 pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-primary/10 rounded-[10px] text-primary">
              <Zap size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase">EduSelect Lab v4.1</h1>
              <p className="text-muted text-sm font-semibold tracking-wide">Adaptive UI • Shadowless • Logic Shield</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[var(--card-bg)] border border-slate-500/20 p-2 rounded-[10px]">
            <div className="px-5 py-2 bg-primary text-white rounded-[6px] text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Moon size={14} fill="currentColor" /> 2026 Production Ready
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* SECTION 1: NEON + FLOATING (AUTH STYLE) */}
        <div className="space-y-8 bg-[var(--card-bg)] p-8 rounded-[10px] border border-slate-500/20 card-bg">
          <div className="border-b border-slate-500/10 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <UserCheck size={16} className="text-primary" />
              <h2 className="text-primary font-black text-xs uppercase tracking-widest">Auth / Neon Strategy</h2>
            </div>
            <p className="text-muted text-[12px]">Size LG: Radius 10px | Neon Blue Border on Focus.</p>
          </div>

          <div className="space-y-10 bg-inherit">
            {/* MFANO 1: Floating Label pekee (Subiri Action) */}
            <EduSelect
              label="Select Official Role"
              variant="neon"
              size="lg"
              labelStrategy="floating"
              options={roles}
              labelKey="name"
              valueKey="id"
              iconKey="icon"
            />

            {/* MFANO 2: Floating + Error (Shake & Red Border) */}
            <EduSelect
              label="Identify Gender"
              variant="neon"
              size="lg"
              labelStrategy="floating"
              error="Selection is required to proceed"
              options={[]}
              labelKey="name"
              valueKey="id"
            />
          </div>
        </div>

        {/* SECTION 2: FLAT + FIXED (DASHBOARD STYLE) */}
        <div className="space-y-8 bg-[var(--card-bg)] p-8 rounded-[10px] border border-slate-500/20 card-bg">
          <div className="border-b border-slate-500/10 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <Activity size={16} className="text-slate-400" />
              <h2 className="text-foreground font-black text-xs uppercase tracking-widest">Dashboard / Flat Strategy</h2>
            </div>
            <p className="text-muted text-[12px]">Size MD: Radius 8px | Dimmed Borders (Slate-500/30).</p>
          </div>

          <div className="space-y-10 bg-inherit">
            {/* MFANO 3: Fixed Label (Juu) + Placeholder (Wait-for-Action) */}
            <EduSelect
              label="Academic Level (Sorted A-Z)"
              variant="flat"
              size="md"
              labelStrategy="fixed"
              placeholder="Select level..."
              options={levels}
              labelKey="title"
              valueKey="id"
              // Hapa tunaijaribu sorting yetu mpya
              sortBy="title"
              sortOrder="desc"
              sortType="string"
            />

            {/* MFANO 4: Size SM + Radius 6px + Auto-Select Logic */}
            <div className="grid grid-cols-2 gap-6 items-end">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-tighter">Quick Filter (SM)</span>
                <EduSelect
                  variant="flat"
                  size="sm"
                  labelStrategy="none" // Hapa itachagua ya kwanza 'System Admin' kwasababu hakuna label/placeholder
                  options={roles}
                  labelKey="name"
                  valueKey="id"
                />
              </div>

              <EduSelect
                variant="flat"
                size="sm"
                labelStrategy="none"
                placeholder="Search..."
                isDisabled={true}
                options={[]}
                labelKey="id"
                valueKey="id"
              />
            </div>
          </div>
        </div>

      </div>

      {/* FOOTER INFO */}
      <div className="max-w-6xl mx-auto pt-10 border-t border-slate-500/10 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-wrap justify-center gap-8 items-center text-[10px] font-black uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2 text-primary">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" /> NEON ACTIVE
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-500" /> FLAT DIMMED
          </div>
          <div className="flex items-center gap-2 text-red-500">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> ERROR VALIDATION
          </div>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-muted font-bold">
          <Globe size={14} />
          <span>TANZANIA SCHOOL SYSTEM UI</span>
        </div>
      </div>
    </div>
  );
}