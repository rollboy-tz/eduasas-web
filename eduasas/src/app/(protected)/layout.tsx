"use client";

import React, { useEffect } from "react";
import { AuthProvider } from "@/providers";
import { useQueryClient } from "@tanstack/react-query";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient();

    useEffect(() => {
        const handleLogout = () => {
            console.log("🧹 [Logout] Clearing cache...");
            queryClient.clear();
        };
        window.addEventListener("app:logout-trigger", handleLogout);
        
        return () => {
            window.removeEventListener("app:logout-trigger", handleLogout);
        };
    }, [queryClient]);

    return <AuthProvider>{children}</AuthProvider>;
}