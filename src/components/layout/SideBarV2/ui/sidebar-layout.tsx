"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { useSidebar } from "../use-sidebar";
import {
    SIDEBAR_WIDTH,
    shouldPushContent,
} from "../sidebar-rules";

import { Sidebar } from "./sidebar";
import type { MenuGroup } from "@/types/layout/sidebar-menu.types";

export interface SidebarLayoutProps {
    data: MenuGroup[];
    header?: ReactNode;
    children: ReactNode;
}

export function SidebarLayout({
    data,
    header,
    children,
}: SidebarLayoutProps) {

    const {
        device,
        variant,
        size,
        isOpen,
    } = useSidebar();

    const shouldPush = shouldPushContent(
        device,
        size,
        variant,
    );

    const contentOffset = shouldPush && isOpen ? SIDEBAR_WIDTH[size] : 0;

    return (
        <div
            className="
                relative
                flex
                h-screen
                overflow-hidden
            "
        >
            <Sidebar itemsData={data} />

            <section
                className="flex min-w-0 px-2 sm:px-4 md:px-6 lg:px-8 flex-1 flex-col transition-[margin] duration-300 ease-out"
                style={{ marginLeft: contentOffset }}
            >
                {header && (
                    <header
                        className="
                            sticky
                            z-40
                            shrink-0
                            mb-1
                        "
                    >
                        {header}
                    </header>
                )}

                <main
                    className="
                        flex-1
                        overflow-y-auto
                        overflow-x-hidden
                    "
                >
                    {children}
                </main>
            </section>
        </div>
    );
}