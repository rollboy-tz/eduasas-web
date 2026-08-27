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
  pad
} from "./dateUtils";



interface MonthPickerProps {


value?:string;


viewYear:number;


onChange:(value:string)=>void;


onYearChange:(year:number)=>void;


min?:string;


max?:string;


disabled?:boolean;

}




export function MonthPicker({

value,

viewYear,

onChange,

onYearChange,

min,

max,

disabled

}:MonthPickerProps){





const selectedMonth =

value

?

Number(
value.split("-")[1]
)

:

null;





function chooseMonth(
month:number
){


const result =
`${viewYear}-${pad(month+1)}`;



if(min && result < min.slice(0,7))
return;


if(max && result > max.slice(0,7))
return;



onChange(result);


}





function previousYear(){

onYearChange(
viewYear-1
);

}



function nextYear(){

onYearChange(
viewYear+1
);

}





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

onClick={previousYear}

className="
h-8
w-8

flex

items-center

justify-center

rounded-md

hover:bg-white/10

"

>

<ChevronLeft size={17}/>

</button>





<span

className="
text-sm
font-semibold
text-white
"

>

{viewYear}

</span>





<button

type="button"

disabled={disabled}

onClick={nextYear}

className="
h-8
w-8

flex

items-center

justify-center

rounded-md

hover:bg-white/10

"

>

<ChevronRight size={17}/>

</button>



</div>






{/* Months */}

<div

className="
grid

grid-cols-3

gap-2

"

>


{

MONTHS.map(
(month,index)=>{


const current =
`${viewYear}-${pad(index+1)}`;



const active =
selectedMonth===index+1;




const blocked =

(min && current < min.slice(0,7))

||

(max && current > max.slice(0,7));





return (

<button

key={month}

type="button"

disabled={
Boolean(blocked) ||
disabled
}


onClick={()=>chooseMonth(index)}


className={cn(

"rounded-md",

"py-2",

"text-xs",

"transition-all",

"text-muted-300",



"hover:bg-white/10",



active &&

"bg-primary-500 text-white",



blocked &&

"opacity-30 cursor-not-allowed"

)}

>


{month.slice(0,3)}


</button>


)



}

)


}


</div>





</div>


)

}