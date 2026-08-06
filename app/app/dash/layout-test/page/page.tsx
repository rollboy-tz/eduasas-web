'use client';

import React from 'react';
import { useSidebar } from '@/providers/SidebarContext';
import { Sparkles, Monitor, Tablet, Smartphone, Activity, Users, ArrowUpRight } from 'lucide-react';

export default function PreviewPage() {
  const { mode, device, changeMode } = useSidebar();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Nexus V2 Hakisho
            </h1>
            <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Muundo wa kisasa wa Sidebar V2 yenye dynamic stack & floating modes.
          </p>
        </div>

        {/* Current Device Indicator Badge */}
        <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-900 border border-slate-800 rounded-2xl w-fit shadow-lg shadow-slate-950">
          {device === 'desktop' && <Monitor className="w-4 h-4 text-indigo-400" />}
          {device === 'tablet' && <Tablet className="w-4 h-4 text-indigo-400" />}
          {device === 'mobile' && <Smartphone className="w-4 h-4 text-indigo-400" />}
          <span className="text-xs font-semibold capitalize text-slate-300">
            Kifaa: <span className="text-indigo-400 font-bold">{device}</span>
          </span>
        </div>
      </header>

      {/* Dynamic Mode Controller Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: State Inspector */}
        <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-3xl backdrop-blur-xl flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
              Sidebar State
            </span>
            <h3 className="text-xl font-bold text-white capitalize mt-1">{mode} Mode</h3>
            <p className="text-xs text-slate-400 mt-2">
              Jaribu kubadilisha muundo wa sidebar kwa kubofya batani zilizo chini:
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={() => changeMode('minimal')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                mode === 'minimal'
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Minimal
            </button>
            <button
              onClick={() => changeMode('expanded')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                mode === 'expanded'
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Expanded
            </button>
            <button
              onClick={() => changeMode('floating')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                mode === 'floating'
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Floating
            </button>
          </div>
        </div>

        {/* Card 2: Analytics Demo */}
        <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-3xl backdrop-blur-xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-slate-400 font-medium">Watumiaji Hai</span>
              <h4 className="text-2xl font-bold text-white mt-1">24,520</h4>
            </div>
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium mt-4">
            <ArrowUpRight className="w-4 h-4" />
            <span>+12.5% mwezi huu</span>
          </div>
        </div>

        {/* Card 3: System Health Demo */}
        <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-3xl backdrop-blur-xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-slate-400 font-medium">System Performance</span>
              <h4 className="text-2xl font-bold text-white mt-1">99.9%</h4>
            </div>
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-4">
            <span>Uthabiti wa Server ni Mzuri</span>
          </div>
        </div>
      </section>
    </div>
  );
}