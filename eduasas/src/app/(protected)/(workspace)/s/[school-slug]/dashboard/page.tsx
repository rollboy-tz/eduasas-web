"use client";

import { motion } from "framer-motion";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* HEADER SECTION - Utambulisho wa Page */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--main-text)]">
          Dashboard
        </h1>
        <p className="text-[13px] text-muted">
          Karibu tena. Hapa kuna muhtasari wa kile kinachoendelea shuleni kwako leo.
        </p>
      </div>

      {/* BLANK CANVAS / PLACEHOLDER AREA */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Hapa ndipo utaweka Summary Cards (e.g. Total Students, Attendance, nk) */}
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className="h-32 rounded-sm border border-[var(--card-border)] bg-[var(--card-bg)] border-dashed flex items-center justify-center group hover:border-primary transition-colors cursor-pointer"
          >
            <span className="text-[11px] uppercase tracking-widest text-muted group-hover:text-primary font-bold">
              Widget Placeholder {i}
            </span>
          </div>
        ))}
      </motion.div>

      {/* MAIN CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Main Data/Charts) */}
        <div className="lg:col-span-2 min-h-[400px] rounded-sm border border-[var(--card-border)] bg-[var(--card-bg)] border-dashed flex items-center justify-center">
          <p className="text-[12px] text-muted font-mono italic">
            Main Content Area (e.g. Performance Charts or Recent Activities)
          </p>
        </div>

        {/* Right Column (Sidebar Widgets/Updates) */}
        <div className="min-h-[400px] rounded-sm border border-[var(--card-border)] bg-[var(--card-bg)] border-dashed flex items-center justify-center">
          <p className="text-[12px] text-muted font-mono italic">
            Secondary Content (e.g. Notifications or Quick Actions)
          </p>
        </div>

      </div>
    </div>
  );
}