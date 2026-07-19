import { Metadata } from "next";
import { SchoolSetupForm } from "@/components/forms";
import { EduScreenLoader } from "@/components/elements";
import { EduServerButton } from "@/components/buttons";
import Image from "next/image";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Set-Up School",
  description: "Initialize your school by adding academics year and Grading rules.",
};

export default function AddSchoolPage() {
  return (
    <Suspense fallback={ <EduScreenLoader /> }>
    <main className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">

      {/* 1. BACKGROUND DECORATION - "Unyama Mode" */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Glow Effects */}
        <div className="absolute -top-[10%] -left-[5%] w-[500px] h-[500px] bg-primary opacity-[0.03] blur-[120px] rounded-full" />
        <div className="absolute bottom-[5%] right-[2%] w-[400px] h-[400px] bg-primary opacity-[0.02] blur-[100px] rounded-full" />

        {/* The Technical Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, var(--card-border) 1px, transparent 1px), linear-gradient(to bottom, var(--card-border) 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      {/* 2. THE MAIN CONTAINER - Responsive & Centered */}
      <div className="
          relative z-10
          w-full 
          max-w-4xl 
          min-w-[320px] 
          min-h-[70vh] 
          md:min-h-[500px] 
          bg-card
          rounded-lg 
          flex flex-col items-center justify-center 
          shadow-[0_20px_50px_rgba(0,0,0,0.1)]
          transition-all duration-300
        ">
        <div className="flex flex-row items-center justify-between gap-3 w-full p-3">
          {/* Blanding point */}
          <div className="flex flex-row items-center justify-start gap-1">
            {/* Logo yako */}
            <Image src="/icons/logo-128.png" alt="EduAsas Logo" width={40} height={40} />

            {/* Text yako */}
            <h3 className="font-black tracking-tight text-xl">School Set-up</h3>
          </div>

          {/* Back Button */}
          <EduServerButton 
          className="rounded-full h-10 w-10 bg-card hover:bg-destructive/50 hover:shadow-lg transition-all duration-300 text-foreground/80"
          />
        </div>

        {/* 3. FORM LOADER & COMPONENT */}
        <div className="w-full flex flex-col items-center">
          
            <SchoolSetupForm />
          
        </div>

      </div>
    </main>
    </Suspense>
  );
}