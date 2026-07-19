import { Metadata } from "next";
import { MySchoolsPage } from "@/components/pages";

export const metadata: Metadata = {
  title: "Schools",
  description: "Obtain and manage all your associated school.",
};

export default function SchoolsPage() {
  
  return (<MySchoolsPage />);
}