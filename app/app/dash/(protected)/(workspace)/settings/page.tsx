"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  Bell,
  Sliders,
  Camera,
  Save,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Globe,
  Loader2,
  Building2,
  BadgeCheck,
} from "lucide-react";
import { UserProfileResponse } from "@/types/dash/user-profile";
import { UserService } from "@/data/user-profile-data";

export default function UserSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<UserProfileResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "schools" | "preferences" | "notifications">("profile");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadUserProfile() {
      try {
        setLoading(true);
        const res = await UserService.getUserProfile();
        setData(res);
      } catch (err) {
        console.error("Failed to load user profile", err);
      } finally {
        setLoading(false);
      }
    }
    loadUserProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Settings zimehifadhiwa!");
    }, 800);
  };

  if (loading || !data) {
    return (
      <div className="min-h-[350px] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
        <p className="text-xs text-gray-500 font-medium">Inatayarisha muonekano...</p>
      </div>
    );
  }

  const { profile, accountSecurity } = data;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Mipangilio ya Akaunti
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Dhibiti taarifa za {profile.firstName}, usalama, na shule zilizounganishwa.
          </p>
        </div>
        <div className="self-start sm:self-auto px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-xl text-xs font-mono text-gray-600">
          UID: <span className="font-bold text-gray-900">{profile.uid}</span>
        </div>
      </div>

      {/* COMPLIANCE ALERT BANNER */}
      {!accountSecurity.isComplianceMet && (
        <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start gap-3 shadow-xs">
          <div className="p-2 bg-amber-100 rounded-xl text-amber-700 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1 flex-1">
            <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
              Hatua za Usalama Zinahitajika ({accountSecurity.alertLevel})
            </h3>
            <p className="text-xs text-amber-800">{accountSecurity.recommendation}</p>

            <div className="pt-2 space-y-1.5">
              {accountSecurity.requiredActions.map((act, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-white/80 p-2.5 rounded-xl border border-amber-200/60 text-xs text-amber-900"
                >
                  <span className="font-medium">{act.message}</span>
                  <button
                    onClick={() => setActiveTab("profile")}
                    className="px-2.5 py-1 bg-amber-600 text-white rounded-lg text-[11px] font-semibold hover:bg-amber-700 transition-all shrink-0"
                  >
                    Kamilisha Sasa
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}