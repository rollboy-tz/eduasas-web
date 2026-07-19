// src/components/mobile/mobile-profile-view.tsx
'use client'

import { UserAvatar } from "@/components/layout/user-profile/user-mobile-avatar";
import { 
  Settings, 
  ShieldCheck, 
  ChevronRight, 
  Mail, 
  Phone, 
  Lock,
  LogOut 
} from "lucide-react";
import { cn } from "@/lib/utils/helper";

export function MobileProfileView() {
  // Hapa baadaye tutafanya destructure ya 'user' kutoka kwenye Auth Hook yako
  const user = {
    name: "Injinia Rollboy",
    role: "Super Admin",
    email: "rollboy@eduasas.com",
    phone: "+255 700 000 000",
    workId: "ED-2026-09"
  };

  return (
    <div className="px-4 pb-10 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
      
      {/* 1. COMPACT USER CARD */}
      <div className="relative overflow-hidden p-5 rounded-[2rem] bg-gradient-to-br from-primary/[0.07] to-transparent border border-primary/10">
        <div className="flex items-center gap-4 relative z-10">
          <UserAvatar size="lg" className="h-16 w-16 rounded-2xl ring-2 ring-background shadow-md" />
          <div className="space-y-0.5">
            <h2 className="text-base font-black text-foreground tracking-tight">{user.name}</h2>
            <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest">{user.workId}</p>
            <div className="flex items-center gap-1.5 mt-1 bg-primary px-2 py-0.5 rounded-md w-fit">
               <ShieldCheck className="w-3 h-3 text-primary-foreground" />
               <span className="text-[9px] font-black text-primary-foreground uppercase tracking-tighter">
                {user.role}
               </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. QUICK INFO GRID */}
      <div className="grid grid-cols-2 gap-2">
         <div className="p-3 rounded-2xl bg-muted/30 border border-border/50 flex flex-col gap-1">
            <Mail className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground truncate">{user.email}</span>
         </div>
         <div className="p-3 rounded-2xl bg-muted/30 border border-border/50 flex flex-col gap-1">
            <Phone className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">{user.phone}</span>
         </div>
      </div>

      {/* 3. MENU SECTION */}
      <div className="space-y-1">
        <p className="px-3 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">
          Manage Account
        </p>
        
        <div className="bg-muted/20 rounded-[1.5rem] border border-border/40 divide-y divide-border/40 overflow-hidden">
          {[
            { icon: Lock, label: "Security", sub: "Password & 2FA", color: "text-blue-500" },
            { icon: Settings, label: "Settings", sub: "Language & Themes", color: "text-orange-500" },
          ].map((item, i) => (
            <button 
              key={i} 
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-xl bg-background border border-border shadow-sm", item.color)}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-foreground leading-none mb-1">{item.label}</p>
                  <p className="text-[10px] text-muted-foreground">{item.sub}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
            </button>
          ))}
        </div>
      </div>

      {/* 4. DANGER ZONE (Logout) */}
      <button 
        className="group w-full flex items-center justify-between p-4 rounded-2xl bg-destructive/[0.03] border border-destructive/10 hover:bg-destructive/5 transition-colors"
      >
        <div className="flex items-center gap-3">
           <div className="p-2 rounded-xl bg-background border border-destructive/20">
              <LogOut className="w-4 h-4 text-destructive" />
           </div>
           <span className="text-xs font-black uppercase tracking-widest text-destructive">Logout Account</span>
        </div>
        <div className="h-1.5 w-1.5 rounded-full bg-destructive/40 animate-pulse" />
      </button>

      {/* FOOTER VERSION */}
      <div className="text-center">
         <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">
            EduAsas v1.2.0 • 2026
         </p>
      </div>

    </div>
  );
}