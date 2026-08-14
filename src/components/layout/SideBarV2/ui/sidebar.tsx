/**
 * ============================================================================
 * EduAsas Sidebar V2 - Sidebar Root
 * ============================================================================
 *
 * Main composition component ya Sidebar V2.
 *
 * Component hii ndiyo coordinator wa sidebar sections.
 *
 * Inaunganisha:
 *
 * - SidebarShell
 * - SidebarHeader
 * - SidebarNavigation
 * - SidebarFooter
 *
 *
 * Responsibilities:
 *
 * - Kuunda hierarchy ya Sidebar UI.
 * - Kuhakikisha sections ziko kwenye mpangilio sahihi.
 *
 *
 * Haitawali:
 *
 * - Sidebar state
 * - Responsive behavior
 * - Device rules
 * - Menu configuration
 * - Permissions
 *
 *
 * Hizo zinamilikiwa na:
 *
 * - SidebarProvider
 * - SidebarRules
 * - SidebarNavigation config
 *
 *
 * @version 2.0.0
 */


"use client";


import type {
  ReactNode,
} from "react";


import {
  SidebarShell,
} from "./sidebar-shell";


import {
  SidebarHeader,
} from "./sidebar-header";


import {
  SidebarNavigation,
} from "./sidebar-navigation";


// import {
//   SidebarFooter,
// } from "./sidebar-footer";
import { sidebarMenuMock } from "../sidebar-menu.mock";
import { SidebarOverlay } from "./sidebar-overlay";
import { SidebarComposer } from "./sidebar-composer";
import { SchoolMockSidebar } from "@/data/school-mock-links-data";
import { MenuGroup } from "@/types/layout";



/* ============================================================================
 * Props
 * ==========================================================================
 */


/**
 * Props za Sidebar root.
 */
export interface SidebarProps {


  /**
   * Optional custom content.
   *
   * Inaweza kutumika kuongeza sections
   * kabla au baada ya navigation.
   */
  children?: ReactNode;
  itemsData?: MenuGroup[];

}



/* ============================================================================
 * Component
 * ==========================================================================
 */


/**
 * Sidebar V2 Root Component.
 *
 * Hii ni composition layer pekee.
 *
 * @example
 *
 * ```tsx
 * <Sidebar />
 * ```
 */
export function Sidebar({

  children,
  itemsData

}: SidebarProps) {


  return (

    <>

      <SidebarOverlay />


      <SidebarShell>


        <div

          className="
                    flex
                    h-full
                    min-h-0
                    flex-col
                "

        >


          {/*

                    Top area:
                    - Logo
                    - Workspace identity
                    - Collapse button future

                */}

          <SidebarHeader />





          {/*

                    Main navigation:

                    - Scrollable
                    - Takes remaining space

                */}
          <SidebarNavigation>
            <SidebarComposer
              menuData={itemsData ?? SchoolMockSidebar}
              currentPath=""
            />
          </SidebarNavigation>







          {/*

                    Extension area:

                    Examples:
                    - Upgrade card
                    - Workspace switcher
                    - Extra actions

                */}

          {
            children && (

              <div
                className="
                                shrink-0
                            "
              >

                {children}

              </div>

            )
          }





          {/*

                    Bottom fixed area:

                    - Profile
                    - Account menu
                    - Settings

                */}

          {/* <SidebarFooter /> */}



        </div>


      </SidebarShell>

    </>

  );

}