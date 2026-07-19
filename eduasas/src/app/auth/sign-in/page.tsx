import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/forms";
import { EduScreenLoader } from "@/components/elements";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to EduAsas Management System. Enter your credentials to access the industrial-grade school dashboard.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">

      {/* 2. CONTENT WRAPPER */}
      <div className="relative z-10 w-full flex flex-col items-center">
        
        <Suspense  fallback={ <EduScreenLoader /> } >
          {/* Wrap inside a stable container */}
          <div className="w-full flex justify-center items-center">
            <LoginForm />
          </div>
        </Suspense>

        {/* FOOTER INFO - Optional spacer to keep balance */}
        <div className="mt-8 h-4 opacity-0 pointer-events-none">
          EduAsas v1.0
        </div>
      </div>
    </div>
  );
}