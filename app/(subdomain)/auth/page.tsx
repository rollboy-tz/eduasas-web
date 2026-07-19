'use client'

import { useState } from "react";
import { EduAsasLogo } from "@/components/ui/edu-asas-logo"
import { EduModernInput } from "@/components/ui/edu-modern-input";
import { UserIcon } from "lucide-react";
import { useToast } from "@/lib/store";

const AccountlePage = () => {

    const toast = useToast();

    const state = { loading: true, authenticated: false, unaunthenticated: false };
    const [valem, setValuem] = useState("Initial value")

    return(
        <main className="h-full w-full flex flex-col">
            <header className="flex justify-between items-center">
                {/* LOGO */}
                <EduAsasLogo
                  className="gap-1"
                  titleClasses="font-black text-xl"
                  asasClasses="text-primary-700"
                />

                <button className="rounded-full border px-3 py-1">
                    <></>
                </button>
            </header>
            <section className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-4 bg-card p-5">
                    <EduModernInput 
                        transform="none"
                        type="phone"
                        onChange={(v) => setValuem(v  as string ?? "")}
                        value={valem}
                        icon={<UserIcon size={20}/>}
                        showActionBtn={true}
                        actionClick={() => toast.show({ message: valem, type: "success" })}
                    />
                </div>
            </section>
        </main>
    )
}

export default AccountlePage