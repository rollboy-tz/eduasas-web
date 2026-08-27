"use client";

import { useState } from "react";

import {
  EduModernDateInputV4
} from "@/components/fields/EduModernDateInputV4";



export default function EduModernDateInputPlayground() {


  const [birthday, setBirthday] =
    useState("");


  const [invoiceMonth, setInvoiceMonth] =
    useState("");


  const [graduationYear, setGraduationYear] =
    useState("");



  const [customDate, setCustomDate] =
    useState("");



  const [rangeDate, setRangeDate] =
    useState("");





  return (

    <div

      className="
min-h-screen
bg-muted-950
text-white
p-8
space-y-10
"

    >



      <header>

        <h1

          className="
text-2xl
font-bold
"

        >

          EduModernDateInput V4 Playground

        </h1>


        <p

          className="
text-sm
text-muted-400
mt-2
"

        >

          Testing ISO values, display formats and validation

        </p>


      </header>








      {/* DATE */}

      <section

        className="
max-w-md
space-y-3
"

      >


        <h2

          className="
text-sm
font-semibold
text-muted-400
"

        >

          Birthday Date

        </h2>



        <EduModernDateInputV4


          mode="date"


          value={birthday}


          onChange={setBirthday}


          placeholder="Select birthday"


          displayFormat="DD MMM YYYY"


          showSuccess


          successMessage="Date accepted"



        />





        <ValueBox

          label="Backend value"

          value={birthday}

        />



      </section>









      {/* MONTH */}

      <section

        className="
max-w-md
space-y-3
"

      >


        <h2

          className="
text-sm
font-semibold
text-muted-400
"

        >

          Subscription Month

        </h2>




        <EduModernDateInputV4


          mode="month"


          value={invoiceMonth}


          onChange={setInvoiceMonth}


          placeholder="Select month"


          displayFormat="MMMM YYYY"



        />





        <ValueBox

          label="Backend value"

          value={invoiceMonth}

        />



      </section>









      {/* YEAR */}

      <section

        className="
max-w-md
space-y-3
"

      >


        <h2

          className="
text-sm
font-semibold
text-muted-400
"

        >

          Graduation Year

        </h2>




        <EduModernDateInputV4


          mode="year"


          value={graduationYear}


          onChange={setGraduationYear}


          placeholder="Select year"



        />






        <ValueBox

          label="Backend value"

          value={graduationYear}

        />



      </section>









      {/* FORMAT TEST */}

      <section

        className="
max-w-md
space-y-3
"

      >


        <h2

          className="
text-sm
font-semibold
text-muted-400
"

        >

          Custom Display Format

        </h2>




        <EduModernDateInputV4


          mode="date"


          value={customDate}


          onChange={setCustomDate}


          displayFormat="MM/DD/YYYY"


          placeholder="American format"



        />





        <ValueBox

          label="ISO value"

          value={customDate}

        />



      </section>









      {/* VALIDATION */}

      <section

        className="
max-w-md
space-y-3
"

      >


        <h2

          className="
text-sm
font-semibold
text-muted-400
"

        >

          Date Range Validation

        </h2>




        <EduModernDateInputV4


          mode="date"


          value={rangeDate}


          onChange={setRangeDate}


          placeholder="Between 2020 - 2030"


          min="2020-01-01"


          max="2030-12-31"


          displayFormat="DD MMM YYYY"



        />






        <ValueBox

          label="Validated value"

          value={rangeDate}

        />



      </section>








      {/* MULTIPLE ALIGNMENT */}

      <section

        className="
grid
grid-cols-1
md:grid-cols-2
gap-5
max-w-3xl
"

      >


        <EduModernDateInputV4


          mode="date"


          placeholder="Start date"


          value={birthday}


          onChange={setBirthday}


        />




        <EduModernDateInputV4


          mode="month"


          placeholder="Billing month"


          value={invoiceMonth}


          onChange={setInvoiceMonth}


        />



      </section>







    </div>

  );

}









function ValueBox({

  label,

  value

}: {

  label: string;

  value: string;

}) {


  return (

    <div

      className="
rounded-md
bg-muted-900
border
border-muted-800
p-3
"

    >


      <div

        className="
text-[10px]
uppercase
tracking-wider
text-muted-500
"

      >

        {label}

      </div>


      <code

        className="
text-xs
text-primary-400
break-all
"

      >

        {value || "empty"}

      </code>



    </div>

  );


}