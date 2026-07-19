"use client";

import { useEffect } from "react";
import { AlertOctagon, RefreshCcw, Terminal } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error kwenda kwenye dashboard ya monitoring
    console.error("CRITICAL_ROOT_FAILURE:", error);
  }, [error]);

  // 🔄 ENGINE YA HARD RECOVERY (Salama kwa URL Params zote za EduAsas)
  const handleSystemRecovery = () => {
    try {
      // 1. Jaribu njia ya Next.js ya Reset kwanza ikiwa ipo hai
      if (reset && typeof reset === "function") {
        reset();
        return;
      }
    } catch (e) {
      console.warn("Next.js soft reset failed, bypassing to hard core recovery...", e);
    }

    // 2. BACKUP PLAN: Hard Reload ya chuma bila kupoteza data za URL
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("reboot_t", new Date().getTime().toString());
      window.location.replace(url.toString());
    }
  };

  return (
    <html lang="en">
      {/* Hakikisha umeweka rangi na mitindo ya giza kwa usahihi kwa sababu globals.css inaweza isipakizwe layout ikila fail */}
      <body className="bg-[#1C1C1D] text-[#E4E6EA] flex items-center justify-center min-h-screen font-mono p-4 antialiased selection:bg-red-500/20">
        <div className="relative w-full max-w-2xl overflow-hidden border border-[#222222] bg-[#252728] rounded-lg shadow-2xl">
          
          {/* Top Bar - Recovery Header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-red-500/20 bg-red-500/5">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-red-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
                System Kernel Panic
              </span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500/20" />
              <div className="w-2 h-2 rounded-full bg-red-500/40 animate-pulse" />
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Icon Section */}
              <div className="relative shrink-0">
                <div className="absolute inset-0 blur-2xl bg-red-500/20" />
                <div className="relative p-5 bg-red-500/10 border border-red-500/20 rounded-2xl">
                  <AlertOctagon size={48} className="text-red-500" />
                </div>
              </div>

              {/* Text Section */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">
                  Fatal Execution Error
                </h1>
                <p className="text-xs text-gray-400 leading-relaxed mb-6 font-medium">
                  The application encountered a level-0 exception in the root layout. 
                  Automatic recovery failed. Manual reboot required to restore system integrity.
                </p>

                {/* Error Log Preview */}
                <div className="mb-8 p-4 bg-black/40 border border-white/5 rounded-xl text-left">
                  <div className="text-[9px] text-gray-500 uppercase font-black mb-2 tracking-widest">Diagnostic Info:</div>
                  <code className="text-[10px] text-red-400/80 break-all leading-tight block">
                    ID: {error?.digest || "ERR_UNKNOWN_CORE_FAILURE"} <br />
                    MSG: {error?.message || "Root thread terminated unexpectedly."}
                  </code>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleSystemRecovery}
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black uppercase transition-all active:scale-95 cursor-pointer shadow-lg shadow-red-600/10"
                  >
                    <RefreshCcw size={14} className="animate-spin-[duration:4s]" /> Attempt Cold Reboot
                  </button>
                  <button
                    onClick={() => {
                      if (typeof window !== "undefined") window.location.href = "/";
                    }}
                    className="flex items-center justify-center px-8 py-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl text-[10px] font-black uppercase border border-white/5 transition-all cursor-pointer"
                  >
                    Return to Safe Mode
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Background Decorative Element */}
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-red-500/5 rounded-full blur-3xl" />
        </div>
      </body>
    </html>
  );
}