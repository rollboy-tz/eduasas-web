'use client'

import { SidebarControl } from "./sidebar-control";

export const Header = () => {
    return(
        <div className="w-full">
            <div className="w-full rounded-lg bg-white px-2 py-1 shadow-sm flex items-center">
                <SidebarControl />
            </div>
        </div>
    )
}