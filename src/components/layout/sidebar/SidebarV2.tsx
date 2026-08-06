import React, { useState } from 'react';
import { useSidebar, SidebarMode } from '@/providers/SidebarContext';
import { 
  LayoutGrid, 
  BarChart2, 
  Folder, 
  Settings, 
  Menu, 
  X, 
  Layers, 
  Zap, 
  User, 
  LogOut 
} from 'lucide-react';
import { 
  SidebarHeader, 
  SidebarNav, 
  SidebarWidget, 
  SidebarProfile, 
  NavItemType 
} from './SidebarV2Components';

const navItems: NavItemType[] = [
  { icon: LayoutGrid, label: 'Overview', active: true },
  { icon: BarChart2, label: 'Analytics' },
  { icon: Folder, label: 'Projects' },
  { icon: Settings, label: 'Settings' },
];

export const SidebarV2: React.FC = () => {
  const { mode, device, changeMode, toggleMobile, isMobile } = useSidebar();
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const isTemporarilyExpanded = mode === 'minimal' && isHovered;
  const showFullContent = mode === 'expanded' || mode === 'floating' || isTemporarilyExpanded;

  const getSidebarStyles = (): string => {
    let base = "fixed left-4 top-4 bottom-4 z-[9999] flex flex-col bg-slate-950 border border-slate-800 text-slate-200 shadow-2xl transition-all duration-300 ease-out ";

    if (mode === 'hidden') {
      return base + "-translate-x-[120%] opacity-0 pointer-events-none";
    }

    if (mode === 'floating') {
      return base + "w-72 rounded-[2rem] p-5 border-indigo-500/30 bg-slate-950/90 backdrop-blur-2xl shadow-indigo-500/10";
    }

    if (mode === 'expanded' || isTemporarilyExpanded) {
      return base + "w-64 rounded-3xl p-4";
    }

    return base + "w-20 rounded-3xl p-3 items-center";
  };

  return (
    <>
      {/* Mobile Toggle Trigger */}
      {isMobile && mode === 'hidden' && (
        <button
          onClick={toggleMobile}
          className="fixed top-4 left-4 z-40 p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-600/30 active:scale-95 transition-transform"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Main Sidebar Shell Container */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={getSidebarStyles()}
      >
        {/* Section 1: Header */}
        <SidebarHeader
          icon={<Layers className="w-5 h-5 text-white" />}
          title="Nexus V2"
          subtitle="Dashboard"
          showFull={showFullContent}
          isMobile={isMobile}
          onCloseMobile={toggleMobile}
        />

        {/* Section 2: Navigation Links */}
        <SidebarNav items={navItems} showFull={showFullContent} />

        {/* Section 3: Stacked Sub-Cards UI (Container Bottom) */}
        <div className="w-full space-y-3 pt-4 border-t border-slate-800/80">
          
          {/* Card A: Upgrade / Storage Widget */}
          {showFullContent && (
            <SidebarWidget
              icon={<Zap className="w-4 h-4 text-amber-400 fill-amber-400" />}
              title="Storage Usage"
              usageText="7.5 GB / 10 GB"
              percentage={75}
            />
          )}

          {/* Card B: User Profile */}
          <SidebarProfile
            name="Alex Morgan"
            email="alex@nexus.ai"
            avatarIcon={<User className="w-5 h-5 text-slate-300" />}
            logoutIcon={<LogOut className="w-4 h-4" />}
            showFull={showFullContent}
            onLogout={() => console.log('User logged out')}
          />

          {/* Manual State Controller (Dev / Testing Only) */}
          {showFullContent && device !== 'mobile' && (
            <div className="flex gap-1 pt-2">
              {(['minimal', 'expanded', 'floating'] as SidebarMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => changeMode(m)}
                  className={`
                    flex-1 text-[10px] py-1 capitalize rounded-lg border transition-all
                    ${mode === m 
                      ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300' 
                      : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'}
                  `}
                >
                  {m}
                </button>
              ))}
            </div>
          )}

        </div>
      </aside>
    </>
  );
};