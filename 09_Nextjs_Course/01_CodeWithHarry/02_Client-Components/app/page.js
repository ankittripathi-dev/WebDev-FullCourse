"use client";       // mandetory to put this for client side
import { useState } from "react";

const HomePage = () => {
  const [count, setCount] = useState(0);

  console.log("Run in Console Browser");

  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl">Count: {count}</h1>
      <button
        className="bg-red-600 rounded-md px-3 py-2 text-xl"
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Increment
      </button>
    </div>
  );
};
export default HomePage;
/*
Next.js me By-default sab Server Components hai. Koie vi hook ko use krne ke liye usko client components banana padta hai. client components banane ke liye 'use client' mention krna hota hai at the top of the code.
*/
