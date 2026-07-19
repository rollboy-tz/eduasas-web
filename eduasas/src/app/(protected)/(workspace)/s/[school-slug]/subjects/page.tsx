import { Metadata } from "next";
import { Suspense } from "react";
import { EduScreenLoader } from "@/components/elements";
import { SubjectsPageView } from "@/components/pages/subjects";


// 1. Kuseti Metadata upande wa Server kwa ajili ya SEO na Browser Title
export const metadata: Metadata = {
  title: "Subjects | EduAsas",
  description: "Manage all school offared subjects inside your work space.",
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