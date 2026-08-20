import { Metadata } from "next";
import { Suspense } from "react";
import { SubjectsPageView } from "@/components/pages/subjects";
import { EduScreenLoader } from "@/components/ui";


// 1. Kuseti Metadata upande wa Server kwa ajili ya SEO na Browser Title
export const metadata: Metadata = {
  title: "Subjects",
  description: "Manage all school offered subjects inside your workspace.",
};

// 2. Kulazimisha page iwe dynamic ili isilete ile error ya static paths tuliyoifuta
export const dynamic = "force-dynamic";

export default function StaffInvitationsPage() {
  return (
    <Suspense fallback={ <EduScreenLoader /> }>
      {/* 3. Vuta Client Component ya ndani inayofanya kazi zote */}
      <SubjectsPageView />
    </Suspense>
  );
}