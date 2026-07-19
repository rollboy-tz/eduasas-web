"use client";
import { useState } from "react";
import {
  EduMainLoader,
  EduMainModal,
  EduActionModal,
  EduProgressBar,
  EduStatusBox
} from "@/components/elements/";

export default function TestPage() {
  // States za Main Modal (Kubwa kwa ajili ya Forms)
  const [showMain, setShowMain] = useState(false);
  const [mainLoading, setMainLoading] = useState(false);

  // States za Action Modal (Contextual Modals)
  const [actionType, setActionType] = useState<"info" | "error" | "success" | "warning" | "attention">("info");
  const [showAction, setShowAction] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Kufungua Action Modal kwa Variant maalum
  const openAction = (variant: typeof actionType) => {
    setActionType(variant);
    setShowAction(true);
  };

  const handleMainSave = () => {
    setMainLoading(true);
    setTimeout(() => {
      setMainLoading(false);
      setShowMain(false);
    }, 4000);
  };

  const handleActionConfirm = () => {
    setActionLoading(true);
    setTimeout(() => {
      setActionLoading(false);
      setShowAction(false);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-background p-10 flex flex-col items-center justify-center gap-12">

      {/* 1. SECTION: MAIN FORM MODAL */}
      <div className="flex flex-col items-center gap-4">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Form Containers</span>
        <button
          onClick={() => setShowMain(true)}
          className="px-10 py-5 bg-white text-black font-black uppercase italic rounded-2xl shadow-2xl hover:scale-105 transition-all border-b-4 border-slate-300 active:border-b-0 active:translate-y-1"
        >
          Open Registration Form
        </button>
      </div>

      / Ndani ya return ya TestPage yako:
      <div className="flex flex-col items-center gap-6 p-10 bg-[var(--panel)] rounded-3xl border border-[var(--card-border)]">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">System Status Badges</span>

        <div className="space-y-10 p-10">
  
  {/* 1. SEHEMU YA BADGES (Zile ndogo kwa ajili ya Table/List) */}
  <div className="flex flex-col items-center gap-4">
    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Status Badges</span>
    <div className="flex flex-wrap justify-center gap-4">
      <EduStatusBox variant="success">Completed</EduStatusBox>
      <EduStatusBox variant="error">Payment Failed</EduStatusBox>
      <EduStatusBox variant="warning">Pending Review</EduStatusBox>
      <EduStatusBox variant="info">System Update</EduStatusBox>
      <EduStatusBox variant="attention">High Priority</EduStatusBox>
      <EduStatusBox variant="default">Draft Mode</EduStatusBox>
    </div>
  </div>

  {/* 2. SEHEMU YA STATUS MESSAGES (Zile kubwa kwa ajili ya Alerts/Forms) */}
  <div className="flex flex-col items-center gap-4 w-full max-w-2xl mx-auto">
    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Status Messages</span>
    <div className="space-y-3 w-full">
      <EduStatusBox 
        variant="success" 
        title="Malipo Yamepokelewa" 
        description="Shilingi 500,000 imethibitishwa kwenye mfumo wa EduAsas." 
      />
      <EduStatusBox 
        variant="error" 
        title="Hitilafu ya Usajili" 
        description="Namba ya kitambulisho uliyoweka tayari inatumika na mwanafunzi mwingine." 
      />
      <EduStatusBox 
        variant="attention" 
        title="Taarifa Muhimu" 
        description="Tafadhali kamilisha fomu ya bima ya afya kabla ya tarehe 15 mwezi huu." 
      />
    </div>
  </div>

</div>
      </div>

      {/* 2. SECTION: ACTION MODALS (VARIANTS) */}
      <div className="flex flex-col items-center gap-6 w-full max-w-4xl">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Action Variants & Watermarks</span>
        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={() => openAction("error")} className="px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-500 font-bold uppercase text-[10px] rounded-lg hover:bg-red-500 hover:text-white transition-all">Test Error</button>
          <button onClick={() => openAction("success")} className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold uppercase text-[10px] rounded-lg hover:bg-emerald-500 hover:text-white transition-all">Test Success</button>
          <button onClick={() => openAction("warning")} className="px-6 py-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 font-bold uppercase text-[10px] rounded-lg hover:bg-amber-500 hover:text-white transition-all">Test Warning</button>
          <button onClick={() => openAction("attention")} className="px-6 py-3 bg-primary bg-opacity-10 border border-primary border-opacity-20 text-primary font-bold uppercase text-[10px] rounded-lg hover:bg-primary hover:text-black transition-all">Test Attention</button>
        </div>
      </div>

      {/* ==========================================
          EDU MAIN MODAL (The Stable Form)
          ========================================== */}
      <EduMainModal
        isOpen={showMain}
        onClose={() => setShowMain(false)}
        isLoading={mainLoading}
        size="lg"
      >
        <div className="space-y-8">
          <div className="relative z-10">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">New Faculty</h2>
            <p className="text-[10px] text-muted uppercase tracking-[0.4em] font-bold">Academic Structure v2.0</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="h-16 w-full bg-[var(--panel)] border border-[var(--card-border)] rounded-xl flex flex-col justify-center px-6">
              <span className="text-[8px] uppercase font-black text-slate-500 tracking-widest">Faculty Name</span>
              <span className="text-xs font-bold">School of Engineering</span>
            </div>
            <div className="h-16 w-full bg-[var(--panel)] border border-[var(--card-border)] rounded-xl flex flex-col justify-center px-6">
              <span className="text-[8px] uppercase font-black text-slate-500 tracking-widest">Dean Identifier</span>
              <span className="text-xs font-bold">ENG-DEAN-001</span>
            </div>
            <div className="col-span-2">
              <EduProgressBar progress={mainLoading ? 90 : 35} label="Processing Form Data" percentPosition="top-end" />
            </div>
          </div>

          <div className="flex justify-end gap-6 items-center pt-4">
            <button disabled={mainLoading} onClick={() => setShowMain(false)} className="text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors">Abort</button>
            <button
              onClick={handleMainSave}
              disabled={mainLoading}
              className="px-12 py-4 bg-white text-black text-xs font-black uppercase italic rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95 transition-all"
            >
              {mainLoading ? "Saving..." : "Confirm & Save"}
            </button>
          </div>
        </div>
      </EduMainModal>

      {/* ==========================================
          EDU ACTION MODAL (The Dynamic Contextual)
          ========================================== */}
      <EduActionModal
        isOpen={showAction}
        onClose={() => setShowAction(false)}
        variant={actionType}
        title={actionType === "error" ? "System Violation" : "Action Required"}
        size="sm"
      >
        <div className="space-y-8">
          {actionLoading ? (
            <div className="py-10 flex flex-col items-center">
              <EduMainLoader size={40} loadingText="Finalizing Action..." />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-5 bg-white/5 border border-white/5 rounded-2xl">
                <p className="text-xs leading-relaxed text-slate-300 font-medium">
                  This is an automated request. Please confirm if you wish to proceed with the <span className="text-white font-bold">{actionType}</span> operation.
                  This process will be logged under the current administrative session.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleActionConfirm}
                  className="w-full py-4 bg-white text-black text-[10px] font-black uppercase italic rounded-xl hover:bg-opacity-90 transition-all"
                >
                  Yes, Execute Operation
                </button>
                <button
                  onClick={() => setShowAction(false)}
                  className="w-full py-3 text-[10px] font-bold uppercase text-slate-500 hover:text-white"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>
      </EduActionModal>

    </main>
  );
}