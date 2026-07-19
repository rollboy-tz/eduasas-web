import { create } from 'zustand';
import { useSidebarStore } from './use-sidebar.store'; // Hakikisha path ni sahihi

interface LayoutState {
  /** Inadhibiti kama Profile Panel ya kulia ipo wazi (Mobile First) */
  isProfileOpen: boolean;
  /** Inadhibiti ufunguzi wa Search Overlay kwa Mobile */
  isSearchOpen: boolean;

  /** Hugeuza hali ya Profile Panel na kufunga Sidebar kama ipo wazi */
  toggleProfile: () => void;
  /** Hufunga paneli zote za mobile */
  closeAllPanels: () => void;
  /** Hugeuza hali ya Search Overlay */
  toggleSearch: () => void;
}

export const useMobileLayoutStore = create<LayoutState>((set) => ({
  isProfileOpen: false,
  isSearchOpen: false,

  toggleProfile: () => {
    // 1. Chukuwa hali ya sasa ya Sidebar
    const sidebarMode = useSidebarStore.getState().mode;

    // 2. Kama Sidebar ya mobile ipo wazi, ifunge kwanza
    if (sidebarMode === "mobile") {
      useSidebarStore.getState().toggleMobile();
    }

    // 3. Geuza hali ya Profile Panel
    set((state) => ({ 
      isProfileOpen: !state.isProfileOpen,
      isSearchOpen: false // Usalama: Funga search kama ipo wazi
    }));
  },

  toggleSearch: () => set((state) => ({ 
    isSearchOpen: !state.isSearchOpen,
    isProfileOpen: false 
  })),

  closeAllPanels: () => {
    set({ isProfileOpen: false, isSearchOpen: false });
    // Hakikisha na Sidebar inafungwa kama ilikuwa wazi kwenye mobile
    if (useSidebarStore.getState().mode === "mobile") {
      useSidebarStore.getState().toggleMobile();
    }
  },
}));