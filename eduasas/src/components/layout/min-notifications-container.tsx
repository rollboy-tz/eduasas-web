// src/components/notifications/notification-container.tsx
'use client'

import { useNotifications } from "@/hooks/users";
import { DateUtils } from "@/lib/utils";
import { Trash2, BellOff, Circle } from "lucide-react";
import { cn } from "@/lib/utils/helper";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion"; // Hakikisha ume-install framer-motion

export function NotificationContainer() {
  const { notifications, markAsRead, clearNotifications, isLoading } = useNotifications();

  const displayedNotifications = notifications.slice(0, 6);

  const handleMarkAllDisplayed = () => {
    const unreadIds = displayedNotifications.filter(n => !n.isRead).map(n => n.id);
    if (unreadIds.length > 0) markAsRead(unreadIds);
  };

  const handleClearDisplayed = () => {
    const displayedIds = displayedNotifications.map(n => n.id);
    if (displayedIds.length > 0) clearNotifications(displayedIds);
  };

  return (
    <div className="bg-popover flex flex-col border border-border overflow-hidden">
      
      <div className="max-h-[380px] overflow-y-auto no-scrollbar">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">
            Chucking data...
          </div>
        ) : displayedNotifications.length > 0 ? (
          <div className="flex flex-col">
            {/* AnimatePresence inasimamia zinapoingia na zinapotoka */}
            <AnimatePresence initial={false} mode="popLayout">
              {displayedNotifications.map((n) => {
                const itemClasses = cn(
                  "px-4 py-4 border-b border-border/50 cursor-pointer transition-colors relative group block w-full text-left outline-none",
                  n.isRead ? "opacity-60" : "bg-primary/[0.03] hover:bg-primary/[0.05]"
                );

                //Notifications content
                const NotificationContent = (
                <div className="flex flex-col rounded-br-2xl rounded-bl-2xl rounded-tr-2xl rounded-tl-none bg-primary bg-card">
                  <h3 className="">{n.title}</h3>
                </div>
                );

                return (
                  <motion.div
                    key={n.id}
                    layout // Hii inafanya zingine zipande juu smoothly
                    initial={{ opacity: 0, x: -20 }} // Slide kutoka kushoto
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }} // Slide kwenda kulia ikifutwa
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  >
                    {n.link ? (
                      <Link 
                        href={n.link as string} 
                        onClick={() => !n.isRead && markAsRead([n.id])}
                        className={itemClasses}
                      >
                        {NotificationContent}
                      </Link>
                    ) : (
                      <div 
                        onClick={() => !n.isRead && markAsRead([n.id])}
                        className={itemClasses}
                      >
                        {NotificationContent}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 px-4 text-center"
          >
            <div className="p-3 rounded-full bg-muted mb-3">
              <BellOff className="w-6 h-6 text-muted-foreground/50" />
            </div>
            <p className="text-xs font-bold text-muted-foreground">All caught up!</p>
            <p className="text-[11px] text-muted-foreground/60">No new notifications.</p>
          </motion.div>
        )}
      </div>

      {displayedNotifications.length > 0 && (
        <div className="px-4 py-2.5 flex items-center justify-between border-t border-border bg-muted/5">
          <Link 
            href="/dashboard/notifications" 
            className="text-[11px] font-black uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors outline-none"
          >
            See all
          </Link>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleMarkAllDisplayed}
              className="badge badge-success text-muted-foreground/80 hover:text-success transition-colors outline-none"
            >
              Read All
            </button>
            <span className="text-border text-[10px] select-none">|</span>
            <button 
              onClick={handleClearDisplayed}
              className="badge badge-destructive text-muted-foreground/80 hover:text-destructive transition-colors outline-none"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        clearNotifications([n.id]);
                      }}
 */