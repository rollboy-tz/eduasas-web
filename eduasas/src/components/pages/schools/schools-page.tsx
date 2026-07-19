// src/components/pages/schools/schools-page.tsx
'use client'

import { useState } from "react"
import { useUser } from "@/hooks/users"
import { SchoolCard } from "./school-card"
import { Plus, LayoutDashboard, Settings2, School, Search, Info } from "lucide-react"
import { SchoolCardSkeleton } from "./school-skeleton"

export function MySchoolsPage() {
  const { schools, isLoading } = useUser();
  const [currentFilter, setCurrentFilter] = useState<"ALL" |"PENDING" | "ACTIVE" | "SUSPENDED" | "CLOSED">("ALL");

  // Logic ya kuchuja shule (Minimal Engine)
  const displaySchools = (schools || []).filter(school => {
    if (currentFilter === "ALL") return true;
    return school.status === currentFilter;
  });

  return (
    <div className="w-full min-h-screen bg-background">
      
      {/* 1. STICKY HEADER - Kufanana na Invitations Page */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          
          {/* Top Section: Title & Action */}
          <div className="py-6 flex flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
              <h1 className="text-2xl font-black tracking-tight text-foreground">
                My Schools
              </h1>
            </div>

            <button className="flex items-center justify-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-full text-[10px] font-black hover:opacity-90 transition-all active:scale-95 shadow-sm">
              <Plus className="w-3.5 h-3.5" />
              REGISTER SCHOOL
            </button>
          </div>

          {/* DYNAMIC TABS AREA - Inaleta muonekano ule ule wa invitations */}
          <div className="flex items-center gap-1 overflow-x-auto pb-3 no-scrollbar transition-all duration-300">
            {["ALL", "ACTIVE", "INACTIVE", "SUSPENDED", "CLOSED"].map((filter) => (
              <button
                key={filter}
                onClick={() => setCurrentFilter(filter as any)}
                className={`px-5 py-1.5 rounded-full text-[10px] font-black capitalize tracking-wider transition-all ${
                  currentFilter === filter 
                    ? "bg-secondary text-secondary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT - Flex Col kwa sababu shule ni chache */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col gap-6">

          {/* SCHOOLS LISTING */}
          <div className="mt-4 flex flex-col gap-4">
            {isLoading ? (
               /* Simple Loading Skeleton */
               [1, 2, 3].map(i => <SchoolCardSkeleton key={i} />)
            ) : displaySchools.length > 0 ? (
              displaySchools.map((school) => (
                <SchoolCard key={school.schoolUId} school={school} />
              ))
            ) : (
              /* DYNAMIC EMPTY STATE - Kufanana na Invitations */
              <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border/60 rounded-[2.5rem] bg-card/5">
                <div className="p-5 rounded-full bg-muted/20 mb-4">
                  <School className="w-10 h-10 text-muted-foreground/40" />
                </div>
                <h3 className="text-base font-black text-foreground uppercase tracking-widest">No {currentFilter !== "ALL" ? currentFilter : ""} Schools Found</h3>
                <p className="text-muted-foreground text-xs text-center mt-2 max-w-[280px] leading-relaxed">
                  You are not currently associated with any {currentFilter.toLowerCase()} institutions in this category.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 3. MINIMAL FOOTER TIPS - Imeratibiwa vizuri zaidi */}
        <footer className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-4 opacity-70 hover:opacity-100 transition-opacity">
          <div className="p-5 rounded-2xl border border-border/40 bg-card/20 flex gap-4 items-start">
            <LayoutDashboard className="w-4 h-4 text-primary mt-1" />
            <div className="space-y-1">
              <h4 className="text-[10px] font-black uppercase tracking-widest">Global Overview</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Need to register a new branch? Use the "Register" button above to start the institution setup wizard.
              </p>
            </div>
          </div>
          <div className="p-5 rounded-2xl border border-border/40 bg-card/20 flex gap-4 items-start">
            <Info className="w-4 h-4 text-primary mt-1" />
            <div className="space-y-1">
              <h4 className="text-[10px] font-black uppercase tracking-widest">Support Access</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                If a school you joined is missing, check your invitation inbox or contact the school administrator.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}