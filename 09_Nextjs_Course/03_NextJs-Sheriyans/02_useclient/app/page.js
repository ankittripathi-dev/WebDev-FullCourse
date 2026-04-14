"use client";
import { useState } from "react";

const Home = () => {
  const [num, setNum] = useState(0);
  
  return (
    <div className="text-center">
      <h2>Value of Num:{num}</h2>
      <button
        className="bg-red-600 p-1 rounded-md"
        onClick={() => setNum(num + 1)}
      >
        Increment
      </button>
    </div>
  );
};

export default Home;
