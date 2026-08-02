import { Metadata } from "next";
import { EduScreenLoader } from "@/components/ui";
import { EduServerButton } from "@/components/elements";
import Image from "next/image";
import { Suspense } from "react";
import { AddSchoolForm } from "@/components/forms/school/add-school-form";

export const metadata: Metadata = {
  title: "Add School",
  description: "Add your school to EduAsas platform and start managing it easily.",
};

export default function AddSchoolPage() {
  return (
    <Suspense fallback={<EduScreenLoader />}>
      <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">

        {/* 2. THE MAIN CONTAINER - Responsive & Centered */}
        <div className="
          relative z-10
          w-full 
          max-w-4xl 
          min-w-[320px] 
          min-h-[70vh] 
          md:min-h-[500px] 
          bg-card 
          rounded-xl 
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
              <h3 className="font-black tracking-tight text-xl">Add School</h3>
            </div>

            {/* Back Button */}
            <EduServerButton
              className="rounded-full h-10 w-10 bg-card hover:bg-primary/50 hover:shadow-lg transition-all duration-300 text-[var(--main-tex)]"
            />
          </div>

          {/* 3. FORM LOADER & COMPONENT */}
          <div className="w-full flex flex-col items-center">
            <AddSchoolForm showSuccessModal={true} />
          </div>

        </div>
      </main>
    </Suspense>
  );
}