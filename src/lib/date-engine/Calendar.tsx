"use client";

import {
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import {
  cn
} from "@/lib/utils/helper";

import {
  MONTHS,
  WEEK_DAYS,
  getCalendarDays,
  daysInMonth,
  pad
} from "./dateUtils";



interface CalendarProps {

  value?:string;

  viewDate:Date;

  onChange:(value:string)=>void;

  onNavigate:(date:Date)=>void;

  min?:string;

  max?:string;

  disabled?:boolean;

}






export function Calendar({

value,

viewDate,

onChange,

onNavigate,

min,

max,

disabled

}:CalendarProps){



const {

year,

month,

total,

start

}=getCalendarDays(viewDate);





function selectDay(
day:number
){


const selected =
`${year}-${pad(month+1)}-${pad(day)}`;



if(min && selected < min)
return;


if(max && selected > max)
return;



onChange(selected);


}







function previousMonth(){


onNavigate(

new Date(
year,
month-1,
1
)

);


}




function nextMonth(){


onNavigate(

new Date(
year,
month+1,
1
)

);


}





const selectedDay =
value
?
Number(
value.split("-")[2]
)
:
null;



return (

<div

className="
w-72

rounded-lg

border

border-muted-800

bg-muted-950

p-3

shadow-xl

"

>


{/* Header */}

<div

className="
flex

items-center

justify-between

mb-4

"

>


<button

type="button"

disabled={disabled}

onClick={previousMonth}

className="
h-8

w-8

flex

items-center

justify-center

rounded-md

hover:bg-white/10

transition

"

>

<ChevronLeft size={17}/>

</button>




<div

className="
text-sm

font-semibold

text-white

"

>

{

MONTHS[month]

}

{" "}

{year}


</div>




<button

type="button"

disabled={disabled}

onClick={nextMonth}

className="
h-8

w-8

flex

items-center

justify-center

rounded-md

hover:bg-white/10

transition

"

>

<ChevronRight size={17}/>

</button>


</div>






{/* Week names */}

<div

className="
grid

grid-cols-7

mb-2

"

>


{
WEEK_DAYS.map(day=>(

<div

key={day}

className="
text-center

text-[10px]

text-muted-500

font-medium

"

>

{day}

</div>

))

}


</div>






{/* Days */}

<div

className="
grid

grid-cols-7

gap-1

"

>





{

Array.from({
length:start
})

.map((_,index)=>(


<div
key={`empty-${index}`}
/>


))

}





{

Array.from({
length:total
})

.map((_,index)=>{


const day =
index+1;



const current =
`${year}-${pad(month+1)}-${pad(day)}`;



const isSelected =
selectedDay===day;



const isDisabled =

(min && current < min)

||

(max && current > max);




return (

<button

key={day}

type="button"

disabled={
Boolean(isDisabled)
||
disabled
}

onClick={()=>selectDay(day)}

className={cn(

"h-8",

"w-8",

"rounded-md",

"text-xs",

"transition-all",

"hover:bg-white/10",

"text-muted-300",


isSelected &&

"bg-primary-500 text-white shadow-lg",


isDisabled &&

"opacity-30 cursor-not-allowed"

)}

>


{day}


</button>

)


})


}



</div>





{/* Today */}

<button

type="button"

disabled={disabled}

onClick={()=>{


const today =
new Date();


onNavigate(

new Date(
today.getFullYear(),
today.getMonth(),
1
)

);


onChange(

`${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`

);


}}

className="
mt-4

w-full

rounded-md

bg-white/5

py-2

text-xs

text-primary-400

hover:bg-white/10

transition

"

>

Today

</button>



</div>

)

}