// app/dashboard/invitations/page.tsx
import { Metadata } from "next";
import { MyInvitationsPage } from "@/components/pages";

// 1. Metadata Configuration
export const metadata: Metadata = {
  title: " Staff Invitations",
  description: "Manage and respond to school staff invitations. The esier eay to join active school",
};

export default async function InvitationsPage() {
  return (<><MyInvitationsPage /></>);
}