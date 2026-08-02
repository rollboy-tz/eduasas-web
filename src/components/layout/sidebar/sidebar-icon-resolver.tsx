"use client";

import * as Icons from "lucide-react";


export function resolveSidebarIcon(
name:string
){

return (

(Icons as unknown as Record<
string,
React.ElementType
>)[name]

||
Icons.HelpCircle

);

}