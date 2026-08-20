// app/(dashboard)/layout.tsx
import { sidebarMockData } from "@/data/sidebar.mock";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";

export default function DashWorkspaceLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <WorkspaceLayout
      menuData={sidebarMockData}
      inContext={false}
    >
      {children}
    </WorkspaceLayout>

  );
}