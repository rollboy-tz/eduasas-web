"use client";
import { useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { AddInvitationForm } from "./invitations/add-invitation-form";
import { EduMainModal } from "@/components/elements";
import { StaffListView } from "./member/staff-list-view";
import { useSchoolStaffInvitations } from "@/hooks/school";
import { StaffInvitationsListView } from "./invitations/school-invitations-list-view";
import { AnimatePresence, motion } from "framer-motion";
import { useSchoolContext } from "@/providers";

export default function SatffPageView() {
  const [formOpen, setFormOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { school } = useSchoolContext();
  const slug = school!.slug;
  
  // Default ni 'staff' kama hakuna param
  const activeView = searchParams.get("v") || "members";

  useEffect(() => {
    if (!activeView) {
      router.replace(`/s/${slug}/staff?v=members`, { scroll: false });
    }
  }, [searchParams, router]);

  // 2. Hii ni function ya kubadilisha view (Event driven)
  const handleViewChange = (view: "members" | "invitations") => {
    router.push(`/s/${slug}/staff?v=${view}`, { scroll: false });
  };

  // Hook data kutoka kwenye logic yako
  const { sendInvitation } = useSchoolStaffInvitations();

  // Helper ya kupata idadi
  return (
    <div className="w-full h-full flex flex-col bg-background p-4 md:p-8">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold tracking-tighter text-foreground">
            {activeView === "staff" ? "Staff Members" : "Staff Invitations"}
          </h1>
          <p className="text-sm text-muted-foreground max-w-md">
            {activeView === "staff"
              ? "Manage academic staff access and team roles."
              : "Monitor pending invitations and resend access links."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const newView = activeView === "members" ? "invitations" : "members";
              handleViewChange(newView);
            }}
            className="text-sm font-semibold px-4 h-10 rounded-full bg-ring text-primary-foreground shadow-sm hover:bg-muted/20 transition-all duration-300"
          >
            {activeView === "staff" ? "View Invitations" : "Staff Members"}
          </button>

          <button
            onClick={() => setFormOpen(true)}
            className="flex items-center gap-2 px-4 h-10 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary/70 transition-all duration-300 shadow-sm"
          >
            <UserPlus size={18} strokeWidth={3} />
            New Invite
          </button>
        </div>
      </header>

      {/* Content Layer */}
      <section className="flex-1">
        <AnimatePresence mode="wait">
          {activeView === "members" ? (
            <motion.div
              key="members"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <StaffListView />
            </motion.div>
          ) : (
            <motion.div
              key="invitations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <StaffInvitationsListView />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Modal - Imefungwa vizuri na AddInvitationForm */}
      <EduMainModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title="Send Staff Invitation"
        size="md"
        className="rounded-2xl"
      >
        <AddInvitationForm
          sendInvitation={sendInvitation}
          onSucess={() => setFormOpen(false)}
        />
      </EduMainModal>
    </div>
  );
}