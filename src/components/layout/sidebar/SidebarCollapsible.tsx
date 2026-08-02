"use client";

import {
  useEffect,
  useState
} from "react";

import Link from "next/link";
import {
  ChevronDown
} from "lucide-react";

import {
  cn
} from "@/lib/utils/helper";

import {
  SidebarIcon
} from "./SidebarIcon";

import {
  EduTooltip
} from "@/components/elements/edu-tooltip";



interface SidebarChild {

  title:string;

  href:string;

}



interface SidebarCollapsibleProps {

  title:string;

  icon:any;

  items:SidebarChild[];

  collapsed?:boolean;

  currentPath?:string;

}





export function SidebarCollapsible({

title,

icon,

items,

collapsed=false,

currentPath=""

}:SidebarCollapsibleProps){



const hasActiveChild =
items.some(
(item)=>
currentPath === item.href ||
currentPath.startsWith(
`${item.href}/`
)
);



const [open,setOpen]=
useState(hasActiveChild);





useEffect(()=>{

if(hasActiveChild){

setOpen(true);

}

},[hasActiveChild]);







const content = (

<div

className="
flex items-center
gap-3
w-full
cursor-pointer
"

>


<SidebarIcon
component={icon}
/>


{
!collapsed &&

<>

<span
className="
flex-1
text-left
truncate
"
>

{title}

</span>


<ChevronDown

size={16}

className={cn(

"transition-transform duration-200",

open &&
"rotate-180"

)}

/>

</>

}



</div>

);








return (

<div>


{/* COLLAPSED MODE */}

{
collapsed ?


<EduTooltip

content={title}

side="right"

>

<button

className="
w-full
flex
items-center
justify-center
h-10 cursor-pointer
rounded-md
text-muted-500
hover:bg-primary-50
hover:text-primary-600
transition-colors
"

>

<SidebarIcon
component={icon}
className={cn(

"shrink-0",

hasActiveChild

?

"text-primary-600"

:

"text-muted-700"

)}
/>


</button>


</EduTooltip>



:

<button

onClick={()=>setOpen(v=>!v)}

className={cn(

"flex items-center",

"w-full",

"h-11",

"px-3",

"rounded-xl",

"text-sm",

"font-medium",

"transition-colors",


hasActiveChild

?

"bg-primary-50 text-primary-600"

:

"text-muted-600 hover:bg-muted-100"

)}

>


{content}


</button>

}







{/* CHILDREN */}

{

!collapsed && open &&

<div

className="
mt-1
ml-5
pl-3
border-l
border-border
space-y-1
"

>

{

items.map((child)=>

{

const active =

currentPath === child.href ||

currentPath.startsWith(
`${child.href}/`
);



return (

<Link

key={child.href}

href={child.href}

className={cn(

"flex items-center",

"h-9",

"px-3",

"rounded-lg",

"text-sm",

"transition-colors",


active

?

"bg-primary-500 text-white"

:

"text-muted-500 hover:bg-muted-100 hover:text-muted-900"

)}

>


{child.title}


</Link>

)

})

}


</div>

}



</div>

)

}