// app/(dashboard)/layout.tsx
import { SidebarProvider } from "@/context/sidebar-context";
import { SearchProvider } from "@/context/search-context";
import { GlobalSearch } from "@/components/ui/global-search";
import MobileProfilePanel from "@/components/layout/profilepanel/mobile-profilepanel";
import Header from "@/components/layout/topbar/header";
import Sidebar from "@/components/layout/sidebar/Sidebar";
import { AuthProvider } from "@/providers";

export default function SchoolWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <SearchProvider>
          {/* Global Search Dialog Modal */}
          <GlobalSearch />
          <MobileProfilePanel />

          <div className="flex h-screen overflow-hidden bg-gray-50">
            <Sidebar />

            <div className="flex flex-1 flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                {children}
              </main>
            </div>
          </div>
        </SearchProvider>
      </SidebarProvider>
    </AuthProvider>
  );
}