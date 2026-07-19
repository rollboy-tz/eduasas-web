"use client";

/**
 * EduProgressBar Component
 * * @param {number} progress - Current progress value (0 to 100).
 * @param {string} label - Optional text to describe the process (e.g., "Uploading...").
 * @param {boolean} showPercent - Toggle visibility of the percentage number.
 * @param {string} percentPosition - UI layout for metadata (start, center, or end).
 * @param {string} color - CSS color for the progress fill (supports hex, rgb, names, or variables).
 * @param {number} height - The thickness of the progress bar in pixels.
 */
interface EduProgressBarProps {
  progress: number;
  label?: string;
  showPercent?: boolean;
  percentPosition?: 
    | "top-start" | "top-center" | "top-end" 
    | "bottom-start" | "bottom-center" | "bottom-end";
  color?: string;
  height?: number;
}

export function EduProgressBar({
  progress = 0,
  label,
  showPercent = true,
  percentPosition = "bottom-end",
  color = "var(--primary)",
  height = 6,
}: EduProgressBarProps) {
  
  const isTop = percentPosition.startsWith("top");
  const isCenter = percentPosition.endsWith("center");
  const isEnd = percentPosition.endsWith("end");
  const isStart = percentPosition.endsWith("start");

  const Metadata = () => {
    // Determine the justify class based on explicit position props
    const getJustify = () => {
      if (isStart) return "justify-start gap-4"; // Grouped together at the start
      if (isCenter) return "justify-center";    // Centered alignment
      if (isEnd) return "justify-between";      // Split: Label (left) | Percent (right)
      return "justify-between";                 // Default fallback
    };

    return (
      <div className={`flex items-end mb-2 w-full ${getJustify()}`}>
        
        {/* Label: Shown for start and end positions, hidden in center unless specified */}
        {label && (isStart || isEnd) && (
          <span className="text-[10px] font-bold text-muted">
            {label}...
          </span>
        )}
        
        {showPercent && (
          <div className={`flex flex-col ${isCenter ? "items-center" : "items-end"}`}>
            {/* Special handling for Center: Label sits directly above percentage */}
            {isCenter && label && (
                <span className="text-[9px] font-bold text-muted mb-1">
                    {label}...
                </span>
            )}
            
            <div className="flex flex-col items-center">
               <span className={`text-[11px] font-bold italic leading-none`}>
                {progress}%
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-inherit">
      {/* 1. Header Metadata Section */}
      {isTop && <Metadata />}

      {/* 2. The Progress Track */}
      <div 
        className="relative w-full overflow-hidden rounded-full bg-slate-500/10 shadow-inner" 
        style={{ height }}
      >
        {/* Animated Fill */}
        <div 
          className="progress-transition absolute inset-0 h-full rounded-full"
          style={{ 
            width: `${progress}%`, 
            backgroundColor: color,
            boxShadow: `0 0 15px ${color}25` 
          }}
        >
          {/* Windows-10 Shimmer: Glass effect moving through the bar */}
          <div className="animate-progress-shimmer absolute inset-0 w-full h-full">
            <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[25deg]" />
          </div>
        </div>
      </div>

      {/* 3. Footer Metadata Section */}
      {!isTop && <Metadata />}
    </div>
  );
}