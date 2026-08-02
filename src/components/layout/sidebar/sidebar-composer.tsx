"use client";

import { memo, useMemo } from "react";

import { SidebarGroup } from "./SidebarGroup";
import { SidebarLink } from "./SidebarLink";
import { SidebarCollapsible } from "./SidebarCollapsible";

import {
  resolveSidebarIcon
} from "./sidebar-icon-resolver";



export interface MenuChild {

  title:string;

  href:string;

}



export interface MenuItem {

  title:string;

  href?:string;

  icon:string;

  badge?:number;

  items?:MenuChild[];

}



export interface MenuGroup {

  label:string;

  items:MenuItem[];

}




interface SidebarComposerProps {

  menuData:MenuGroup[];

  currentPath:string;

  collapsed?:boolean;

}





export const SidebarComposer = memo(({

menuData,

currentPath,

collapsed=false

}:SidebarComposerProps)=>{



const groups = useMemo(()=>{


return menuData.map((group)=>({


...group,


items:group.items.map((item)=>({


...item,


iconComponent:
resolveSidebarIcon(item.icon),



active:

item.href

?

(
currentPath === item.href ||

currentPath.startsWith(
`${item.href}/`
)

)

:

false



}))



}))



},[
menuData,
currentPath
]);






return (

<>

{

groups.map((group)=>(


<SidebarGroup

key={group.label}

label={group.label}

collapsed={collapsed}

className="mb-3"

>


{

group.items.map((item)=>{


if(
item.items &&
item.items.length > 0
){


return (

<SidebarCollapsible

key={item.title}

title={item.title}

icon={item.iconComponent}

items={item.items}

collapsed={collapsed}

currentPath={currentPath}

/>

)

}





return (

<SidebarLink

key={item.title}

title={item.title}

href={item.href || "#"}

icon={item.iconComponent}

badge={item.badge}

active={item.active}

collapsed={collapsed}

/>

)


})


}



</SidebarGroup>


))


}

</>

)


});



SidebarComposer.displayName =
"SidebarComposer";