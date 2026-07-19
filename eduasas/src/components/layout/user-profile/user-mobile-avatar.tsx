// src/components/ui/user-avatar.tsx
'use client'

import { useUser } from "@/hooks/users";
import { cn } from "@/lib/utils/helper";

interface UserAvatarProps {
    onClick?: () => void;
    /** Ukubwa wa avatar: sm (Topbar), md (Sidebar), lg (Profile) */
    size?: "sm" | "md" | "lg";
    className?: string;
    /** Picha ya dharura/placeholder kutoka kwenye assets zako, Default ni none */
    placeholderSrc?: string;
    /**Hapa tunaweza kupitisha rangi ya variant default itakuwa ni none */
    variant?: "success" | "error" | "info" | "primary" | "none";
}

/**
 * Component ya Avatar inayovuta picha ya mwalimu moja kwa moja kutoka kwenye Profile State.
 * Inatumia placeholder picha maalum badala ya initials.
 * * @example
 * <UserAvatar size="md" onClick={() => router.push('/profile')} />
 */
export function UserAvatar({ 
    onClick, 
    size = "md", 
    variant = "none",
    className, 
    placeholderSrc = "/images/user-avatar.png" // Badilisha kulingana na path ya faili ulilopandisha
}: UserAvatarProps) {
    
    const { profile, isLoading } = useUser();

    // Vipimo vya muonekano (Tailwind Classes)
    const sizeClasses = {
        sm: "h-7 w-7",   // Topbar (Compact)
        md: "h-10 w-10", // Sidebar (Standard)
        lg: "h-20 w-20", // Profile/Settings (Large)
    };

    const variantClasess = {
        success: "ring-success/50ring-2",
        error: "ring-destructive/50 ring-2",
        info: "ring-info/50 ring-2",
        primary: "ring-primary/50 ring-2",
        none: "",
    }

    // 1. Kipaumbele cha picha: Profile Picture > Placeholder
    const currentSrc = profile?.picture || placeholderSrc;

    // Loader wakati data inavuta (Shimmer effect)
    if (isLoading) {
        return (
            <div className={cn(
                "rounded-full bg-secondary/50 animate-pulse border border-border/40",
                sizeClasses[size],
                className
            )} />
        );
    }

    return (
        <button
            onClick={onClick}
            disabled={!onClick}
            className={cn(
                "group relative flex shrink-0 items-center justify-center overflow-hidden rounded-full transition-all active:scale-95 outline-none border-2 border-border",
                !onClick && "cursor-default",
                variantClasess[variant],
                sizeClasses[size], 
                className
            )}
        >
            <img
                src={currentSrc}
                alt={profile?.firstName || "User Avatar"}
                className="h-full w-full object-cover transition-opacity scale-99 group-hover:opacity-95"
                onError={(e) => {
                    // Kama picha ya mwalimu ikizingua, rudi kwenye placeholder yetu ya dharura
                    (e.target as HTMLImageElement).src = placeholderSrc;
                }}
            />
        </button>
    );
}