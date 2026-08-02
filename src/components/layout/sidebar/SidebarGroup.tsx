"use client";

import {
  ReactNode
} from "react";

import {
  cn
} from "@/lib/utils/helper";


interface SidebarGroupProps {

  label?: string;

  children: ReactNode;

  collapsed?: boolean;

  className?: string;

}



export function SidebarGroup({

  label,

  children,

  collapsed=false,

  className

}:SidebarGroupProps){


return (

<section

className={cn(

"space-y-2",

className

)}

>


{
label && !collapsed && (

<div

className="
px-3
mb-1
"

>

<p

className="
text-[10px]
font-semibold
uppercase
tracking-[0.12em]
text-muted-400
dark:text-muted-500
"

>

{label}

</p>


</div>

)

}



<div

className="
space-y-1
"

>

{children}

</div>


</section>

)

}