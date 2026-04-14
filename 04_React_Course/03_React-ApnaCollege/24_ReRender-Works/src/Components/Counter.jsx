import React, { useState } from "react";

const Counter = () => {
  const [count, setCount] = useState(0); //initalization
  console.log("Component is rendered!");
  console.log(`Count = ${count}`);

  const handleCount = () => {
    setCount(count + 1);
    console.log(`Inside increCount, Count = ${count}`);
  };

  // count variable ki value update hoti hai render stage pe na ki function call pe

  return (
    <div>
      <h2>How Re-render Works</h2>
      <h4>Count = {count}</h4>
      <button onClick={handleCount}>Increase Count</button>
    </div>
  );
};

export default Counter;
