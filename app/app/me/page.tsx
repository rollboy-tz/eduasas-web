'use client'
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const HomePage = () => {
 return(
    <main className="w-full h-screen flex flex-col">
      <header className="w-full">
         <p>Home</p>
      </header>
    </main>
 )
}

export default HomePage;