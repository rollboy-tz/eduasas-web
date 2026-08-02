import { Outdent, LogOutIcon, LucideSquareArrowOutUpRight, LucideCircleArrowOutUpRight } from "lucide-react"


export const DesktopProfilePanel = () => {
    return(
        <div className="bg-card shadow-lg rounded-lg p-2 flex flex-col">
            <div className="flex w-full gap-2 items-center">
                <div className="bg-primary-400 h-8 w-8 text-center items-center rounded-full mb-2">
                    <h2 className="font-black">U</h2>
                </div>
                <h3 className="font-bold">User Name</h3>
            </div>
            <button className="bg-red-500/10 hover:bg-red-500/20 rounded-sm text-red-500 w-full p-1 text-left cursor-pointer">
                Log out
            </button>
        </div>
    )
}