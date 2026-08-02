export type DateMode =
  | "date"
  | "month"
  | "year";



export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];



export const WEEK_DAYS = [
  "Mo",
  "Tu",
  "We",
  "Th",
  "Fr",
  "Sa",
  "Su",
];



export function pad(
  value:number
){

return value
.toString()
.padStart(2,"0");

}





export function createDate(
value?:string
){

if(!value)
return new Date();


const parts =
value.split("-")
.map(Number);


if(parts.length===1){

return new Date(parts[0],0,1);

}


if(parts.length===2){

return new Date(
parts[0],
parts[1]-1,
1
);

}


return new Date(
parts[0],
parts[1]-1,
parts[2]
);

}





export function formatValue(
date:Date,
mode:DateMode
){

const year =
date.getFullYear();


const month =
pad(
date.getMonth()+1
);


const day =
pad(
date.getDate()
);



if(mode==="year")
return `${year}`;



if(mode==="month")
return `${year}-${month}`;



return `${year}-${month}-${day}`;

}






export function formatDisplay(
value:string,
mode:DateMode
){

if(!value)
return "";



const date =
createDate(value);



if(mode==="year"){

return `${date.getFullYear()}`;

}




if(mode==="month"){

return `${MONTHS[
date.getMonth()
]} ${date.getFullYear()}`;

}




return `${date.getDate()} ${
MONTHS[
date.getMonth()
]
} ${
date.getFullYear()
}`;

}







export function isLeapYear(
year:number
){

return (
year % 4 === 0 &&
year % 100 !==0
)
||
year % 400 ===0;

}







export function daysInMonth(
year:number,
month:number
){

return new Date(
year,
month + 1,
0
)
.getDate();

}







export function isValidDate(
year:number,
month:number,
day:number
){


return (

day > 0 &&

day <= daysInMonth(
year,
month
)

);

}








export function validateDateValue(
value:string,
mode:DateMode,
min?:string,
max?:string
){

if(!value)
return "";



if(mode==="year"){

const year =
Number(value);


if(
year < 1000 ||
year > 9999
){

return "Invalid year";

}


return "";

}




if(mode==="month"){

const [year,month]=
value
.split("-")
.map(Number);



if(
!year ||
!month ||
month < 1 ||
month > 12
){

return "Invalid month";

}


}






if(mode==="date"){

const [
year,
month,
day

]=
value
.split("-")
.map(Number);



if(
!isValidDate(
year,
month-1,
day
)
){

return "Invalid date";

}


}




if(min && value < min)

return "Date is before allowed range";




if(max && value > max)

return "Date is after allowed range";




return "";

}






export function getCalendarDays(
date:Date
){

const year =
date.getFullYear();


const month =
date.getMonth();


const total =
daysInMonth(
year,
month
);



let start =
new Date(
year,
month,
1
)
.getDay();


// JS starts Sunday
// tunafanya Monday kuwa mwanzo

start =
start===0
?
6
:
start-1;



return {

year,

month,

total,

start

};

}