import React from "react";
import { 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Zap,
  LucideIcon 
} from "lucide-react";

export type StatusVariant = "success" | "error" | "warning" | "info" | "attention" | "default";

interface EduStatusBoxProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  variant?: StatusVariant;
  showIcon?: boolean;
  className?: string;
}

export function EduStatusBox({ 
  title,
  description,
  children,
  variant = "default", 
  showIcon = true,
  className = "" 
}: EduStatusBoxProps) {
  
  const iconConfig: Record<StatusVariant, LucideIcon> = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
    attention: Zap,
    default: Info,
  };

  const Icon = iconConfig[variant];
  const isLarge = !!title;

  // Kutumia CSS Variable names kulingana na variant
  const colorVar = `var(--status-${variant})`;
  const bgVar = `var(--status-${variant}-bg)`;
  const borderVar = `var(--status-${variant}-border)`;

  return (
    <div 
      className={`
        inline-flex border transition-all duration-200
        ${isLarge ? "flex-col w-full p-5 rounded-2xl gap-2" : "items-center gap-2 px-3 py-1.5 rounded-lg"}
        ${className}
      `}
      style={{ 
        backgroundColor: bgVar, 
        color: colorVar,
        borderColor: borderVar,
        borderWidth: '1px'
      }}
    >
      {/* HEADER AREA */}
      <div className={`flex items-start gap-3 ${isLarge ? "w-full" : ""}`}>
        {showIcon && (
          <Icon 
            size={isLarge ? 19 : 14} 
            strokeWidth={isLarge ? 2.5 : 3} 
            className="shrink-0 mt-0.5"
            style={{ color: colorVar }}
          />
        )}
        
        <div className="flex flex-col gap-1">
            {title && (
              <h4 
                className="font-black text-[15px] leading-tight"
                style={{ color: colorVar }} // Heading inabaki kuwa na priority
              >
                {title}
              </h4>
            )}

            {!title && (
              <span className="text-[12px] font-bold leading-none">
                {description || children}
              </span>
            )}

            {/* DESCRIPTION AREA - Kwa Message Box pekee */}
            {isLarge && (description || children) && (
              <p className="text-[13.5px] font-medium leading-relaxed opacity-90 max-w-[95%]">
                {description || children}
              </p>
            )}
        </div>
      </div>
    </div>
  );
}