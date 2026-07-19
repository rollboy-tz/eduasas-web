import { EduBasicInput } from "@/components/inputs";
import { Info } from "lucide-react";
import { useState } from "react";

interface AddCustomProos {
    onSuccess: () => void;
    registerSubjects: (data: any) => void;
}

interface CustomSubject {
    customName: string;
    customCode: string;
}

export const AddCustomSubjectForm = ({ onSuccess, registerSubjects }: AddCustomProos) => {
    const [subjectData, setSubjectData] = useState<CustomSubject>({ customName: "", customCode: "" });
    const [submiting, setSubmiting] = useState(false);

    const handleSubmit = async () => {
        if (!subjectData.customName || !subjectData.customCode) return;
        
        setSubmiting(true);
        try {
            await registerSubjects([subjectData]);
            setSubjectData({ customName: "", customCode: "" });
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Failed to add subject", error);
        } finally {
            setSubmiting(false);
        }
    }

    return(
        <div className="w-full flex-col items-center gap-1 p-3 flex">
            <h3 className="w-full text-lg font-semibold mb-2">Add subject</h3>
            <div className="w-full flex flex-col">
                <div className="flex gap-1 bg-ring/70 border border-info/50 text-info/70 p-2 rounded-md mb-2 items-start">
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5"/>
                    <span className="text-[13px]">
                        Search the suggestions before adding a new subject. If no matching suggestion is found, enter the subject name and subject code below.
                    </span>
                </div>

                <div className="flex flex-col gap-4 p-2 bg-card border rounded-lg">
                    {/* Subject Name Input */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="subject-name" className="text-muted-foreground text-[13px]">Subject name</label>
                        <input
                            className="border border-border rounded h-9 focus:ring-2 focus:ring-primary px-2 outline-none"
                            type="text"
                            id="subject-name"
                            placeholder="e.g. History"
                            value={subjectData.customName}
                            onChange={(e) => setSubjectData({ ...subjectData, customName: e.target.value })}
                        />
                    </div>

                    {/* Subject Code Input */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="subject-code" className="text-muted-foreground text-[13px]">Subject code</label>
                        <input
                            className="border border-border rounded h-9 focus:ring-2 focus:ring-primary px-2 outline-none"
                            type="text"
                            id="subject-code"
                            placeholder="e.g. HIST-01"
                            value={subjectData.customCode}
                            onChange={(e) => setSubjectData({ ...subjectData, customCode: e.target.value })}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={submiting || !subjectData.customName || !subjectData.customCode}
                        className="w-full h-9 bg-primary text-primary-foreground rounded font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {submiting ? "Adding..." : "Add Subject"}
                    </button>
                </div>
            </div>
        </div>
    )
}