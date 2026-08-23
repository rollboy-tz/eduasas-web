"use client";

import React, { Suspense, useState } from "react";
import {
  UserPlus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  GraduationCap,
  Users,
  CheckCircle2,
  XCircle,
  FileSpreadsheet
} from "lucide-react";
import { EduMainModal } from "@/components/modals";
import { EnrollStudentForm } from "@/components/forms/school/add-student-form";

// Component ya maudhui kuu ya Students Page
function StudentsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState("all");

  // Sample Data (Hazi zitavutwa kutoka kwenye API/Hook yako)
  const students = [
    {
      id: "1",
      name: "Baraka Juma",
      admissionNo: "STU-2026-001",
      gender: "Male",
      className: "Form Three",
      section: "Section A",
      status: "Active",
      guardianPhone: "+255 712 345 678",
    },
    {
      id: "2",
      name: "Aisha Hassan",
      admissionNo: "STU-2026-002",
      gender: "Female",
      className: "Form One",
      section: "Section B",
      status: "Active",
      guardianPhone: "+255 754 987 654",
    },
  ];

  return (
    <>
      <div className="space-y-6 p-1 sm:p-2">
        {/* 1. Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Student Directory
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage student records, enrollments, and academic profiles across all classes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              Export CSV
            </button>

            <button
              type="button"
              onClick={() => setFormOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-xs font-bold text-white hover:bg-primary-700 transition-all shadow-sm shadow-primary-500/20 active:scale-[0.98] cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              Enroll New Student
            </button>
          </div>
        </div>

        {/* 2. Filter & Search Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-2xs">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or admission no..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 border border-transparent focus:border-slate-300 focus:bg-white focus:outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-slate-300 focus:bg-white focus:outline-none transition-all"
            >
              <option value="all">All Classes</option>
              <option value="form-1">Form One</option>
              <option value="form-2">Form Two</option>
              <option value="form-3">Form Three</option>
              <option value="form-4">Form Four</option>
            </select>
          </div>
        </div>

        {/* 3. Students Data Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 border-b border-slate-100 uppercase tracking-wider text-[10px] font-bold text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">Student</th>
                  <th className="px-5 py-3.5">Admission No</th>
                  <th className="px-5 py-3.5">Class & Stream</th>
                  <th className="px-5 py-3.5">Guardian Phone</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-primary-700 font-bold text-xs border border-primary-100">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{student.name}</p>
                          <p className="text-[10px] text-slate-400">{student.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-700">
                      {student.admissionNo}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-800">{student.className}</span>
                        <span className="text-[10px] text-slate-400">({student.section})</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {student.guardianPhone}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-100">
                        <CheckCircle2 className="h-3 w-3" />
                        {student.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <EduMainModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        className="border-slate-100 p-1.5 rounded-lg max-w-sm"
      >
        <EnrollStudentForm />
      </EduMainModal>
    </>
  );
}

// Fallback loader ya Suspense
function StudentsLoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <p className="text-xs font-semibold text-slate-400 animate-pulse">
        Loading student directory...
      </p>
    </div>
  );
}

export default function StudentsPage() {
  return (
    <Suspense fallback={<StudentsLoadingFallback />}>
      <StudentsContent />
    </Suspense>
  );
}