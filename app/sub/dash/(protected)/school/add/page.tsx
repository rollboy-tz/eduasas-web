import { Metadata } from "next";
import { EduScreenLoader } from "@/components/ui";
import { EduServerButton } from "@/components/elements";
import Image from "next/image";
import { Suspense } from "react";
import { AddSchoolForm } from "./_components";

export const metadata: Metadata = {
  title: "Add School",
  description: "Add your school to EduAsas platform and start managing it easily.",
  // Page hii ipo nyuma ya auth (protected route) - haipaswi kamwe
  // kuonekana kwenye search results za umma. `noindex` inazuia Google
  // (na search engines nyingine) kuihifadhi kwenye index yao;
  // `nofollow` inazuia kufuata links zozote ndani yake kwa madhumuni ya
  // crawling. Hii ndiyo "SEO" sahihi kwa dashboard pages - kuzificha
  // kimakusudi, si kuziongezea marketing metadata (OG/Twitter) ambayo
  // ni kwa content ya umma inayotarajiwa kushirikiwa.
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

export default function AddSchoolPage() {
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
            bg-white/70
            rounded-xl
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
              <h3 className="font-black tracking-tight text-lg sm:text-xl truncate">Add School</h3>
            </div>

            <EduServerButton className="shrink-0 rounded-full h-10 w-10 bg-card hover:bg-primary/50 hover:shadow-lg transition-all duration-300 text-[var(--main-tex)]" />
          </div>

          <div className="w-full flex flex-col items-center">
            <AddSchoolForm showSuccessModal={true} />
          </div>
        </div>
      </main>
    </Suspense>
  );
}