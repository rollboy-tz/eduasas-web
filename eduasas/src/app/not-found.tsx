"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MoveLeft, Compass, LifeBuoy, AlertTriangle, ExternalLink } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background text-foreground overflow-hidden px-6 font-sans">

      {/* 1. Industrial Background Grid - Inatumia --grid-color kutoka globals.css */}
      <div
        className="absolute inset-0 z-0 pointer-events-none bg-grid"
        style={{
          backgroundImage: `linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* 2. Aura Effect - Sasa inatumia --aura-color (Semantic Primary Glow) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-aura blur-[100px] rounded-full -z-10" />

      <div className="flex flex-col items-center max-w-lg w-full space-y-10 z-10 animate-in fade-in zoom-in duration-500">

        {/* 3. Visual Indicator */}
        <div className="relative">
          {/* Aura ndogo nyuma ya icon */}
          <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
          <div className="relative w-20 h-20 bg-card border border-border rounded-[var(--radius)] flex items-center justify-center shadow-xl shadow-primary/5">
            <Compass className="h-10 w-10 text-primary animate-[spin_15s_linear_infinite]" />
            <div className="absolute -top-1 -right-1">
              {/* Alert icon inatumia --destructive semantic color */}
              <AlertTriangle size={16} className="text-destructive fill-destructive/20" />
            </div>
          </div>
        </div>

        {/* 4. Typography */}
        <div className="space-y-2 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="h-[1px] w-8 bg-border"></span>
            {/* Font Mono kwa ajili ya Error Code (Technical feel) */}
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-muted-foreground">
              Error Code: 404
            </span>
            <span className="h-[1px] w-8 bg-border"></span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase">
            Page Not Found
          </h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-[340px] mx-auto font-medium">
            The requested module is unavailable or has been moved to a restricted directory.
          </p>
        </div>

        {/* 5. Production-Ready Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-sm">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="h-12 border-border hover:bg-muted text-foreground font-bold rounded-full transition-all active:scale-[0.98] font-medium cursor-pointer uppercase text-[12px] tracking-widest"
          >
            <MoveLeft className="mr-2 h-4 w-4" /> Go previous
          </Button>

          <Button
            asChild
            className="h-12 bg-primary hover:bg-primary/90 text-background font-bold rounded-full transition-all active:scale-[0.98] font-medium cursor-pointer uppercase text-[12px] tracking-widest"
          >
            <Link href="/">
              <ExternalLink  className="mr-2 h-4 w-4" /> Get Out
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className="h-12 sm:col-span-2 text-muted-foreground hover:text-primary font-bold uppercase text-[10px] tracking-widest cursor-pointer"
          >
            <Link href="/support" className="flex items-center gap-2">
              <LifeBuoy className="h-4 w-4" /> System support
            </Link>
          </Button>
        </div>
      </div>

      {/* 6. Footer Branding */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="h-6 w-[1px] bg-border"></div>
        <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-muted-foreground/50">
          EduAsas Infrastructure Management
        </p>
      </div>
    </div>
  );
}