
import { ClassesContentsPage } from "@/components/pages/school";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Classes Management",
  description: "Manage school classes, organize academic levels, and configure class structures within your workspace.",
};

export default function ClassesPage() {
  return (
    <Suspense>
      <ClassesContentsPage />
    </Suspense>
  );
}