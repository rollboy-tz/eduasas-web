
import { Metadata } from "next";
import { Suspense } from "react";
import { ClassesPageView } from "./_components";

export const metadata: Metadata = {
  title: "Classes Management",
  description: "Manage school classes, organize academic levels, and configure class structures within your workspace.",
};

export default function ClassesPage() {
  return (
    <Suspense>
      <ClassesPageView />
    </Suspense>
  );
}