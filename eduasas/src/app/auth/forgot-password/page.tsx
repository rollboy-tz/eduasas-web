import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/forms";
import { Suspense } from "react";
import { EduScreenLoader } from "@/components/elements";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Recover your EduAsas account credentials, use your email adress or phone number to recover it.",
};

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decoration (Ule unyama wetu) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[5%] w-[500px] h-[500px] bg-primary opacity-[0.02] blur-[120px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.01] [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <div className="w-full max-w-[400px] min-h-[300px] bg-[var(--card-bg)] rounded-[var(--radius-lg)] flex flex-col items-center justify-center">
        <Suspense fallback={<EduScreenLoader />}>
          <ForgotPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}