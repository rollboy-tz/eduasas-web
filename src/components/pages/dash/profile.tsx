"use client";
import { useUser } from "@/hooks/dash";
import { ProfileHeader } from "@/components/elements";
import SmartSticky from "@/components/ui/SmartSticky";
import { useState } from "react";

export const ProfilePageContents = () => {
    const [stucked, setStuck] = useState<boolean>(false);
    const { profile: user } = useUser();

    return(
        <div className="mx-auto max-w-5xl flex flex-col gap-6">
                <ProfileHeader size="lg" bannerClasses="rounded-xl" avatarPosition="left"/>
                <div className="flex flex-col gap-1 w-full px-4 bg-white rounded-xl shadow-sm">
                    <h2 className="text-md font-bold">{user?.firstName} {user?.lastName}</h2>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <SmartSticky onStickyChange={(stuck) => {
                        console.log("Sticky state changed:", stuck);
                        setStuck(stuck);    
                    }}>
                        {(stuck) => (
                            <div className={`w-full ${stuck ? "bg-gray-100 shadow-md" : ""} rounded-md transition-all duration-300`}>
                                <p className="text-sm text-gray-700">This is a sticky element. It is currently {stuck ? "stuck" : "not stuck"}.</p>
                            </div>
                        )}
                    </SmartSticky>
                    <div className="mt-4">
                        <p className="text-sm text-gray-700">Additional profile information can go here.</p>
                    </div>
                    {/* Long div to simulate scrolling */}
                    <div className="h-150 bg-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-700">This is a long div to simulate scrolling.</p>
                    </div>
                </div>
            </div>
    )
}