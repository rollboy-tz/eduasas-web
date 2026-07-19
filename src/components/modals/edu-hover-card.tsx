"use client";

import React, { useState, useRef } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingArrow,
} from "@floating-ui/react";
import { cn } from "@/lib/utils/helper";

interface EduHoverCardProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  showArrow?: boolean;
  className?: string;
  side?: "top" | "bottom" | "left" | "right";
}

export function EduHoverCard({ 
  trigger, 
  children, 
  showArrow = true, 
  className,
  side = "bottom" 
}: EduHoverCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(10), // Nafasi kati ya trigger na kadi
      flip(), // Itajipindua ikiwa imegonga mwisho wa screen
      shift({ padding: 10 }), // Itajisogeza isitoke nje
      arrow({ element: arrowRef }),
    ],
    whileElementsMounted: autoUpdate,
    placement: side,
  });

  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover, focus, dismiss, role,
  ]);

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()} className="inline-block">
        {trigger}
      </div>
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className="z-50"
        >
          <div className={cn(
            "bg-card border border-border shadow-lg rounded-md p-3 animate-in fade-in zoom-in duration-200",
            className
          )}>
            {showArrow && (
              <FloatingArrow 
                ref={arrowRef} 
                context={context} 
                className="fill-card stroke-border" 
                strokeWidth={1}
              />
            )}
            {children}
          </div>
        </div>
      )}
    </>
  );
}