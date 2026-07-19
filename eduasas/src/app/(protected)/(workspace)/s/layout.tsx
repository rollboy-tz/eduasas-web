// app/(school)/s/layout.tsx
import { Metadata } from "next";
import { ReactNode } from "react";


export const metadata: Metadata = {
  title: "Switch School",
  description: "Switch Access to your school which one already added in EduAsas.",
}

/**
 * Hii Layout ni "Global Shell" kwa ajili ya Workspace zote.
 * Hapa hatuweki Sidebar kwa sababu bado hatujajua shule ni ipi.
 * Kazi yake ni kutoa mazingira safi ya switching na loading.
 */

export default function GlobalSchoolLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full bg-background antialiased">
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}