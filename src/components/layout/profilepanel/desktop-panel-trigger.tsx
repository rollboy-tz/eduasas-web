import { cn } from "@/lib/utils"

interface PanelTriggerProps {
    userName?: string;
    imageUrl?: string | null;
    userNameHidden?: boolean;
}

export const DesktopPanelTrigger = ( { userName = "User Name", imageUrl, userNameHidden = false } : PanelTriggerProps ) => {
    return(
        <button
            className={cn(
                "hidden lg:flex items-center gap-2 p-2 rounded-md cursor-pointer w-full hover:bg-muted-100",
                "justify-left"
            )}
        >
            <div className=" bg-primary-500 rounded-full items-center text-center h-7 w-7">
                U
            </div>

            {!userNameHidden && <span className="font-bold text-md">{userName}</span>}

        </button>
    )
}