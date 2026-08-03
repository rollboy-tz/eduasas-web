import { text } from "@/lib/string";
import { UserAffiliatedSchool } from "@/types/dash";
import { ArrowRight, Check, CheckCircle, CircleDashed, LayersPlusIcon, Outdent } from "lucide-react"
interface SetupCompletedCardProps {
    school?: UserAffiliatedSchool;
    onButtonClick?: () => void;
}
export const SchoolSetuCompletdCard = ({ school, onButtonClick }: SetupCompletedCardProps ) => {
    if (!school) return null;

    return (
        <div className="flex flex-col py-10">
            <div className="flex flex-col items-center justify-center">
                <div className="rounded-full bg-green-500/20 p-3 mb-5">
                    <div className="rounded-full bg-green-500/80 p-2">
                        <Check className="text-white" strokeWidth={3} size={30} />
                    </div>
                </div>
                <h2 className="font-heading font-black text-xl text-green-600 my-2">Setup Completed!</h2>
                <h3 className="font-heading font-bold text-sm">{text.upperCase(school.name)}</h3>
                <p className="text-xs text-muted-500">Is now active and workspace is ready to use.</p>
                <div className="rounded-md flex items-center justify-between gap-10 bg-green-100 border border-green-500 p-2 mt-6">
                    <div className="flex items-center gap-2">
                        <LayersPlusIcon size={20} className="text-green-900" />
                        <h3 className="font-heading font-bold text-sm text-green-900">Add school</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-green-700 text-[10px] font-medium">Complete</h3>
                        <CheckCircle size={14} strokeWidth={2} className="text-green-900" />
                    </div>
                </div>

                <div className="rounded-md flex items-center justify-between gap-7 bg-green-100 border border-green-500 p-2 mt-1">
                    <div className="flex items-center gap-2">
                        <LayersPlusIcon size={20} className="text-green-900" />
                        <h3 className="font-heading font-bold text-sm text-green-900">Setup school</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-green-700 text-[10px] font-medium">Complete</h3>
                        <CheckCircle size={14} strokeWidth={2} className="text-green-900" />
                    </div>
                </div>

                <button className="bg-blue-600 text-white font-medium py-2 px-8 text-sm flex items-center cursor-pointer gap-9 mt-5 rounded-md shadow-sm hover-bg-blue-400 transisition-all active:scale-99"
                    onClick={onButtonClick}
                >
                    <span>
                        Open Workspace
                    </span>
                    <ArrowRight size={18}/>
                </button>
            </div>

        </div>
    )
}