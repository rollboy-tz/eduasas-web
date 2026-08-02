"use client";

import { usePathname } from "next/navigation";
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils/helper";

import { useSidebar } from "@/context/sidebar-context";

import { SidebarComposer } from "./sidebar-composer";

import { sidebarMockData } from "@/data/sidebar.mock";
import { EduAsasLogo } from "@/components/ui";



interface SidebarContainerProps {

  menuData?: any[];

}





export default function SidebarContainer({

menuData = sidebarMockData

}:SidebarContainerProps){



const pathname = usePathname();


const {

isCollapsed,

isMobileOpen,

toggleCollapse,

toggleMobile

}=useSidebar();





return (

<>



{/* MOBILE OVERLAY */}

{

isMobileOpen && (

<div

onClick={toggleMobile}

className="
fixed
inset-0
z-40
bg-black/40
backdrop-blur-sm
lg:hidden
"

/>

)

}





<aside

className={cn(

"fixed lg:static",

"top-0 left-0",

"h-screen",

"z-50",

"flex flex-col",

"bg-card",

"border-r border-border",

"transition-all duration-300",

// "overflow-hidden",



/* MOBILE */

isMobileOpen

?

"translate-x-0 w-72"

:

"-translate-x-full lg:translate-x-0",



/* DESKTOP */

isCollapsed

?

"lg:w-[80px]"

:

"lg:w-70"

)}

>




{/* HEADER */}

<div

className="
h-12
flex
items-center
justify-between
px-4
"

>


<EduAsasLogo

titleHiden={isCollapsed}
titleClasses="font-black tracking-wide"

/>



<button

onClick={toggleMobile}

className="
lg:hidden
p-2
rounded-lg
hover:bg-muted-100
dark:hover:bg-muted-800
"

>

<X size={18}/>

</button>



</div>







{/* MENU AREA */}

<nav

className="
flex-1
overflow-y-auto
custom-scrollbar
p-3
"

>


<SidebarComposer

menuData={menuData}

currentPath={pathname}

collapsed={isCollapsed}

/>


</nav>








{/* FOOTER */}

<div

className="
border-t
border-border
p-3
"

>


<button

onClick={toggleCollapse}

className="
hidden
lg:flex
w-full
items-center
justify-center
gap-2
rounded-xl
py-2.5
text-sm
text-muted-500
hover:bg-muted-100
dark:hover:bg-muted-800
transition
"

>


{

isCollapsed

?

<ChevronRight size={18}/>

:

<>

<ChevronLeft size={18}/>

<span>
Collapse
</span>

</>

}



</button>


</div>







</aside>


</>

)

}