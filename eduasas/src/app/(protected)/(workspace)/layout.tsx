// app/(dashboard)/layout.tsx
"use client"
import React from "react";
import { useAuth } from "@/providers";
import { EduScreenLoader } from "@/components/elements";
import { SchoolDataProvider, useSchoolData, useTenantInitializer } from "@/providers/context-provider";

export default function TerminalLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, sessionKey } = useAuth();
  const { isLoading: activeContextLoading } = useTenantInitializer(isAuthenticated, sessionKey);

  if (isLoading || activeContextLoading) return <EduScreenLoader />; // Zuia flash ya content

  if (!isAuthenticated) return null; // AuthProvider tayari itawasha Modal au Redirect

  return (<SchoolDataProvider>{children}</SchoolDataProvider>);
}