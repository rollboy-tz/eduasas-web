'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { SubjectSuggestionContainer } from "./subject-suggetion";
import { ArrowDownWideNarrow, ArrowUpNarrowWide, BookText, Info, Search } from "lucide-react";
import { useSearch, useSort } from "@/hooks/layout";
import { useSubjects } from "@/hooks/school";
import { useAppStore } from "@/store/layout";
import { showConfirm } from "@/components/modals";
import { EduMainModal } from "@/components/elements";
import { cn } from "@/lib/utils";
import { SubjectsContainer } from "./school-sibjects";
import { EmptyState } from "@/components/feedback";
import { AddCustomSubjectForm } from "./elements/add-custom-form";


export function SubjectsPageView() {

    const [formOoen, setFormOpen] = useState(false)
    const isMobile = useAppStore(state => state.isMobileView);
    const [activeTab, setActiveTab] = useState<'suggested' | 'registered'>('suggested');

    //1. Data hooking
    const { data: allSubjects, registerSubjects } = useSubjects();

    //2. Serching
    const [regTerm, setRegTerm] = useState("");
    const registered = useSearch(allSubjects?.registered || [], regTerm, 200);

    const [sugTerm, setSugTerm] = useState("");
    const suggested = useSearch(allSubjects?.suggestions || [], sugTerm);


    //Sorting
    const { sorted: registaredSubjects } = useSort(registered, "name", "asc");
    const { sorted: suggestedSubjects, setDir: setSugDir, dir: sugDir } = useSort(suggested, "name", "asc");

    //Selection
    const [selectedSugeddtionIs, setSlectedSuggestinId] = useState<string[]>([])

    const startRegisterSuggested = () => {
        showConfirm({
            title: "Subject registration",
            message: `${selectedSugeddtionIs.length} subjects from suggetion will be added to your school, please comfirm it`,
            confirmLabel: "Comfirm",
            onConfirm() {
                console.log("Selected subject trigered");
            },
            variant: "neutral"
        })
    }

    //Subject registration
    const handleReegisterSuggested = () => {
        if (selectedSugeddtionIs.length === 0) return;
        const result = registerSubjects(selectedSugeddtionIs);
        setSlectedSuggestinId([]);
    }


    return (
        <>
            <div className="w-full max-w-7xl mx-auto  md:w-full h-[calc(100vh-80px)] flex flex-col p-4">

                {/* Tab Navigation (Mobile) */}
                <div className="flex md:hidden w-full border-b border-border ga-1 mb-3">
                    <button
                        onClick={() => setActiveTab('registered')}
                        className={cn("px-2 py-2 text-sm font-semibold transition-colors",
                            activeTab === 'registered' ? 'border-b border-primary text-primary-foreground' : 'text-muted-foreground')}
                    >
                        Registered
                    </button>

                    <button
                        onClick={() => setActiveTab('suggested')}
                        className={cn("px-2 py-2 text-sm font-semibold transition-colors",
                            activeTab === 'suggested' ? 'border-b border-primary text-primary-foreground' : 'text-muted-foreground')}
                    >
                        Suggested
                    </button>
                </div>

                {/* Layout Wrapper: Grid kwenye desktop, Relative container kwenye mobile */}
                <div className="w-full overflow-hidden relative">
                    <motion.div
                        className="flex h-full md:flex gap-4"
                        // Kwenye desktop, tunaondoa swipe kabisa
                        animate={{
                            x: isMobile ? (activeTab === 'registered' ? '0%' : '-50%') : 0
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        style={{ width: isMobile ? '200%' : '100%' }}
                    >
                        {/* 1. REGISTERED COLUMN */}
                        <div className="h-full w-[50%] md:flex-1 md:w-full flex flex-col bg-card border border-border rounded-sm overflow-hidden">
                            <div className="p-4 border-b font-bold">Registered Subjects</div>

                            <div className="flex-1 overflow-y-auto p-4 text-muted-foreground">
                                {
                                    registaredSubjects.length > 0 ? (
                                        <SubjectsContainer subjects={registaredSubjects} />
                                    ) : (
                                        <EmptyState
                                            title="No registered subjects"
                                            icon={BookText}
                                            description="No registered subjects yet. Please choose and add subjects from suggetion or add custom one below"
                                            action={
                                                <div>
                                                    <button onClick={() => setFormOpen(true)}
                                                        className="bg-primary text-white font-medium px-2.5 py-1.5 rounded shadow-sm hover:bg-primary/80 transition-all duration-200">
                                                        <span>Add custom subject</span>
                                                    </button>
                                                </div>
                                            }
                                        />
                                    )
                                }
                            </div>
                        </div>


                        {/* 2. SUGGESTED CONTAINER */}
                        <div className={`flex-col w-[50%] md:max-w-md bg-card rounded-sm border border-border h-full 
                    ${activeTab === 'suggested' ? 'flex' : 'hidden md:flex'}`}>

                            <div className="flex flex-col border-b border-border py-2.5 px-3">
                                <div className="flex items-center justify-between py-2 px-1.5">
                                    <div className="flex items-center gap-2 text-lg font-semibold">
                                        <h3>Suggested</h3>
                                        <span className="rounded-full h-5 w-5 flex items-center justify-center bg-primary text-white text-xs">{suggested.length}</span>
                                    </div>

                                    {selectedSugeddtionIs.length > 0 ?
                                        (
                                            <button onClick={() => startRegisterSuggested()} className="flex items-center items-center rounded-full bg-primary px-2.5 py-1.5 gap-2 shadow-sm">
                                                <span className="text-white font-semibold">Add selected</span>
                                                <span className="rounded-full h-5 w-5 flex items-center justify-center bg-white text-black text-xs">{selectedSugeddtionIs.length}</span>
                                            </button>
                                        ) : (
                                            <Info className="text-muted" size={16} />
                                        )}

                                </div>

                                <div className="flex items-center w-full">
                                    <div className="flex items-center w-full rounded mr-1 px-2 border border-border">
                                        <Search size={18} className="text-muted-foreground" />
                                        <input
                                            className="px-1.5 py-1 w-full bg-transparent focus:outline-none focus:ring-0"
                                            placeholder="Search suggested subj..."
                                            onChange={(e) => setSugTerm(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        onClick={() => setSugDir(sugDir === 'asc' ? 'desc' : 'asc')}
                                        className="p-2 rounded bg-secondary"
                                    >
                                        {sugDir === "asc" ? <ArrowDownWideNarrow size={18} /> : <ArrowUpNarrowWide size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto bg-card/5">

                                <SubjectSuggestionContainer suggestedSubjects={suggestedSubjects}
                                    onSelect={(selected) => setSlectedSuggestinId(selected)}
                                />

                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
            <EduMainModal
                onClose={() => setFormOpen(false)}
                isOpen={formOoen}
                className="w-full max-w-md py-1"
                children={
                    <AddCustomSubjectForm 
                        onSuccess={() => setFormOpen(false)}
                        registerSubjects={(data) => registerSubjects(data)}
                    />
                }
            />
        </>
    )
}