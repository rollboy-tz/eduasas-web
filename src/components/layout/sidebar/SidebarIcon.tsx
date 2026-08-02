"use client";

import React from "react";
import { HelpCircle } from "lucide-react";

import {
  cn
} from "@/lib/utils/helper";


interface SidebarIconProps {

  component?: React.ElementType;

  className?: string;

  size?: number;

}




export function SidebarIcon({

component:Icon,

className,

size=20

}:SidebarIconProps){



const IconComponent =
Icon || HelpCircle;



return (

<IconComponent

size={size}

className={cn(

"shrink-0",

className

)}

/>

)

}