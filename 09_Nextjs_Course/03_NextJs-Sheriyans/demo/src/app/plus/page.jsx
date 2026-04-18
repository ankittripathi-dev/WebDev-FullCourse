"use client";
import { useState } from "react";

const page = () => {
  const [num, setNum] = useState(0);

  const MinusHandler = () => {
    setNum(num - 1);
  };

  const plusHandler = () => {
    setNum(num + 1);
  };

  return (
    <div>
      <h1>Value of Num: {num}</h1>

      <button
        className="bg-red-800 px-2 py-1 rounded-lg m-3"
        onClick={plusHandler}
      >
        Increment
      </button>

      <button
        className="bg-red-800 px-2 py-1 rounded-lg"
        onClick={MinusHandler}
      >
        Decrement
      </button>
    </div>
  );
};

export default page;
