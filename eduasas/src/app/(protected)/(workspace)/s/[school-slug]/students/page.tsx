import { Metadata } from "next";
import { Suspense } from "react";
import { EduScreenLoader } from "@/components/elements";
import { StudentsPageView } from "@/components/pages/students"


// 1. Kuseti Metadata upande wa Server kwa ajili ya SEO na Browser Title
export const metadata: Metadata = {
  title: "Students | EduAsas",
  description: "Esier manager school students & pupils inside your EduAsas workspace.",
};

// 2. Kulazimisha page iwe dynamic ili isilete ile error ya static paths tuliyoifuta
export const dynamic = "force-dynamic";

export default function StaffInvitationsPage() {
  return (
    <Suspense fallback={ <EduScreenLoader /> }>
      {/* 3. Vuta Client Component ya ndani inayofanya kazi zote */}
      <StudentsPageView  />
    </Suspense>
  );
}