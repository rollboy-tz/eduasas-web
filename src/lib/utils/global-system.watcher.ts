"use client"
import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/layout/use-app.store";

export default function GlobalSystemWatcher() {
  // Sasa tunachukua tu kile tunachotumia (Removed isOnline)
  const { 
    setOnlineStatus, 
    setMobileView, 
    setFocusStatus, 
    setSystemInfo,
    triggerRefresh,
    updateActivity 
  } = useAppStore();

  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const backoffDelayRef = useRef(2000); 

  // --- A. HEALTH CHECK ---
  const checkActualConnectivity = async () => {
    try {
      // const res = await fetch("https://api.eduasas.co.tz/", { 
      //   method: 'HEAD', 
      //   cache: 'no-cache',
      //   mode: 'no-cors' // Muhimu kama unatumia HEAD cross-origin
      // });
      return true; // Ikiweza kufika hapa, mawasiliano yapo
    } catch {
      return false;
    }
  };

  useEffect(() => {
    // 1. Media Query
    const checkRes = () => setMobileView(window.innerWidth < 768);
    
    // 2. Connectivity Engine
    const startReconnecting = async () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);

      reconnectTimeoutRef.current = setTimeout(async () => {
        const connected = await checkActualConnectivity();
        if (connected) {
          setOnlineStatus(true);
          triggerRefresh("network_recovery");
          backoffDelayRef.current = 2000;
        } else {
          backoffDelayRef.current = Math.min(backoffDelayRef.current * 1.5, 30000);
          startReconnecting();
        }
      }, backoffDelayRef.current);
    };

    const updateOnlineStatus = async () => {
      const browserOnline = navigator.onLine;
      if (browserOnline) {
        const reallyConnected = await checkActualConnectivity();
        if (reallyConnected) {
          setOnlineStatus(true);
          triggerRefresh("network_recovery");
          backoffDelayRef.current = 2000;
        } else {
          setOnlineStatus(false);
          startReconnecting();
        }
      } else {
        setOnlineStatus(false);
        // Hapa hatuanzi reconnecting mpaka browser iseme 'online' kwanza
      }
    };

    // 3. Visibility & Activity
    const updateFocus = () => setFocusStatus(document.visibilityState === "visible");
    const handleActivity = () => updateActivity();

    // 4. System Traits
    const getSystemTraits = () => {
      const ua = window.navigator.userAgent.toLowerCase();
      let os = "other";
      if (ua.includes("win")) os = "windows";
      else if (ua.includes("mac")) os = "macos";
      else if (ua.includes("linux")) os = "linux";
      else if (ua.includes("android")) os = "android";
      else if (ua.includes("iphone") || ua.includes("ipad")) os = "ios";

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setSystemInfo({ os, reducedMotion });
    };

    // --- Boot Up ---
    checkRes();
    updateOnlineStatus();
    updateFocus();
    getSystemTraits();

    // --- Listeners ---
    window.addEventListener("resize", checkRes);
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    document.addEventListener("visibilitychange", updateFocus);
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);

    return () => {
      window.removeEventListener("resize", checkRes);
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
      document.removeEventListener("visibilitychange", updateFocus);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [setMobileView, setOnlineStatus, setFocusStatus, setSystemInfo, triggerRefresh, updateActivity]);

  return null;
}