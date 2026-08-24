"use client";

import React, { useEffect } from "react";
import {
  Users,
  BookOpen,
  Layers,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  GraduationCap
} from "lucide-react";
import { useClassContext } from "../_components/ClassContext";
import { useWorkspace } from "@/providers";

export default function ClassOverviewPage() {
  const { classProfile } = useClassContext();
  const { setWorkspaceHeader } = useWorkspace();


  useEffect(() => {
    if (classProfile?.displayName) {
      document.title = `${classProfile.displayName} | EduAsas`;
    }
  }, [classProfile?.displayName]);

  useEffect(() => {
    if (classProfile?.displayName) {
      setWorkspaceHeader({ title: `${classProfile.displayName} - Dashboard` });
    }
  }, [setWorkspaceHeader]);

  if (!classProfile) return null;


  return (
    <div className="space-y-6">
      {/* Banner / Intro Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white via-slate-50/50 to-slate-100/30 p-6 shadow-sm">
        <div className="absolute right-0 top-0 -mr-6 -mt-6 h-32 w-32 rounded-full bg-primary-500/5 blur-2xl pointer-events-none" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-0.5 text-[11px] font-semibold text-primary-700 border border-primary-100">
              <Sparkles className="h-3 w-3" />
              <span>Academic Workspace</span>
            </div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              {classProfile.displayName} Dashboard
            </h2>
            <p className="text-xs font-normal text-slate-500 leading-relaxed max-w-xl">
              Overview of active sections, subject assignments, and student enrollment statistics for this class level.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200/80 shadow-xs">
              <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
              Code: <span className="font-mono text-slate-900">{classProfile.classCode}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Information / Quick Links Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Quick Management
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Class Operations</span>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href={`/classes/${classProfile.classCode}/sections`}
              className="group flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-white hover:border-slate-200 hover:shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <Layers className="h-4 w-4" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
              </div>
              <div className="mt-3">
                <p className="text-xs font-bold text-slate-800">Sections</p>
                <p className="text-[11px] text-slate-500">{classProfile.sectionsCount ?? 0} streams active</p>
              </div>
            </a>

            <a
              href={`/classes/${classProfile.classCode}/subjects`}
              className="group flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-white hover:border-slate-200 hover:shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <BookOpen className="h-4 w-4" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
              </div>
              <div className="mt-3">
                <p className="text-xs font-bold text-slate-800">Subjects</p>
                <p className="text-[11px] text-slate-500">{classProfile.subjectsCount ?? 0} assigned</p>
              </div>
            </a>

            <a
              href={`/classes/${classProfile.classCode}/students`}
              className="group flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-white hover:border-slate-200 hover:shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Users className="h-4 w-4" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
              </div>
              <div className="mt-3">
                <p className="text-xs font-bold text-slate-800">Students</p>
                <p className="text-[11px] text-slate-500">{classProfile.studentsCount ?? 0} registered</p>
              </div>
            </a>
          </div>
        </div>

        {/* Status Summary Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                System Health
              </h3>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Academic Status</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 text-[11px]">
                  Ready
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Category</span>
                <span className="font-bold text-slate-800 uppercase text-[11px]">
                  {classProfile.classCategory || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-slate-50 p-3 border border-slate-100 text-[11px] text-slate-500 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary-500 shrink-0" />
            <span>Class setup is fully configured and operational.</span>
          </div>
        </div>
      </div>
    </div>
  );
}