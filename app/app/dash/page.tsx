'use client'

import { useState } from "react";
import { useToast } from "@/lib/store";
import { UserIcon } from "lucide-react";
import { EduMainModal } from "@/components/modals";
import { EduAsasLogo } from "@/components/ui/edu-asas-logo"
import { EduModernInput } from "@/components/fields/edu-modern-input";
import { SchoolAdddeCard } from "@/components/cards/dash/SchoolAddedCard";

const DashPage = () => {

    const toast = useToast();

    const state = { loading: true, authenticated: false, unaunthenticated: false };
    const [valem, setValuem] = useState("Initial value")
    const [modalopen, setModalOpen] = useState(true);

    return (
        <>
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
                            type="phone"
                            onChange={(v) => setValuem(v as string ?? "")}
                            value={valem}
                            icon={UserIcon}
                            showActionBtn={true}
                            actionClick={() => toast.show({ message: valem, type: "success" })}
                        />
                    </div>
                </section>
            </main>
            
        </>

    )
}

export default DashPage;