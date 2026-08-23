'use client'
import { EduDateInput } from "@/components/fields/EduDateInput/EduDateInput"
import { EduInput } from "@/components/fields/EduInput"
import { EduSelect } from "@/components/fields/EduSelect"
import { IdCard } from "lucide-react"
import { useState } from "react"

const ContactsPage = () => {
    const [mode, setMode] = useState("");
    const options = [
        { value: "Dar Es Salaam", key: "Dar Es Salaam" },
        { value: "Tanga", key: "Tanga" },
        { value: "Arusha", key: "Arusha" },
        { value: "Pwani", key: "Pwani" },
        { value: "Dodoma", key: "Dodoma" },
        { value: "Mwanza", key: "Mwanza" },
        { value: "Mbeya", key: "Mbeya" },
        { value: "Iringa", key: "Iringa" },
        { value: "Kigoma", key: "Kigoma" },
        { value: "Mtwara", key: "Mtwara" }

    ]
    return (
        <>
            <h1>Contacts page</h1>
            <div className="flex items-center justify-center h-18">
                <div className="flex items-center gap-3">

                    {/* Mode */}
                    <div className="flex flex-col gap-2">
                        <h3 className="font-bold text-small">Region: {mode}</h3>
                        <EduInput
                            clearable={true}
                            value={mode}
                            type="id"
                            icon={IdCard}
                            onChange={(v: string) => { setMode(v as string) }}
                            className="w-50 bg-white shadow-sm"

                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ContactsPage;
