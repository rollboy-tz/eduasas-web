import { JSX } from "react/jsx-runtime";
import { DateUtils } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { AlertCircle, Calendar, CalendarCheck2 } from "lucide-react";

interface SchoolSetupPayload {
    primaryGrading?: string;
    year: {
        value: number;
        startDate: string;
        endDate: string;
    };
    terms: TermType[];
}

interface SetUpPreviewCardProps {
    dataPayload?: SchoolSetupPayload;
    onSave?: () => void;
    onClose?: () => void;
    onTermChange?: (order: number) => void;
}

export const SetUpPreviewCard = ({
    dataPayload,
    onSave,
    onClose,
    onTermChange
}: SetUpPreviewCardProps): JSX.Element | null => {

    if (!dataPayload) return null;

    return (
        <div className="w-full flex flex-col gap-5 px-1 py-2">

            <div className="space-y-1.5">
                <h2 className="font-heading text-base font-bold">
                    Review School Setup
                </h2>

                <div className="flex items-start gap-2 rounded-md border border-gray-300 bg-muted-100 px-3 py-2.5">
                    <AlertCircle
                        size={15}
                        className="mt-0.5 shrink-0 text-gray-500"
                    />

                    <p className="text-xs leading-5 text-muted-700">
                        The first academic term has been selected as the current term by
                        default. Please confirm or choose another term before saving, as it
                        will be used as the active academic period for this workspace.
                    </p>
                </div>

                <p className="text-xs font-medium text-muted-700">
                    Academic Year{" "}
                    <span className="font-bold text-blue-700">
                        {dataPayload.year.value}
                    </span>
                </p>
            </div>


            <div className="flex flex-col gap-2">
                {
                    dataPayload.terms.map(term => (
                        <Term
                            key={term.order}
                            data={term}
                            onClick={() => onTermChange?.(term.order)}
                        />
                    ))
                }
            </div>

            <div className="mt-4 flex flex-col gap-3">

                <p className="text-[11px] text-muted-500">
                    Make sure the selected current term is correct before saving.
                </p>
                <div className="flex items-center justify-between gap-2">

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 h-9 px-3 rounded-md bg-muted-200 text-sm font-medium text-muted-600 hover:text-muted-700 transition-colors cursor-pointer"
                    >
                        Close
                    </button>

                    <button
                        type="button"
                        onClick={onSave}
                        className="flex-1 h-9 px-4 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                        Save Setup
                    </button>
                </div>

            </div>

        </div>
    )
};


type TermType = {
    name: string;
    startDate: string;
    endDate: string;
    order: number;
    isCurrent: boolean;
};


interface TermProps {
    data: TermType;
    onClick?: () => void;
}


export const Term = ({
    data,
    onClick
}: TermProps): JSX.Element => {

    const status = data.isCurrent
        ? {
            label: "Current",
            icon: CalendarCheck2,
            className: "text-green-600 bg-green-50"
        }
        : {
            label: "Scheduled",
            icon: Calendar,
            className: "text-muted-500 bg-muted-50"
        };


    const StatusIcon = status.icon;


    return (
        <button
            type="button"
            onClick={onClick}
            className="
                w-full flex items-center justify-between gap-3 
                px-2 py-2.5 rounded-lg cursor-pointer
                hover:bg-white transition-colors
            "
        >

            <div className="flex items-center gap-3">

                <div>
                    <Calendar
                        size={22}
                        className="text-muted-400"
                    />
                </div>


                <div className="flex flex-col text-left">

                    <span className="text-sm font-semibold">
                        {data.name}
                    </span>

                    <span className="text-[11px] text-muted-500">
                        {DateUtils.formatCustom(data.startDate)}
                        {" - "}
                        {DateUtils.formatCustom(data.endDate)}
                    </span>

                </div>

            </div>


            <div
                className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full",
                    "text-[10px] font-semibold",
                    status.className
                )}
            >
                <StatusIcon size={12} />

                {status.label}
            </div>


        </button>
    )
}