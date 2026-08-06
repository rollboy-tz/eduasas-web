// app/(dashboard)/layout.tsx
import { SidebarProvider } from "@/components/layout/SideBarV2";
import { SearchProvider } from "@/context/search-context";
import { GlobalSearch } from "@/components/ui/global-search";
import MobileProfilePanel from "@/components/layout/profilepanel/mobile-profilepanel";
import { Header } from "@/components/layout/HeaderV2";
import { SidebarLayout } from "@/components/layout/SideBarV2/ui";
import { sidebarMockData } from "@/data/sidebar.mock";

export default function DashWorkspaceLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SearchProvider>
        {/* Global Search Dialog Modal */}
        <GlobalSearch />
          <div className="flex flex-1 flex-col overflow-hidden">
            <SidebarLayout data={sidebarMockData} header={<Header />}>
              {children}
            </SidebarLayout>
          </div>
      </SearchProvider>
    </SidebarProvider>
  );
}