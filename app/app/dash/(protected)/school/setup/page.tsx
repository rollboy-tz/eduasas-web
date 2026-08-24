import { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { EduScreenLoader } from "@/components/ui";
import { SchoolSetupForm } from "./_components";
import { EduServerButton } from "@/components/elements";

export const metadata: Metadata = {
  title: "Setup School",
  description: "Initialize your school by adding academics year and Grading rules.",
  // Protected route (auth required) - haipaswi kuonekana kwenye search
  // results. Angalia maelezo kwenye AddSchoolPage kwa sababu kamili.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function SchoolSetupPage() {
  return (
    <Suspense fallback={<EduScreenLoader />}>
      <main className="min-h-screen flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
        <div
          className="
            relative z-10
            w-full
            max-w-4xl
            min-h-[70vh]
            md:min-h-[500px]
            bg-white/80
            rounded-lg
            flex flex-col items-center justify-center
            shadow-[0_20px_50px_rgba(0,0,0,0.1)]
            transition-all duration-300
          "
        >
          <div className="flex flex-row items-center justify-between gap-3 w-full p-3 sm:p-4">
            <div className="flex flex-row items-center justify-start gap-2 min-w-0">
              <Image
                src="/icons/logo-128.png"
                alt="EduAsas Logo"
                width={40}
                height={40}
                className="shrink-0"
              />
              <h3 className="font-black tracking-tight text-lg sm:text-xl truncate">School Set-up</h3>
            </div>

            {/*
              BUG ILIYOREKEBISHWA: `hover:bg-destructive/50` - rangi ya
              "destructive" (nyekundu, inaonyesha hatari/kufuta) kwenye
              kitufe cha kawaida cha "back" ni semantically vibaya - haitoi
              hatari yoyote. Imebadilishwa kuwa neutral, sawa na
              AddSchoolPage (`hover:bg-primary/50`).
            */}
            <EduServerButton className="shrink-0 rounded-full h-10 w-10 bg-card hover:bg-primary/50 hover:shadow-lg transition-all duration-300 text-foreground/80" />
          </div>

          <div className="w-full flex flex-col items-center">
            <SchoolSetupForm />
          </div>
        </div>
      </main>
    </Suspense>
  );
}