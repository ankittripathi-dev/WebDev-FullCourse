import React, { useState } from "react";

function randonNum() {
  console.log("randomNum was executed");
  return Math.random();
}

const Counter = () => {
  const [count, setCount] = useState(randonNum);
  console.log("Component was rendered");

  const handleCount = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <h4>Count = {count}</h4>
      <button onClick={handleCount}>Increase Count</button>
    </div>
  );
};

export default Counter;
