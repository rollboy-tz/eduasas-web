// app/(dashboard)/layout.tsx
import { SidebarProvider } from "@/context/sidebar-context";
import { SearchProvider } from "@/context/search-context";
import { GlobalSearch } from "@/components/ui/global-search";
import MobileProfilePanel from "@/components/layout/profilepanel/mobile-profilepanel";
import Header from "@/components/layout/topbar/header";
import Sidebar from "@/components/layout/sidebar/Sidebar";

export default function DashWorkspaceLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SearchProvider>
        {/* Global Search Dialog Modal */}
        <GlobalSearch />
        <MobileProfilePanel />

        <div className="flex h-screen overflow-hidden ">
          <Sidebar />

          <div className="flex flex-1 flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto px-2 sm:p-4">
              {children}
              {modal}
            </main>
          </div>
        </div>
      </SearchProvider>
    </SidebarProvider>
  );
}