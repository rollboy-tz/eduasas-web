"use client";

import React, { useState } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useDismiss,
  useClick,
  useInteractions,
  FloatingPortal,
  Placement
} from "@floating-ui/react";
import { cn } from "@/lib/utils/helper";

export function EduFloatingDiv({
  trigger,
  children,
  className,
  side = "bottom",
  align = "center", // Tumia 'start' | 'center' | 'end'
  spacing = 8
}: {
  trigger: React.ReactNode,
  children: React.ReactNode,
  className?: string,
  side?: "top" | "bottom" | "left" | "right",
  align?: "start" | "center" | "end",
  spacing?: number
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Unganisha side na align kupata placement format ya floating-ui (mfano: "bottom-start")
  const placement: Placement = `${side}-${align}` as Placement;

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: placement, // Hapa ndipo side na align zinafanya kazi
    //strategy: "fixed", // Hii ni muhimu sana! Inazuia popover "kuruka" wakati wa scroll
    middleware: [
      offset(spacing),
      flip({ padding: 10 }), // Padding inazuia iguse ukingo
      shift({ padding: 10 })
    ],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);
  const getTransformOrigin = (side: string) => {
    switch (side) {
      case 'top': return 'bottom center';
      case 'bottom': return 'top center';
      case 'left': return 'center right';
      case 'right': return 'center left';
      default: return 'center';
    }
  };

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()} className="inline-block">
        {trigger}
      </div>

      <FloatingPortal>
        {!isOpen ? null : (
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              pointerEvents: isOpen ? "auto" : "none",
              opacity: isOpen ? 1 : 0,
              transition: "opacity 200ms ease-out",
            }}
            {...getFloatingProps()}
            className={cn(
              "z-[9999]", isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0", // Hapa ndipo inapochomoza kiutaratibu
              className
            )}
          >
            {children}
          </div>)}
      </FloatingPortal>
    </>
  );
}