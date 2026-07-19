'use client'
import { useState } from "react";
import Link from "next/link"; // Tumia Link badala ya <a>

export default function RootPage() {
    const [params, setParams] = useState("");
    
    return (
        <main className="flex flex-col gap-4 p-10">
            <input 
                className="p-2 border border-primary bg-transparent text-[var(--main-text)]" 
                placeholder="Enter params..."
                onChange={(e) => setParams(e.target.value)} 
            />
            
            <div className="flex gap-4">
                {/* Link inatusaidia Next.js kufanya prefetching na manifest creation vizuri */}
                <Link 
                    href={`/auth/sign-in?${params}`}
                    className="px-4 py-2 bg-primary text-black rounded-sm font-bold"
                >
                    Sign In
                </Link>
                
                <Link 
                    href={`/auth/sign-up?${params}`}
                    className="px-4 py-2 border border-[var(--card-border)] text-[var(--main-text)] rounded-sm"
                >
                    Sign Up
                </Link>
            </div>
        </main>
    );
}