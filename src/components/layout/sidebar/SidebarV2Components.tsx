import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface SidebarHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  showFull: boolean;
  onCloseMobile?: () => void;
  isMobile?: boolean;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  icon,
  title,
  subtitle,
  showFull,
  onCloseMobile,
  isMobile,
}) => (
  <div className="flex items-center justify-between w-full mb-6 px-1">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30">
        {icon}
      </div>
      {showFull && (
        <div className="flex flex-col">
          <span className="font-bold text-base text-white tracking-wide leading-none">{title}</span>
          {subtitle && (
            <span className="text-[10px] text-indigo-400 font-medium mt-1 uppercase tracking-wider">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
    {isMobile && onCloseMobile && (
      <button onClick={onCloseMobile} className="p-1 text-slate-400 hover:text-white transition-colors">
        {/* Mobile Close Icon passes from outside */}
      </button>
    )}
  </div>
);

export interface NavItemType {
  icon: LucideIcon;
  label: string;
  href?: string;
  active?: boolean;
}

interface SidebarNavProps {
  items: NavItemType[];
  showFull: boolean;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ items, showFull }) => (
  <nav className="flex-1 w-full space-y-2">
    {items.map((item, idx) => {
      const Icon = item.icon;
      return (
        <a
          key={idx}
          href={item.href || '#'}
          className={`
            flex items-center gap-3.5 px-3 py-3 rounded-2xl transition-all duration-200 group relative
            ${
              item.active
                ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }
          `}
        >
          <Icon className="w-5 h-5 shrink-0" />
          {showFull && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
        </a>
      );
    })}
  </nav>
);

interface SidebarWidgetProps {
  icon: ReactNode;
  title: string;
  usageText: string;
  percentage: number;
}

export const SidebarWidget: React.FC<SidebarWidgetProps> = ({
  icon,
  title,
  usageText,
  percentage,
}) => (
  <div className="relative p-3.5 bg-gradient-to-b from-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-2xl shadow-inner group overflow-hidden">
    <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
    <div className="flex items-center gap-2 mb-1.5">
      {icon}
      <span className="text-xs font-semibold text-slate-200">{title}</span>
    </div>
    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden my-2">
      <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${percentage}%` }} />
    </div>
    <div className="flex justify-between items-center text-[10px] text-slate-400">
      <span>{usageText}</span>
      <span className="text-indigo-400 font-medium">{percentage}%</span>
    </div>
  </div>
);

interface SidebarProfileProps {
  name: string;
  email: string;
  avatarIcon: ReactNode;
  logoutIcon?: ReactNode;
  showFull: boolean;
  onLogout?: () => void;
}

export const SidebarProfile: React.FC<SidebarProfileProps> = ({
  name,
  email,
  avatarIcon,
  logoutIcon,
  showFull,
  onLogout,
}) => (
  <div
    className={`
    flex items-center gap-3 p-2 bg-slate-900 border border-slate-800/80 rounded-2xl transition-all duration-200
    ${showFull ? 'justify-between' : 'justify-center'}
  `}
  >
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/50 flex items-center justify-center shrink-0">
        {avatarIcon}
      </div>
      {showFull && (
        <div className="flex flex-col truncate">
          <span className="text-xs font-semibold text-slate-200 truncate">{name}</span>
          <span className="text-[10px] text-slate-400 truncate">{email}</span>
        </div>
      )}
    </div>

    {showFull && logoutIcon && (
      <button
        onClick={onLogout}
        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
      >
        {logoutIcon}
      </button>
    )}
  </div>
);