// 'use client'  // server components me client components nhi use kr skte.
import Navbar from "@/components/Navbar";
import fs from "fs/promises";

const HomePage = () => {
  // Notes:- Yaha BackEnd wala logic likh skte ho, Agar aapka server components hai like below.
  console.log("Hey I am Ankit");
  let a = fs.readFile(".gitignore");
  a.then((e) => console.log(e.toString()));

  return (
    <div>
      <Navbar />
      <h1 className="text-2xl text-center">I am a Components</h1>
    </div>
  );
};
export default HomePage;

/*
Notes: 
(1) Nextjs me By-Default Sab Server Components hai.
(2) Server me dikhega jo likhe hai Sab Server wala logic. Agar client components hota toh hm log use nhi kr paate..
(3) Serevr wala answer terminal me dikhega aur console me Server likh ke..
(4) Suppose that hame Navbar me hook use krna hai.. jo ke client components hai, toh Shirf Navbar ka Ek alag components bana ke 'use client' ka use kr ke serevr components me le jake Embedded kr skte hai..
*/
