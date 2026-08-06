'use client';

import React from 'react';
import { SidebarProvider } from '@/providers/SidebarContext';
import { SidebarV2 } from '@/components/layout/sidebar/SidebarV2';

function DashboardShell({ children }: { children: React.ReactNode }) {
  console.log("Side bar", SidebarV2)
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex w-full">
      {/* Sidebar Inakaa Moja kwa Moja kwenye Flex Container */}
      <div className="shrink-0 sticky top-0 h-screen z-50">
        <SidebarV2 />
      </div>

      {/* Page Content Inachukua Eneo Lote Lililobaki */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardShell>{children}</DashboardShell>
    </SidebarProvider>
  );
}