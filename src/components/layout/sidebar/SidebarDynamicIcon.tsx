"use client";

import * as Icons from "lucide-react";



interface Props {

name:string;

size?:number;

className?:string;

}



export function SidebarDynamicIcon({

name,

size=20,

className

}:Props){



const IconComponent =

(Icons as unknown as Record<
string,
React.ElementType
>)[name];



if(!IconComponent){

const Fallback =
Icons.HelpCircle;


return (

<Fallback

size={size}

className={className}

/>

)

}




return (

<IconComponent

size={size}

className={className}

/>

)

}