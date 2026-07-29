// app/(dashboard)/layout.tsx
import Sidebar from "@/components/ui/sidebar";
import { SidebarProvider } from "@/contexts/sidebar-context";
import Header from "@/components/ui/header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <div className="flex h-screen overflow-hidden bg-gray-50">
                {/* 1. SIDEBAR: Nje ya main, inachukua urefu wote wa Screen */}
                <Sidebar />

                {/* 2. MAIN SECTION: Kulia mwa Sidebar */}
                <div className="flex flex-1 flex-col overflow-hidden">

                    {/* HEADER: Ndani ya Main, Fixed/Sticky Juu */}
                    <Header />

                    {/* PAGE CONTENT: Ndani ya Main, Inascroll peke yake */}
                    <main className="flex-1 overflow-y-auto custom-scrollbar p-6">
                        {children}
                    </main>

                </div>
            </div>
        </SidebarProvider>
    );
}