"use client";
import { useState } from "react";

const Home = () => {
  const [num, setNum] = useState(0);
  console.log("num:", num);
  
  return (
    <div className="text-center text-2xl mt-5">
      <h1>Value of Num: {num}</h1>
      <button
        className="bg-red-600 p-1 rounded-md text-2xl mt-2"
        onClick={() => setNum(num + 1)}
      >
        Increment
      </button>
    </div>
  );
};

export default Home;
