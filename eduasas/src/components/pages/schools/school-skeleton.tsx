// src/components/pages/schools/school-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton"

export function SchoolCardSkeleton() {
  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between p-5 border border-border/40 bg-card/50 rounded-xl">
      <div className="flex items-center gap-5 w-full md:w-auto">
        {/* Logo Skeleton */}
        <Skeleton className="h-14 w-14 rounded-full flex-shrink-0" />
        
        <div className="flex flex-col gap-2 w-full min-w-[200px]">
          {/* Title Skeleton */}
          <Skeleton className="h-5 w-3/4 md:w-48" />
          {/* Subtitle/Designation Skeleton */}
          <Skeleton className="h-3 w-1/2 md:w-32" />
        </div>
      </div>

      <div className="flex items-center gap-6 mt-4 md:mt-0 w-full md:w-auto">
        {/* Roles/Avatars Skeleton */}
        <div className="flex -space-x-2">
          <Skeleton className="h-7 w-7 rounded-full border-2 border-background" />
          <Skeleton className="h-7 w-7 rounded-full border-2 border-background" />
        </div>
        
        {/* Button Skeleton */}
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  )
}