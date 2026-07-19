"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SmartFlexHeaderProps {
  /**
   * Muonekano/Vitu vinavyoonekana WAKATI IPO MAHALI PAKE (Kawaida / Unpinned)
   */
  children: React.ReactNode;
  /**
   * Vitu vinavyoonekana PALE TU INAPOGANDA JUU (Sticky / Pinned)
   * Mfano: Jina la profile, picha ndogo, au utambulisho maalum
   */
  pinnedChildren?: React.ReactNode;
  className?: string;
  stickyClassName?: string;
}

/**
 * ### 👑 SmartFlexHeader (The High-End Dynamic Reveal Engine)
 * * Component ya kiwango cha juu (Context-Aware) inayoweza kukaa popote kwenye ukurasa (hata chini ya kadi au katikati ya data). 
 * Mtumiaji anapo-scroll, ikigusa `top-0` inaganda (`sticky`), inaficha maudhui ya kawaida na "kuzamisha" (Fade-In) 
 * taarifa mpya (mfano: picha na jina la profile kama bidhaa za Apple au Twitter/X).
 * * Pia, ina injini ya kusoma uelekeo wa scroll: ikishuka chini inajificha kupisha eneo la kusoma, ikivutwa juu kidogo inatokea haraka.
 * * ---
 * * ### 🚨 MASHARTI YA CSS & DOM (CREREQUISITES FOR PROS):
 * 1. **Mzazi wa Karibu (Direct Parent):** Lazima awe na `relative` au `w-full relative`. **ASIWE na `overflow-hidden` au `overflow-y-auto`** (Vinginevyo `position: sticky` itakufa papo hapo).
 * 2. **Chombo cha Scroll (DOM Container):** Kinasikiliza tag ya `<main>` ya mfumo wetu wa layout. Hakikisha `<main>` ipo na haijabadilishwa jina.
 * 3. **Zustand / SWR Alert:** Inafanya kazi salama baada ya SWR Cache clearance kwa sababu ina ulinzi wa `AnimatePresence`.
 * * ---
 * * @component
 * @example
 * ```tsx
 * // MFANO WA MATUMIZI KWENYE PROFILE YA KISHUA:
 * <SmartFlexHeader
 * className="px-6 bg-transparent"
 * stickyClassName="bg-[#151515]/95 border-b border-zinc-800/80 shadow-2xl backdrop-blur-xl px-6 py-3"
 * pinnedChildren={
 * <div className="flex items-center gap-3">
 * <Avatar src="/profile.jpg" className="w-8 h-8" />
 * <h4 className="text-sm font-bold">Rahim Cletus</h4>
 * </div>
 * }
 * >
 * {/* Hapa yanawekwa maudhui ya kawaida (kama vile Nav Tabs) kabla haijaganda juu *\/}
 * <div className="flex gap-4 text-sm">
 * <span className="border-b-2 border-primary pb-1">Overview</span>
 * <span>Tasks</span>
 * </div>
 * </SmartFlexHeader>
 * ```
 * * @param {Object} props - Sifa za Component.
 * @param {React.ReactNode} props.children - Maudhui yanayoonekana wakati header ipo kwenye nafasi yake ya kawaida (Unpinned).
 * @param {React.ReactNode} [props.pinnedChildren] - Maudhui maalum (Slots) yatakayozama (Fade-In) pale tu header inapoganda juu kabisa (Pinned).
 * @param {string} [props.className] - Class za Tailwind za muonekano wa kawaida wakati haijaganda.
 * @param {string} [props.stickyClassName] - Class za Tailwind zitakazowaka na ku-override za mwanzo pale tu inapoganda juu.
 */

export function SmartFlexHeader({
  children,
  pinnedChildren,
  className,
  stickyClassName = "bg-background/95 border-b border-border/80 shadow-md backdrop-blur-md"
}: SmartFlexHeaderProps) {
  
  const [isPinned, setIsPinned] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // Kudhibiti kujificha/kuonekana
  
  const sentinelRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  // 1. MTEGO WA KUGANDA (Intersection Observer)
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPinned(!entry.isIntersecting);
      },
      {
        threshold: [1],
        rootMargin: "-1px 0px 0px 0px" // Mtego unawaka ukigusa tu top-0
      }
    );

    observer.observe(sentinel);
    return () => observer.unobserve(sentinel);
  }, []);

  // 2. MTEGO WA UPANDE WA SCROLL (Up vs Down Detection)
  useEffect(() => {
    // Tunatafuta scrollable area yetu ya mfumo (Kumbuka ule msimbo wa 'main' kwenye Layout)
    const scrollContainer = document.querySelector("main") || window;

    const handleScroll = () => {
      // Pata namba ya sasa ya scroll kulingana na kama ni 'main' tag au window
      const currentScrollY = scrollContainer instanceof HTMLElement 
        ? scrollContainer.scrollTop 
        : window.scrollY;

      // Kama haijaganda juu, lazima iwe visible muda wote!
      if (!isPinned) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Kama mtumiaji anashuka chini (Scroll Down) na amevuka kiwango fulani, ficha header
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } 
      // Kama mtumiaji anapandisha juu (Scroll Up), onyesha header haraka sana!
      else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [isPinned]);

  return (
    <>
      {/* 🎯 SENTINEL: Huu ndio mtego wetu wa siri unaokaa pikseli moja juu ya header */}
      <div ref={sentinelRef} className="h-px w-full pointer-events-none bg-transparent" />

      {/* 📦 BODY YA HEADER: Inayobeba sarakasi zote za mwendo */}
      <motion.div
        animate={{
          y: isVisible ? 0 : -80, // Inajificha juu kwa kupaa pikseli -80 kama user akiscroll chini
        }}
        transition={{ type: "spring", damping: 25, stiffness: 240 }}
        className={cn(
          // Base styles za kawaida wakati haijaganda (Inaweza kuwa katikati ya kadi)
          "sticky top-0 z-30 w-full transition-colors duration-300 py-4 px-2 flex items-center justify-between bg-transparent",
          className,
          // Mitindo inayoongezeka pale inapoganda juu kabisa
          isPinned && stickyClassName
        )}
      >
        {/* UPANDE WA KUSHOTO: Swichi ya Maudhui (Vitu vinavyobadilika) */}
        <div className="flex-1 flex items-center min-w-0">
          <AnimatePresence mode="wait">
            {!isPinned ? (
              // 🟢 MUONEKANO WA KAWAIDA (Default Content Slot)
              <motion.div
                key="normal-content"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
                className="w-full"
              >
                {children}
              </motion.div>
            ) : (
              // 👑 MUONEKANO WA KISHUA (Pinned/Sticky Content Slot)
              <motion.div
                key="pinned-content"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-full flex items-center"
              >
                {pinnedChildren ? pinnedChildren : children}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}