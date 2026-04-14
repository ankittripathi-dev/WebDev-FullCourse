import React, { useState } from "react";

const Counter = () => {
  const [count, setCount] = useState(0); //initalization

  const handleCount = () => {
    setCount((currCount)=>{
      return currCount + 1;
    });

    // 
    setCount((currCount)=>{
      return currCount + 1;
    });
    
  };


  return (
    <div>
      <h2>Callback In Set State Function</h2>
      <h4>Count = {count}</h4>
      <button onClick={handleCount}>Increase Count</button>
    </div>
  );
};

export default Counter;
