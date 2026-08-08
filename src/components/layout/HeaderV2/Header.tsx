'use client'

import { SidebarControl } from "./sidebar-control";

export const Header = () => {
    return(
        <div className="w-full">
            <div className="w-full px-2 py-1 flex items-center">
                <SidebarControl />
            </div>
        </div>
    )
}