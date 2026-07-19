import { 
    SidebarGroup, 
    SidebarItem, 
    SidebarCollapsible 
} from "@/components/layout/sidebar-components";
import { SidebarDynamicIcon } from "./sidebar-dynamic-icon"; // Ile tuliyotengeneza juu

export interface MenuItem {
    title: string;
    href?: string;
    icon: string;
    badge?: number;
    items?: { title: string; href: string }[]; // Kama ana watoto (Collapsible)
  }
  
  export interface MenuGroup {
    label: string;
    items: MenuItem[];
  }

interface SidebarComposerProps {
  menuData: MenuGroup[];
  currentPath: string; // Ili tujue ipi iwe 'active'
}

export const SidebarComposer = ({ menuData, currentPath }: SidebarComposerProps) => {
  return (
    <>
      {menuData.map((group, gIndex) => (
        <SidebarGroup key={gIndex} label={group.label}>
          {group.items.map((item, iIndex) => {
            
            // 1. Logic ya Collapsible (Ikiwa ana 'items')
            if (item.items && item.items.length > 0) {
              return (
                <SidebarCollapsible
                  key={iIndex}
                  id={`${group.label}-${item.title}`.toLowerCase()}
                  title={item.title}
                  icon={() => <SidebarDynamicIcon name={item.icon} />}
                  items={item.items}
                />
              );
            }

            // 2. Logic ya Item ya kawaida
            return (
              <SidebarItem
                key={iIndex}
                title={item.title}
                icon={() => <SidebarDynamicIcon name={item.icon} />}
                href={item.href || "#"}
                badge={item.badge}
                active={currentPath === item.href}
              />
            );
          })}
        </SidebarGroup>
      ))}
    </>
  );
};