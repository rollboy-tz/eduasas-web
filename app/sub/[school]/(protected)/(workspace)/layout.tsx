// app/(dashboard)/layout.tsx
'use client'
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { EduScreenLoader } from "@/components/ui";
import { useMenuData } from "@/hooks/layout/use-sidebar-data";

export default function DashWorkspaceLayout({ children } : {
  
  children: React.ReactNode }) {
    const { menuGroups, isLoading } = useMenuData("school", 'id')

    if(isLoading) return(
      <EduScreenLoader loadingText="Loading workspace data"/>
    )
  return (
    <WorkspaceLayout
      menuData={menuGroups}
      inContext
    >
      {children}
    </WorkspaceLayout>

  );
}