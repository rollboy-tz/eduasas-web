import { Suspense } from "react";
import type { Metadata } from "next";
import { RegisterForm } from "@/components/forms";
import { EduScreenLoader } from "@/components/elements"; // Tuseme ipo hapa EduMainLoader


export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your EduAsas account to access the ultimate AI-driven school management ecosystem.",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* 1. BACKGROUND DECORATION - Sharp & Flat */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Subtle Glows - No shadows, just light gradients */}
        <div className="absolute -top-[10%] -left-[5%] w-[500px] h-[500px] bg-primary opacity-[0.02] blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[5%] w-[500px] h-[500px] bg-primary opacity-[0.02] blur-[120px] rounded-full" />
        
        {/* The Engineering Grid */}
        <div className="absolute inset-0 opacity-[0.01] [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      {/* 2. CONTENT WRAPPER */}
      <div className="relative z-10 w-full flex flex-col items-center">
        <Suspense 
          fallback={ <EduScreenLoader/> }
        >
          {/* Hapa nimei-wrap ndani ya div ili kuzuia jumps */}
          <div className="w-full flex justify-center items-center">
             <RegisterForm />
          </div>
        </Suspense>

        {/* 3. SUBTLE FOOTER (Placeholder) */}
        <div className="mt-12 h-6 w-full flex justify-center items-center opacity-20">
           {/* Hapa patabaki kuwa clean mpaka uamue kuweka footer */}
        </div>
      </div>
    </main>
  );
}