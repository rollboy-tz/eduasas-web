"use client";

import React from "react";

// --- SECTION GROUP CONTAINER ---
interface SettingGroupProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export const SettingGroup: React.FC<SettingGroupProps> = ({ title, description, children }) => {
  return (
    <div className="space-y-2">
      {/* Group Title & Subtitle (Optional) */}
      {(title || description) && (
        <div className="px-1 space-y-0.5">
          {title && <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{title}</h3>}
          {description && <p className="text-xs text-gray-400 dark:text-gray-500">{description}</p>}
        </div>
      )}

      {/* Group Card Background */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 rounded-2xl shadow-xs overflow-hidden divide-y divide-gray-100 dark:divide-gray-800/60">
        {children}
      </div>
    </div>
  );
};

// --- INDIVIDUAL ROW ITEM ---
interface SettingItemProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action: React.ReactNode; // Toggle, Select, au Button
}

export const SettingItem: React.FC<SettingItemProps> = ({ title, description, icon, action }) => {
  return (
    <div className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
      {/* Left side: Icon, Title & Description */}
      <div className="flex items-start gap-3.5 max-w-[75%]">
        {icon && <div className="mt-0.5 text-gray-500 dark:text-gray-400 shrink-0">{icon}</div>}
        <div className="space-y-0.5">
          <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h4>
          {description && <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>}
        </div>
      </div>

      {/* Right side: Control Component (Toggle/Select) */}
      <div className="shrink-0">{action}</div>
    </div>
  );
};