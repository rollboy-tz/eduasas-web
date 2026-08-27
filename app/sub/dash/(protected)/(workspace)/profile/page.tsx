import { ProfilePageContents } from "@/components/pages/dash/profile";
import { EduScreenLoader } from "@/components/ui";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your profile settings and preferences.",
};

export default function ProfilePage() {
  return(
    <Suspense fallback={<EduScreenLoader />}>
      <ProfilePageContents />
    </Suspense>
  )
}