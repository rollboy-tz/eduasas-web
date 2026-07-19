/**
 * @file SmartTabWrapper.tsx
 * @description Tab System maalum kwa ajili ya vifaa vya mkononi (Mobile).
 * Inajumuisha uwezo wa kusukuma (Swiping), Squeeze animations, na 
 * viashiria vya taarifa mpya (Indicator Dots).
 * * @author Rollboy (EduAsas Tech)
 * @version 1.2.0
 */

'use client'

import { useState, ReactNode, ComponentType } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { cn } from "@/lib/utils/helper";

/**
 * @interface Tab
 * @property {string} id - Utambulisho wa kipekee wa tab (mfano: 'profile').
 * @property {string} label - Jina linaloonekana kwenye tab button.
 * @property {ComponentType} icon - Icon ya Lucide au React component ya icon.
 * @property {boolean} [hasBadge] - Hiari: Huamua kama tab ionyeshe dot ya notification.
 */
interface Tab {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  hasBadge?: boolean;
}

interface SmartTabWrapperProps {
  /** Orodha ya tabu zitakazoundwa */
  tabs: Tab[];
  /** Function inayopokea activeTabId na kurudisha content ya ku-render */
  children: (activeTabId: string) => ReactNode;
  /** Class za ziada za Tailwind */
  className?: string;
}

/**
 * @constant variants
 * Inafafanua jinsi content inavyo-slide na ku-squeeze wakati wa kubadilisha tab.
 */
const variants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.98, // Kidogo squeeze inapoanza
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 350, damping: 35 },
      opacity: { duration: 0.2 },
      scale: { duration: 0.2 }
    }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.98, // Squeeze kidogo inapotoka
    transition: {
      x: { duration: 0.25, ease: "easeInOut" },
      opacity: { duration: 0.1 }
    }
  })
};

/**
 * SmartTabWrapper Component
 * * @example
 * <SmartTabWrapper tabs={[{ id: 'a', label: 'Tab A', icon: Icon }]}>
 * {(activeId) => activeId === 'a' && <Content />}
 * </SmartTabWrapper>
 */
export function SmartTabWrapper({ 
  tabs, 
  children,
  className 
}: SmartTabWrapperProps) {
  // [[currentTabId, slideDirection]]
  const [[activeTab, direction], setTab] = useState([tabs[0].id, 0]);

  /**
   * Huendesha mabadiliko ya tab kwa kubaini upande (direction) wa animation
   * @param {string} newTabId - ID ya tab mpya inayokwenda kufunguliwa
   */
  const paginate = (newTabId: string) => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    const newIndex = tabs.findIndex(t => t.id === newTabId);
    
    if (newTabId === activeTab) return;
    setTab([newTabId, newIndex > currentIndex ? 1 : -1]);
  };

  /**
   * Logic ya Gesture: Swipe Confidence Threshold
   * Huamua nguvu ya kusukuma (swipe) inayohitajika ili kubadili tab.
   */
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  /**
   * Hufanya maamuzi baada ya user kuachia kidole (drag end)
   */
  const onDragEnd = (_e: any, { offset, velocity }: any) => {
    const swipe = swipePower(offset.x, velocity.x);
    const currentIndex = tabs.findIndex(t => t.id === activeTab);

    // Swipe kwenda kushoto -> Next Tab
    if (swipe < -swipeConfidenceThreshold) {
      if (currentIndex < tabs.length - 1) {
        paginate(tabs[currentIndex + 1].id);
      }
    } 
    // Swipe kwenda kulia -> Previous Tab
    else if (swipe > swipeConfidenceThreshold) {
      if (currentIndex > 0) {
        paginate(tabs[currentIndex - 1].id);
      }
    }
  };

  return (
    <div className={cn("flex flex-col h-full overflow-hidden w-full touch-pan-y bg-background", className)}>
      
      {/* NAVIGATION BAR 
        Sehemu ya juu inayoshikilia buttons za tabs
      */}
      <nav className="p-4 pt-6 select-none z-20">
        <div className="flex p-1 bg-muted/40 rounded-2xl border border-border/50 relative">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => paginate(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all relative z-10 outline-none cursor-pointer",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {/* INDICATOR DOT: Inaonekana kama kuna taarifa mpya */}
                {tab.hasBadge && !isActive && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2.5 right-[20%] w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.8)]" 
                  />
                )}

                {/* ACTIVE BACKGROUND SLIDER: Inateleza kufuata tab inayobonyezwa */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabBackground"
                    className="absolute inset-0 bg-background border border-border/50 rounded-xl shadow-sm z-[-1]"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                
                <Icon className={cn("w-3.5 h-3.5 transition-transform duration-200", isActive && "scale-110")} />
                <span className="hidden xs:block">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* DRAGGABLE CONTENT 
        Eneo la chini linalobeba content na kuruhusu swipe gesture
      */}
      <main className="flex-1 relative overflow-hidden w-full h-full">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={activeTab}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            // Swipe/Drag Configuration
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={onDragEnd}
            className="h-full w-full absolute inset-0 cursor-grab active:cursor-grabbing px-1"
          >
            {children(activeTab)}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}