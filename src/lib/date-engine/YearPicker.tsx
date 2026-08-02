"use client";

import {
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import {
  cn
} from "@/lib/utils/helper";



interface YearPickerProps {


value?:string;


viewYear:number;


onChange:(year:string)=>void;


onNavigate:(year:number)=>void;


min?:string;


max?:string;


disabled?:boolean;


}




export function YearPicker({

value,

viewYear,

onChange,

onNavigate,

min,

max,

disabled

}:YearPickerProps){





/*
 12 years range
 mfano:
 2020 - 2031
*/


const startYear =
Math.floor(viewYear / 12) * 12;



const years =
Array.from(
{
length:12
},
(_,i)=>
startYear+i
);







function selectYear(
year:number
){


const result =
String(year);



if(
min &&
result < min.slice(0,4)
)

return;



if(
max &&
result > max.slice(0,4)
)

return;



onChange(result);


}






function previous(){

onNavigate(
startYear-12
);

}





function next(){

onNavigate(
startYear+12
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

onClick={previous}

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





<div

className="
text-sm

font-semibold

text-white

"

>

{startYear}

-

{startYear+11}


</div>





<button

type="button"

disabled={disabled}

onClick={next}

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







{/* Years */}


<div

className="
grid

grid-cols-3

gap-2

"

>



{

years.map(year=>{


const active =
value===String(year);



const blocked =

(min && String(year)<min.slice(0,4))

||

(max && String(year)>max.slice(0,4));





return (

<button

key={year}

type="button"

disabled={
Boolean(blocked)
||
disabled
}


onClick={()=>selectYear(year)}


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

{year}

</button>


)


})

}


</div>




</div>

)

}