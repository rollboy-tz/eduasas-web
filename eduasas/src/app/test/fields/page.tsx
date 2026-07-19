"use client";

import React, { useState } from "react";
import {
  EduPhoneField,
  EduSmartField,
  EduIdField,
  EduDateField,
  EduEmailField
} from "@/components/inputs";
import { 
  Layers, 
  CheckCircle2,
  Sparkles,
  IdCard,
  ShieldAlert,
  User,
  Calendar,
  History,
  Timer
} from "lucide-react";

export default function TestFieldsPage() {
  const [formData, setFormData] = useState({
    dob: "",
    regDate: "",
    academicYear: "",
    startTime: ""
  });

  const subjects = [
    { id: 1, name: "Mathematics" },
    { id: 2, name: "Physics" },
    { id: 3, name: "Chemistry" }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 flex flex-col items-center">
      
      {/* HEADER: EDUASAS BRANDING */}
      <div className="w-full max-w-4xl mb-12 text-center space-y-4">
        <div className="inline-flex p-4 rounded-xl bg-primary/10 text-primary border border-primary/20">
          <Layers size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic">EduAsas Logic Lab v4.4</h1>
          <p className="text-[13px] text-muted font-semibold tracking-widest uppercase">
            ISO Date Processing • Timezone Detection • Masked Inputs
          </p>
        </div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* LEFT COLUMN: PERSONAL DATA (NEON) */}
        <div className="space-y-6 bg-[var(--card-bg)] p-8 rounded-xl border border-slate-500/20">
          <div className="border-b border-slate-500/10 pb-4 mb-6">
            <h2 className="text-primary font-black text-xs uppercase tracking-widest flex items-center gap-2">
              <ShieldAlert size={16} /> Student Identity (Neon)
            </h2>
            <p className="text-[11px] text-muted mt-1">Strict data entry for student personal records.</p>
          </div>

          <div className="space-y-6 bg-inherit">
             <EduIdField
                label="Student Registry ID"
                variant="neon"
                size="lg"
                icon={User}
                labelStrategy="floating"
                isRequired={true}
                placeholder="EAU-XXXXXX"
             />

             {/* TEST 1: FULL DATE (DOB) */}
             <EduDateField
                label="Date of Birth"
                mode="full"
                variant="neon"
                size="lg"
                
                isRequired={true}
                onChange={(iso: any) => console.log("DOB ISO:", iso)}
             />

             <EduSmartField
                label="Primary Subject"
                suggestions={subjects}
                suggestionKey="name"
                variant="neon"
                size="lg"
                labelStrategy="floating"
             />
          </div>
        </div>

        {/* RIGHT COLUMN: ADMINISTRATIVE DATA (FLAT) */}
        <div className="space-y-6 bg-[var(--card-bg)] p-8 rounded-xl border border-slate-500/20">
          <div className="border-b border-slate-500/10 pb-4 mb-6">
            <h2 className="text-foreground font-black text-xs uppercase tracking-widest flex items-center gap-2">
              <IdCard size={16} /> School Operations (Flat)
            </h2>
            <p className="text-[11px] text-muted mt-1">Management fields for academic tracking.</p>
          </div>

          <div className="space-y-6">
             {/* TEST 2: YEAR ONLY MODE */}
             <EduDateField
                label="Academic Year"
                mode="year"
                variant="flat"
                size="md"
                labelStrategy="fixed"
                placeholder="YYYY"
                icon={History}
             />

             {/* TEST 3: TIME ONLY MODE */}
             <EduDateField
                label="Session Start Time"
                mode="time"
                variant="flat"
                size="md"
                labelStrategy="floating"
                icon={Timer}
             />

             <div className="grid grid-cols-2 gap-4">
                <EduPhoneField
                   label="Emergency Contact"
                   variant="flat"
                   size="sm"
                   labelStrategy="none"
                   placeholder="Phone..."
                />
                <EduEmailField 
                   label="Parent Email" 
                   variant="flat" 
                   size="sm" 
                   labelStrategy="none" 
                   placeholder="Email..."
                />
             </div>

             <div className="pt-4">
                <button className="w-full h-12 bg-primary text-white rounded-md font-black text-[11px] uppercase tracking-[0.2em] hover:opacity-90 active:scale-[0.95] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                  <CheckCircle2 size={16} /> Save Record
                </button>
             </div>
          </div>
        </div>

      </div>

      {/* FOOTER SPECS */}
      <div className="w-full max-w-5xl mt-12 pt-8 border-t border-slate-500/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest">
           <div className="flex items-center gap-2 text-primary">
             <Calendar size={14}/> SYSTEM DATE: {new Date().toLocaleDateString()}
           </div>
           <div className="flex items-center gap-2 text-slate-500">
             <Sparkles size={14}/> GHOST AI: OPTIMIZED
           </div>
        </div>
        <p className="text-[11px] text-muted font-bold italic">
          EduAsas Logic Lab • Tanzania 🇹🇿
        </p>
      </div>
    </div>
  );
}