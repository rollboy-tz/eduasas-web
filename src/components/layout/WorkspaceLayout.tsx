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
                            <ProfilePanel />
                        </div>
                    </ProfilePanelProvider>
                </SearchProvider>
            </SidebarProvider>
        </WorkspaceProvider>
    );
}