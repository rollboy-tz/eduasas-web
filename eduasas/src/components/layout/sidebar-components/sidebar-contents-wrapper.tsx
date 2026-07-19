// path: src/components/layout/sidebar-components/sidebar-wrapper.tsx
export function SidebarWrapper({ children }: { children: React.ReactNode }) {
    return (
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-1 custom-scrollbar w-full">
            <div className="flex flex-col gap-1">
                {children}
            </div>
        </nav>
    )
}