// src/components/ui/skeleton.tsx
import { cn } from "@/lib/utils/helper"

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
     {...props}
      className={cn(
        "relative overflow-hidden rounded-md bg-muted/40", // Rangi ya msingi
        className
      )}
    >
      {/* Hapa ndio unyama wa shimmer ulipo */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-muted-foreground-card/80 to-transparent italic" />
    </div>
  )
}