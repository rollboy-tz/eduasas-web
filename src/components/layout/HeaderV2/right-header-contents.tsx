import { EduFloatingDiv } from "@/components/modals"
import { useIsMobileView } from "@/store/layout"
import { useBadges } from "@/hooks/layout/use-badges"
import { Bell, ChevronDown, CommandIcon, Search, User } from "lucide-react"

export const RightHeaderContents = () => {
    const isMobile = useIsMobileView();
    const { getBadgeCount } = useBadges();
    const notCount = getBadgeCount("/notifications");
    return (
        <div className="flex items-center gap-3">
            <EduFloatingDiv
                trigger={
                    <button className="relative flex h-7 w-7 items-center justify-center bg-white rounded-md shadow-sm gap-1 px-1 cursor-pointer">
                            <Bell size={16} fill={notCount > 0 ? "muted-900" : "none"} />
                            {notCount > 0 && <span className="flex absolute bg-red-500 h-4 w-5 py-1 text-[10px] text-center items-center justify-center font-semibold text-white -top-1 -right-2 rounded-full">{notCount}</span>}
                    </button>
                }

                className="backdrop-blur-sm p-[2px] rounded-lg border border-muted-100/50"
            >
                <div className="bg-muted-100 p-2 rounded-md h-70 w-50">
                    Notifications
                </div>
            </EduFloatingDiv>


            {/* Serch togggle point */}
            <button className="flex items-center h-7 gap-1 p-1 rounded-md bg-white shadow-sm">
                <Search size={19} />
                {!isMobile && (
                    <div className="flex items-center gap-3">
                        <span className="bg-muted-50 text-sm text-muted-500 font-medium text-start font-medium rounded h-6 w-25 p-1">Search...</span>
                        <div className="flex items-center p-1 gap-1 bg-primary-100 h-5 rounded text-muted-500 font-semibold text-sm">
                            <CommandIcon size={14} /> <span className="font-semibold text-sm">K</span>
                        </div>
                    </div>
                )}
            </button>


            {/* User avatar point */}
            <EduFloatingDiv
                trigger={
                    <button className="flex h-7 items-center bg-white rounded-md shadow-sm gap-1 px-1 cursor-pointer">
                        <div className="rounded-full bg-primary/50 p-1">
                            <User size={16} fill="muted-900" />
                        </div>
                        <ChevronDown className="text-muted-400" size={15} />
                    </button>
                }

                className="backdrop-blur-sm p-[2px] rounded-lg border border-muted-100/50"
            >
                <div className="bg-muted-100 p-2 rounded-md h-70 w-50">
                    Profile
                </div>
            </EduFloatingDiv>
        </div>
    )
}