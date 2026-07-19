// src/components/pages/invitations/invitations-page.tsx

'use client'
import { useState } from "react";
import { myInvitations } from "@/test/my-invitantions";
import { useUserStaffInvitations } from "@/hooks/users";
import { capitalize } from "@/lib/utils/string-utils";
import { useRouter } from "next/navigation";
import { MailOpen, Archive } from "lucide-react";
import { InvitationsList } from "./my-invitation-list";

interface FilterProps {
  status?: "PENDING" | "JOINED" | "EXPIRED" | "DECLINED" | "ALL";
}

export function MyInvitationsPage() {
  const [currentStatus, setCurrentStatus] = useState<FilterProps["status"]>("ALL");
  const [showArchived, setShowArchived] = useState(false);
  const { 
    invitations, 
    isLoading, 
    acceptInvitation, 
    declineInvitation, 
    archiveInvitation,
     unarchiveInvitation
     } = useUserStaffInvitations();
  //const invitations = myInvitations || [];
  const router = useRouter();

  // LOGIC YA KUCHUJA (THE ENGINE)
  const displayData = (() => {
    // 1. Kama tuko kwenye Archive Mode, chukua zenye archived: true pekee
    if (showArchived) {
      return invitations.filter(inv => inv.archived);
    }

    // 2. Kama tuko kwenye Active Mode, chukua zenye archived: false pekee
    const active = invitations.filter(inv => !inv.archived);

    // 3. Kisha chuja kwa Status (ALL, PENDING, etc.)
    return active.filter(inv =>
      currentStatus === "ALL" ? true : inv.status === currentStatus
    );
  })();

  const EmptyArchive = () => {
    return (
      <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-border rounded-[2rem] bg-card/10">
        <div className="p-5 rounded-2xl bg-primary/5 mb-4 text-primary/80">
          <Archive className="w-12 h-12" />
        </div>
        <h3 className="text-xl font-medium text-foreground">No Arhived invitations</h3>
        <p className="text-muted text-sm max-w-[320px] text-center mt-2">
          Here you will find your archived invitations. You can either Un-archive them when available.
        </p>
      </div>
    )
  }

  /**
   * Component ya kuonyesha hali tupu (Empty State)
   */
  const NoInvitations = ({ status = "ALL" }: FilterProps) => {
    let msg = "No invitation found here!.";
    switch (status) {
      case "PENDING": msg = "No pending invitations"; break;
      case "JOINED": msg = "No joined invitations"; break;
      case "EXPIRED": msg = "No expired invitations"; break;
      case "DECLINED": msg = "No declined invitations"; break;
      default: msg = "Your invitation inbox is empty";
    }

    return (
      <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-border rounded-[2rem] bg-card/10">
        <div className="p-5 rounded-2xl bg-primary/5 mb-4 text-primary/80">
          <MailOpen className="w-12 h-12" />
        </div>
        <h3 className="text-xl font-medium text-foreground">{msg}</h3>
        <p className="text-muted text-sm max-w-[320px] text-center mt-2">
          Your {status === "ALL" ? "" : capitalize(status.toLowerCase())} invitations will appear here when available.
        </p>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-background px-2 md:px-8">
      {/* 1. COMPACT STICKY HEADER */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6">

          {/* Top Section: Title & Actions */}
          <div className="py-5 flex flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-primary rounded-full" />
              <h1 className="text-2xl font-black tracking-tight text-foreground">
                {showArchived ? "Archived Items" : "Invitations"}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="bg-foreground text-background text-xs font-bold px-5 py-2 rounded-full hover:opacity-90 transition-all"
                onClick={() => router.push("/help")}
              >
                Learn More
              </button>

              {/* TOGGLE BUTTON - Ikibonyezwa inabadili rangi kidogo kuonyesha Active State */}
              <button
                onClick={() => setShowArchived(!showArchived)}
                className={`p-2 rounded-full transition-all ${showArchived
                    ? "bg-primary text-primary-foreground shadow-neon" // Neon shadow uliyoiweka kwenye config
                    : "hover:bg-secondary text-muted-foreground"
                  }`}
              >
                <Archive className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* DYNAMIC TABS AREA */}
          <div className="flex items-center gap-1 overflow-x-auto pb-3 no-scrollbar transition-all duration-300">
            {!showArchived ? (
              ["ALL", "PENDING", "JOINED", "EXPIRED", "DECLINED"].map((status) => (
                <button
                  key={status}
                  onClick={() => setCurrentStatus(status as any)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${currentStatus === status ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {status === "ALL" ? "All" : capitalize(status.toLowerCase())}
                </button>
              ))
            ) : (
              <div className="flex items-center gap-2 px-1">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-secondary text-secondary-foreground">
                  Viewing Archived Records
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT - Adjusted Padding */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="relative">
          {displayData.length > 0 ? (
            <div className="flex flex-col gap-4">
              {/* Tunapitisha 'displayData' iliyochujwa tayari */}
              <InvitationsList
                handleAccept={(id, token) => acceptInvitation(id, token)}
                handleDecline={(id, token) => declineInvitation(id, token)}
                handleArchive={(id) => archiveInvitation(id)}
                handleUnArchive={(id) => unarchiveInvitation(id)}
               invitations={displayData} 
               />
            </div>
          ) : (
            /* DYNAMIC EMPTY STATE */
            showArchived ? <EmptyArchive /> : <NoInvitations status={currentStatus} />
          )}
        </div>
      </main>
    </div>
  );
}