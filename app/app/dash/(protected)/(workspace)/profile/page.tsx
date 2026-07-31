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

      {/* TABS */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-1.5 shadow-xs flex flex-wrap gap-1">
        {[
          { id: "profile", label: "Profile", icon: User },
          { id: "schools", label: `Shule Zangu (${profile.schools.length})`, icon: Building2 },
          { id: "preferences", label: "Preferences", icon: Sliders },
          { id: "notifications", label: "Notifications", icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* FORM CONTENT */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 sm:p-7">
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* TAB 1: PROFILE */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-blue-600 text-white text-xl font-bold flex items-center justify-center border-2 border-white shadow-md">
                    {profile.firstName[0]}
                    {profile.lastName[0]}
                  </div>
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 p-1.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all shadow-xs"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-semibold text-gray-800">
                    {profile.firstName} {profile.lastName}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded uppercase">
                      Role: {profile.systemRole}
                    </span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded">
                      Status: {profile.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    defaultValue={profile.firstName}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    defaultValue={profile.lastName}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 flex items-center justify-between">
                    <span>Email</span>
                    {profile.isEmailVerified && (
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </label>
                  <input
                    type="email"
                    defaultValue={profile.email}
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700 flex items-center justify-between">
                    <span>Phone Number</span>
                    {!profile.isPhoneVerified && (
                      <span className="text-[10px] text-amber-600 font-bold">Unverified / Required</span>
                    )}
                  </label>
                  <input
                    type="text"
                    placeholder="+255 7XX XXX XXX"
                    defaultValue={profile.phone || ""}
                    className={`w-full px-3 py-2 border rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      !profile.phone
                        ? "bg-amber-50/40 border-amber-300 focus:ring-amber-500/20 focus:border-amber-500"
                        : "bg-gray-50 border-gray-200 focus:ring-blue-500/20 focus:border-blue-600"
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AFFILIATED SCHOOLS */}
          {activeTab === "schools" && (
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-sm font-bold text-gray-900">Shule Zilizounganishwa (Affiliations)</h2>
                <p className="text-xs text-gray-500">Orodha ya shule unazozisimamia au kufanya kazi nazo.</p>
              </div>

              {profile.schools.length === 0 ? (
                <p className="text-xs text-gray-400 py-4 text-center">Hujaunganishwa na shule yoyote bado.</p>
              ) : (
                <div className="space-y-3">
                  {profile.schools.map((sch) => (
                    <div
                      key={sch.schoolUId}
                      className="p-4 bg-gray-50/50 border border-gray-200/80 rounded-xl flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 font-bold flex items-center justify-center shrink-0 text-sm">
                          {sch.name[0]}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-900">{sch.name}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-gray-500 font-mono">{sch.schoolId}</span>
                            <span className="text-[10px] bg-blue-50 text-blue-600 font-medium px-1.5 py-0.2 rounded">
                              {sch.primaryRole.displayName}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded">
                          {sch.status}
                        </span>
                        <p className="text-[10px] text-gray-400 mt-1">Staff #: {sch.staffNumber}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SAVE BUTTON */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Inahifadhi...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Hifadhi Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}