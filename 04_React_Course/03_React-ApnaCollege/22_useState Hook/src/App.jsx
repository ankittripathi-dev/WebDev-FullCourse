import React from "react";
import { useState } from "react";

const App = () => {
  const [count, setCount] = useState(0);

  const handleCount = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <h1>useState Hook in React</h1>
      <h3>Count: {count}</h3>
      <button onClick={handleCount}>Increase Count</button>
    </div>
  );
};

export default App;
