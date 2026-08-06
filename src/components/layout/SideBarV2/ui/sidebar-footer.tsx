// /**
//  * ============================================================================
//  * EduAsas Sidebar V2 - Footer
//  * ============================================================================
//  *
//  * Footer section yenye user profile trigger.
//  *
//  * Inaunganisha SidebarPopover kwa ajili ya:
//  *
//  * - Profile menu
//  * - Settings
//  * - Account actions
//  *
//  * @version 2.0.0
//  */

// "use client";


// import {
//   UserRound,
//   ChevronRight,
//   User,
//   Settings,
//   LogOut,
// } from "lucide-react";


// import {
//   cn,
// } from "@/lib/utils";


// import {
//   useSidebar,
// } from "../use-sidebar";


// import {
//   SidebarPopover,
// } from "./sidebar-popover";



// /**
//  * Profile menu content.
//  */
// function ProfileMenu() {


//   return (

//     <div
//       className="
//         flex
//         flex-col
//         gap-1
//       "
//     >

//       <button
//         className="
//           flex
//           items-center
//           gap-3
//           rounded-lg
//           px-3
//           py-2
//           text-sm
//           hover:bg-muted
//         "
//       >

//         <User
//           className="h-4 w-4"
//         />

//         Profile

//       </button>



//       <button
//         className="
//           flex
//           items-center
//           gap-3
//           rounded-lg
//           px-3
//           py-2
//           text-sm
//           hover:bg-muted
//         "
//       >

//         <Settings
//           className="h-4 w-4"
//         />

//         Settings

//       </button>



//       <div
//         className="
//           my-1
//           h-px
//           bg-border
//         "
//       />



//       <button
//         className="
//           flex
//           items-center
//           gap-3
//           rounded-lg
//           px-3
//           py-2
//           text-sm
//           text-destructive
//           hover:bg-destructive/10
//         "
//       >

//         <LogOut
//           className="h-4 w-4"
//         />

//         Logout

//       </button>


//     </div>

//   );

// }



// /**
//  * Sidebar Footer.
//  */
// export function SidebarFooter() {


//   const {
//     size,
//   } = useSidebar();



//   const expanded =
//     size === "expanded";



//   const trigger = (

//     <div
//       className={cn(

//         "flex",

//         "w-full",

//         "items-center",

//         "rounded-xl",

//         "transition-all",

//         "hover:bg-muted",


//         expanded

//           ? [
//               "gap-3",
//               "px-3",
//               "py-2.5",
//             ]

//           : [
//               "justify-center",
//               "p-2.5",
//             ],

//       )}
//     >

//       {/* Avatar */}
//       <div
//         className="
//           flex
//           h-9
//           w-9
//           shrink-0
//           items-center
//           justify-center
//           rounded-full
//           bg-muted
//         "
//       >

//         <UserRound
//           className="
//             h-4
//             w-4
//           "
//         />

//       </div>



//       {
//         expanded && (

//           <>

//             <div
//               className="
//                 flex
//                 flex-1
//                 flex-col
//                 items-start
//                 overflow-hidden
//               "
//             >

//               <span
//                 className="
//                   truncate
//                   text-sm
//                   font-medium
//                 "
//               >
//                 John Doe
//               </span>


//               <span
//                 className="
//                   text-xs
//                   text-muted-foreground
//                 "
//               >
//                 Administrator
//               </span>

//             </div>



//             <ChevronRight
//               className="
//                 h-4
//                 w-4
//                 text-muted-foreground
//               "
//             />

//           </>

//         )
//       }


//     </div>

//   );



//   return (

//     <div
//       className="
//         mt-auto
//         px-3
//         pb-3
//       "
//     >

//       <SidebarPopover
//         trigger={trigger}
//       >

//         <ProfileMenu />

//       </SidebarPopover>


//     </div>

//   );

// }