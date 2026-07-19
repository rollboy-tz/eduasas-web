"use client";
import { capitalize } from "@/lib/utils/string-utils";

interface EduMainLoaderProps {
  size?: number;          // Sasa inapokea number pekee
  color?: string;         // Unaweza kupitisha "white", "black", au "var(--primary)"
  loadingText?: string;   // Optional: Ukiiacha wazi, maandishi hayatokei
}


/**
 * EduSas Main Loader
 * ------------------
 * @param size - Sasa inapokea number pekee
 * @param color - Unaweza kupitisha "white", "black", au "var(--primary)"
 * @param loadingText - Optional: Ukiiacha wazi, maandishi hayatokei
 */

export function EduMainLoader({ 
  size = 30, 
  color = "var(--primary)", 
  loadingText 
}: EduMainLoaderProps) {

//hometaine text size accoding to loader size
  let textSize = "";
  if (size < 20) {
    textSize = "text-[10px]";
  } else if (size < 30) {
    textSize = "text-[13px]";
  } else {
    textSize = "text-[15px]";
  }
  
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      
      {/* THE SPINNER CONTAINER */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          viewBox="0 0 50 50"
          className="animate-rotate h-full w-full"
        >
          {/* Ghost Path - Imekuwa Transparent kabisa sasa */}
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="opacity-0" // Imetoweka kabisa (Pure Transparent)
          />
          
          {/* The Morphing Arc (The Real Chrome Style) */}
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke={color}
            strokeWidth="5" // Nimeiongezea unene kidogo iwe "Safi"
            strokeLinecap="round"
            className="animate-dash"
          />
        </svg>
      </div>

      {/* LOADING TEXT - Inatokea tu kama imepitishwa */}
      {loadingText && (
        <span className="text-[10px] font-black text-muted animate-pulse">
          {capitalize(loadingText)}...
        </span>
      )}
    </div>
  );
}