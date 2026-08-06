'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * Aina za vifaa vinavyolengwa kwenye layout kulingana na ukubwa wa skrini.
 * - `desktop`: Skrini kubwa (Width >= 1024px)
 * - `tablet`: Skrini za kati (640px <= Width < 1024px)
 * - `mobile`: Skrini ndogo (Width < 640px)
 */
export type DeviceType = 'desktop' | 'tablet' | 'mobile';

/**
 * Modes zote zinazopatikana za sidebar:
 * - `minimal`: Sidebar ndogo (icons-only).
 * - `expanded`: Sidebar iliyopanuka kikamilifu.
 * - `floating`: Sidebar inayoelea yenye mtindo wa Glassmorphism/Card layer.
 * - `hidden`: Sidebar iliyojificha kabisa (kwa ajili ya Mobile).
 */
export type SidebarMode = 'minimal' | 'expanded' | 'floating' | 'hidden';

/**
 * Structure ya data inayopatikana kwenye `SidebarContext`.
 */
export interface SidebarContextType {
  /** Kifaa kinachotambulika kwa sasa kulingana na screen width */
  device: DeviceType;
  /** Hali/Mode ya sasa ya sidebar */
  mode: SidebarMode;
  /**
   * Mbinu ya kubadilisha mode ya sidebar kwa usalama kulingana na mipaka ya kifaa kilichopo.
   * @param newMode Mode mpya unayotaka kuweka (`minimal`, `expanded`, `floating`, `hidden`)
   */
  changeMode: (newMode: SidebarMode) => void;
  /** Badilisha muundo wa mobile kati ya `floating` na `hidden` */
  toggleMobile: () => void;
  /** Ni `true` ikiwa kifaa cha sasa ni Mobile */
  isMobile: boolean;
  /** Ni `true` ikiwa kifaa cha sasa ni Tablet */
  isTablet: boolean;
  /** Ni `true` ikiwa kifaa cha sasa ni Desktop */
  isDesktop: boolean;
}

/**
 * Props zinazotakiwa na Provider component.
 */
export interface SidebarProviderProps {
  /** Component au kurasa zitakazokuwa ndani ya provider hii */
  children: ReactNode;
}

// Default state safe fallback kuzuia App Router kudondoka kabla context haijawa hydrated
const defaultContextState: SidebarContextType = {
  device: 'desktop',
  mode: 'expanded',
  changeMode: () => {},
  toggleMobile: () => {},
  isMobile: false,
  isTablet: false,
  isDesktop: true,
};

/**
 * React Context ya kusimamia hali na tabia ya Sidebar V2.
 */
const SidebarContext = createContext<SidebarContextType>(defaultContextState);

/**
 * Provider inayohusika na kusikiliza resize ya screen na kudhibiti modes za Sidebar kwenye App Router.
 * 
 * @example
 * ```tsx
 * // app/layout.tsx au app/dashboard/layout.tsx
 * import { SidebarProvider } from '@/providers/SidebarContext';
 * 
 * export default function Layout({ children }: { children: ReactNode }) {
 *   return <SidebarProvider>{children}</SidebarProvider>;
 * }
 * ```
 */
export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [mode, setMode] = useState<SidebarMode>('expanded');

  // Sikiliza resize za dirisha na kulazimisha sheria za Sidebar kulingana na kifaa
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 640) {
        // MOBILE RULES: Inaruhusu Floating au Hidden pekee
        setDevice('mobile');
        setMode((prev) => (prev === 'floating' ? 'floating' : 'hidden'));
      } else if (width >= 640 && width < 1024) {
        // TABLET RULES: Inaruhusu Minimal au Floating pekee
        setDevice('tablet');
        setMode((prev) => (prev === 'floating' ? 'floating' : 'minimal'));
      } else {
        // DESKTOP RULES: Inaruhusu Minimal, Expanded, au Floating
        setDevice('desktop');
        setMode((prev) => (prev === 'hidden' ? 'expanded' : prev));
      }
    };

    handleResize(); // Mara ya kwanza client inapoload
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /**
   * Inahakikisha mode inayowekwa inaheshimu sheria za kifaa cha sasa.
   */
  const changeMode = (newMode: SidebarMode) => {
    if (device === 'mobile') {
      if (newMode === 'floating' || newMode === 'hidden') setMode(newMode);
    } else if (device === 'tablet') {
      if (newMode === 'minimal' || newMode === 'floating') setMode(newMode);
    } else if (device === 'desktop') {
      if (['minimal', 'expanded', 'floating'].includes(newMode)) setMode(newMode);
    }
  };

  /**
   * Inarudisha au kujificha kwa sidebar ikiwa kwenye mobile.
   */
  const toggleMobile = () => {
    if (device === 'mobile') {
      setMode((prev) => (prev === 'hidden' ? 'floating' : 'hidden'));
    }
  };

  return (
    <SidebarContext.Provider
      value={{
        device,
        mode,
        changeMode,
        toggleMobile,
        isMobile: device === 'mobile',
        isTablet: device === 'tablet',
        isDesktop: device === 'desktop',
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

/**
 * Hook ya kupata state na mbinu za SidebarV2 ndani ya Client Components zote.
 * 
 * @returns {SidebarContextType} Objekti yenye state zote za sidebar (`mode`, `device`, `changeMode`, nk.)
 * 
 * @example
 * ```tsx
 * 'use client';
 * import { useSidebar } from '@/providers/SidebarContext';
 * 
 * const MyComponent = () => {
 *   const { mode, changeMode } = useSidebar();
 *   return <button onClick={() => changeMode('floating')}>Floating Mode</button>;
 * };
 * ```
 */
export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  return context;
};