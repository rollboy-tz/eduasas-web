/**
 * ============================================================================
 * Sidebar V2 Test Layout
 * ============================================================================
 *
 * Layout ya kujaribu Sidebar V2.
 *
 * Inafanya:
 *
 * - Kufunga SidebarProvider
 * - Kuonyesha Sidebar component
 * - Kutengeneza main content area
 *
 * @version 2.0.0
 */

import type {
  ReactNode,
} from "react";


import {
  SidebarProvider,
} from "@/components/layout/SideBarV2";


import {
  SidebarLayout,
} from "@/components/layout/SideBarV2/ui";
import { sidebarMockData } from "@/data/sidebar.mock";



interface SidebarTestLayoutProps {

  children: ReactNode;

}



export default function SidebarTestLayout({
  children,
}: SidebarTestLayoutProps) {


  return (

    <SidebarProvider>

      <SidebarLayout data={sidebarMockData}>
        {children}

      </SidebarLayout>

    </SidebarProvider>

  );

}