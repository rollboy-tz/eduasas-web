"use client";

import React from "react";
import { useProfilePanel } from "@/components/layout/ProfilePanel"; // Badilisha njia iendane na ulipohifadhi faili la context
import { X } from "lucide-react";
import { ProfilePanelHeader } from "./ProfilePanelHeader";

interface ProfilePanelProps {
  children?: React.ReactNode;
}

export default function ProfilePanel({ children }: ProfilePanelProps) {
  const { isOpen, closeProfilePanel } = useProfilePanel();

  if (!isOpen) return null;

  return (
    <>
      {/* 1. BACKDROP OVERLAY */}
      <div
        onClick={closeProfilePanel}
        className="fixed inset-0 z-40 animate-in fade-in duration-200"
      />

      {/* 2. RIGHT CONTAINER PANEL (SHELL ONLY) */}
      <aside className="fixed top-0 right-0 z-50 h-screen w-90 max-w-[90vw] bg-background border-l border-gray-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* PANEL CLOSE HEADER */}
        <div className="flex items-center justify-between p-2 border-b border-gray-100">
          <ProfilePanelHeader />
          <button
            onClick={closeProfilePanel}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PANEL CONTENT BODY (PURE SHELL / CHILDREN CONTAINER) */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

      </aside>
    </>
  );
}