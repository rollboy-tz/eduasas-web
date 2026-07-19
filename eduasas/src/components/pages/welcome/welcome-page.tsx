'use client'
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { EduScreenLoader } from "@/components/elements"

/**
 * WELCOME PAGE
 * Page maalum kwa ajili ya kuwakaribisha watumiaji wapya na kutoa maelekezo (Tutorials).
 * Endpoint: /u
 */
export function WelcomePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        const isNew = searchParams.get("new-user");
        const needTutorial = searchParams.get("need-totp");

        // Kama sio mgeni na hahitaji tutorial, mpeleke home fasta
        if (isNew !== "yes" && needTutorial !== "yes") {
            setIsRedirecting(true);
            router.replace("/u/home");
        }
    }, [searchParams, router]);

    // Kama tunam-redirect mtumiaji wa zamani, onyesha loader kwanza
    if (isRedirecting) {
        return <EduScreenLoader />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-background">
            <div className="w-full max-w-[400px] flex flex-col bg-card border border-border rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="space-y-2 mb-6 text-center">
                    <h3 className="text-2xl font-black tracking-tight">Welcome to EduAsas</h3>
                    <p className="text-sm text-muted-foreground">
                        Your smarter journey to education tracking starts here.
                    </p>
                </div>
                
                {/* Hapa unaweza kuweka ule unyama wa tutorial tips baadaye */}
                
                <button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-xl transition-all active:scale-95 shadow-lg shadow-primary/20"
                    onClick={() => router.replace("/u/home")}
                >
                    Get Started
                </button>
            </div>
        </div>
    )
}