'use client'
// src/components/pages/schools/school-card.tsx

import { UserAffiliatedSchool } from "@/types/users";
import { useRouter } from 'next/navigation';
import { School, ArrowRight, ShieldCheck, Info } from "lucide-react";
import Link from "next/link";
import { CopyButton } from "@/components/buttons/copy-button";

export function SchoolCard({ school }: { school: UserAffiliatedSchool }) {
  const router = useRouter();
  
  let badgeClass = "";
  switch (school.status) {
    case "PENDING": badgeClass = "bg-amber-500/10 text-amber-600 border-amber-500/20"; break;
    case "ACTIVE": badgeClass = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"; break;
    case "SUSPENDED": badgeClass = "bg-red-500/10 text-red-600 border-red-500/20"; break;
    default: badgeClass = "bg-slate-500/10 text-slate-600 border-slate-500/20";
  }

  return (
    <div className="group w-full flex flex-col bg-card rounded transition overflow-hidden shadow-sm">
      
      {/* SEHEMU YA JUU: Main Info */}
      <div className="p-4 md:p-6 flex items-start gap-4">
        
        {/* School Logo - Minimal circular background */}
        <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-background flex items-center justify-center flex-shrink-0 border border-border/40">
          <School size={24} className="text-muted-foreground" />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-row md:items-center justify-between gap-4">
          
          {/* Left: School & Role Details */}
          <div className="flex flex-col items-start space-y-1">
            <h2 className="text-base md:text-lg font-black tracking-tight text-foreground uppercase truncate">
              {school.name}
            </h2>
            
            <div className="flex flex-col md:flex-row items-center gap-x-3 gap-y-1">
              {/* School ID with Copy */}
              <div className="flex items-center gap-1.5 ">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">School ID:</span>
                <span className="text-sm font-mono font-medium bg-background px-2 py-0.5 rounded border border-border/30">{school.schoolId}</span>
                <CopyButton content={school.schoolId} className="h-4 w-4 p-0 opacity-60 hover:opacity-100" />
              </div>

              {/* Designation */}
              <div className="flex items-center gap-1.5 text-muted-foreground/80">
                <ShieldCheck size={14} />
                <span>{school.designation ? "Designation: " : "Role: "}</span>
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  {school.designation || school.primaryRole.displayName}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Status & Staff Count */}
          <div className="flex items-center md:flex-col md:items-end gap-3 md:gap-1.5">
             <div className="flex flex-col items-end">
                <span className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-tighter ${badgeClass}`}>
                  {school.status}
                </span>
                <div className="hidden md:flex items-center gap-1 mt-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Staff: {school.staffNumber || '0'}</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* SEHEMU YA CHINI: Conditional Action Footer */}
      {/* Hii inatofautishwa na border-t ndogo */}
      {(school.status === "PENDING" || school.status === "ACTIVE") && (
        <div className="px-4 py-3 md:px-6 bg-muted/20 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Info size={14} className="text-primary-foreground flex-shrink-0" />
            <p className="text-[11px] md:text-xs font-medium">
              {school.status === "PENDING" 
                ? "Setup incomplete. Please configure academic years and terms." 
                : "Portal ready. Switch to this school to start managing academic records."}
              <Link href="/help/school-setup" className="ml-1 text-primary-foreground hover:underline font-bold">Learn more</Link>
            </p>
          </div>

          <button
            onClick={() => {
              const target = school.status === "PENDING" 
                ? `/school/setup?schoolId=${school.schoolId}` 
                : `/s?schoolId=${school.schoolId}`;
              router.push(target);
            }}
            className="w-auto flex whitespace-nowrap items-center justify-center gap-2 bg-primary hover:bg-primary/80 text-zinc-900 text-sm font-bold px-6 py-2.5 rounded transition-all active:scale-95"
          >
            {school.status === "PENDING" ? "Complete Setup" : "Start Working"}
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}