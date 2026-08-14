'use client'

import { SidebarControl } from "./sidebar-control";
import { RightHeaderContents } from "./right-header-contents";

export const Header = () => {
    return(
        <div className="w-full flex items-cener justify-between py-2">
            {/* Rightside */}
            <div>
                <h3 className="font-bold text-sm">Schools</h3>
            </div>
            <RightHeaderContents />
        </div>
    )
}