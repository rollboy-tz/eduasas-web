import { OverviewPageConents } from "@/components/pages/dash/overview";
import { EduScreenLoader } from "@/components/ui";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Dashboard Overview",
};

export default function DashOverViewPage() {

  return (
    <Suspense fallback={<EduScreenLoader/>}>
      <OverviewPageConents />
    </Suspense>
  );
}