import { SidebarProvider } from "@/components/layout/SideBarV2";
import type { MenuGroup } from "@/types/layout/sidebar-menu.types";
import { SearchProvider } from "@/context/search-context";
import { GlobalSearch } from "@/components/ui/global-search";
import { Header } from "@/components/layout/HeaderV2";
import { SidebarLayout } from "@/components/layout/SideBarV2/ui";
import ProfilePanel from "@/components/layout/ProfilePanel/ProfilePanel";
import { ProfilePanelProvider } from "./ProfilePanel";
import { WorkspaceProvider } from "@/providers";

interface WorkspaceLayoutProps {
    children: React.ReactNode;
    menuData: MenuGroup[];
    inContext?: boolean;
}

export const WorkspaceLayout = ({ children, menuData, inContext = false }: WorkspaceLayoutProps) => {
    return (
        <WorkspaceProvider>
            <SidebarProvider>
                <SearchProvider>
                    <ProfilePanelProvider>
                        <GlobalSearch />
                        <div className="flex flex-1 flex-col overflow-hidden relative">
                            <SidebarLayout data={menuData} header={<Header />}>
                                {children}
                            </SidebarLayout>

                            <ProfilePanel>
                                <div className="p-4 space-y-4">
                                    <h3 className="font-bold text-sm text-slate-800">Taarifa za Profaili</h3>
                                    <p className="text-xs text-slate-500">Weka vipengele au fomu zako hapa.</p>
                                </div>
                            </ProfilePanel>
                        </div>
                    </ProfilePanelProvider>
                </SearchProvider>
            </SidebarProvider>
        </WorkspaceProvider>
    );
}