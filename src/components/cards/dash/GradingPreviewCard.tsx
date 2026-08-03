import { cn } from "@/lib/utils";
import { CompatibleGradingRule, GradingRange } from "@/types/school";
import { AlertCircle } from "lucide-react";
import { JSX } from "react/jsx-runtime";

interface GadingPreviewCardProps {
    selectedRule?: CompatibleGradingRule;
}

export const GadingPreviewCard = ({ selectedRule }: GadingPreviewCardProps): JSX.Element | null => {

    if (!selectedRule) return null;

    const hasPoints = selectedRule?.ranges.some((r: GradingRange) => r.points !== null && r.points !== undefined);

    return (
        <div className="flex flex-col items-center ustify-center gap-5 py-3">
            <div className="w-full space-y-1">
                <h3 className="font-heading font-black">
                    Grading Preview
                </h3>

                <div className="mt-2 flex items-start gap-2 rounded-md bg-blue-50/60 px-3 py-2.5">
                    <AlertCircle
                        size={15}
                        className="mt-0.5 shrink-0 text-blue-600"
                    />

                    <p className="text-xs leading-5 text-muted-700">
                        This grading system will be used for result processing. Additional
                        grading systems can be created after your workspace is active.
                    </p>
                </div>
            </div>
            <div className="p-1 bg-white/90 w-full rounded-md">
                <table className="w-full text-left border-separate border-spacing-0 bg-card">
                    <thead>
                        <tr className="bg-muted/40">
                            <th className="p-4 text-sm font-old text-muted-500">Grade</th>
                            <th className="p-4 text-sm font-bold text-muted-500">Range</th>
                            {hasPoints && <th className="p-4 text-sm font-bold text-muted-500">Points</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                        {selectedRule.ranges.map((r: GradingRange) => (
                            <tr key={r.id} className="hover:bg-muted-200 rounded-md">
                                <td className={cn("p-4 text-sm font-bold", r.isPass ? "text-green-500" : "text-red-500")}>{r.grade}</td>
                                <td className="p-4 text-sm text-muted-foreground">{r.minMark} - {r.maxMark}</td>
                                {hasPoints && <td className="p-4 text-[11px] text-muted-foreground">{r.points || "0"}</td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}