// src/components/layout/sidebar-header.tsx
'use client'

import Image from "next/image";
import { cn } from "@/lib/utils/helper";

interface SidebarHeaderProps {
  isOpen: boolean;
}

export function SidebarHeader({ isOpen }: SidebarHeaderProps) {
  return (
    <div className="relative flex-shrink-0 z-20">
      <div className={cn(
        "h-12 flex items-center backdrop-blur-md transition-all duration-300",
        "rounded-tr-2xl md:rounded-none",
        // JINSI YA KUDHIBITI PADDING:
        // Kama imefungwa (Minimal), tunapunguza padding ili logo isibanwe
        isOpen ? "px-4" : "px-0 justify-center"
      )}>
        
        <div className={cn(
          "flex items-center gap-3 transition-all duration-300",
          !isOpen && "justify-center w-full"
        )}>
          
          {/* LOGO CONTAINER */}
          <div className={cn(
            "relative flex-shrink-0 transition-all duration-300",
            isOpen ? "w-8 h-8" : "w-7 h-7" // Inapungua kidogo sidebar ikifungwa
          )}>
             <Image 
                src="/icons/logo-128.png" 
                alt="EduAsas Logo"
                fill
                className="object-contain"
                priority
             />
          </div>

          {/* LOGO TEXT - Inapotea kitalamu sidebar ikifungwa */}
          {isOpen && (
            <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
              <span className="text-xl font-black leading-none">
                EduAsas
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}