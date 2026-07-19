import { create } from 'zustand';

interface AppState {
  // --- Screen & Device (Systemic) ---
  isMobileView: boolean; 
  os: string;
  reducedMotion: boolean;

  // --- Health & Connection ---
  isOnline: boolean;
  isReconnecting: boolean; // Kwa ajili ya kuonyesha "Trying to reconnect..."
  isFocused: boolean;
  
  // --- Version & Maintenance ---
  systemVersion: string; // Toleo la sasa la kodi (e.g., "1.0.4")
  needsRefresh: boolean;
  refreshReason: "version_update" | "stale_session" | "network_recovery" | null;
  lastActive: number;

  // --- Actions ---
  setMobileView: (isMobile: boolean) => void;
  setOnlineStatus: (status: boolean) => void;
  setReconnecting: (status: boolean) => void; // Action mpya
  setFocusStatus: (status: boolean) => void;
  setSystemInfo: (info: { os: string; reducedMotion: boolean }) => void;
  triggerRefresh: (reason: AppState["refreshReason"]) => void;
  updateActivity: () => void;
  resetRefresh: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Defaults
  isMobileView: false,
  os: "other",
  reducedMotion: false,
  isOnline: true,
  isReconnecting: false,
  isFocused: true,
  systemVersion: "1.0.5", // Hii itaongezeka kila ukipandisha kodi mpya
  needsRefresh: false,
  refreshReason: null,
  lastActive: typeof window !== 'undefined' ? Date.now() : 0,

  // Logic Actions
  setMobileView: (isMobile) => set({ isMobileView: isMobile }),
  
  setOnlineStatus: (status) => set((state) => ({ 
    isOnline: status, 
    isReconnecting: status ? false : state.isReconnecting // Ukirudi online, zima reconnecting
  })),

  setReconnecting: (status) => set({ isReconnecting: status }),
  
  setFocusStatus: (status) => set({ isFocused: status }),
  
  setSystemInfo: (info) => set({ 
    os: info.os, 
    reducedMotion: info.reducedMotion 
  }),
  
  triggerRefresh: (reason) => set({ 
    needsRefresh: true, 
    refreshReason: reason 
  }),
  
  updateActivity: () => set({ lastActive: Date.now() }),
  
  resetRefresh: () => set({ 
    needsRefresh: false, 
    refreshReason: null 
  }),
}));