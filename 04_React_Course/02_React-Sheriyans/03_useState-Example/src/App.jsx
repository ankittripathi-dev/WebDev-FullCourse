import React, { useState } from "react";

const App = () => {
  const [num, setNum] = useState(0);

  const handleIncrement = () => {
    setNum(num + 1);
  };

  const handleDecrement = () => {
    setNum(num - 1);
  };

  return (
    <div>
      <h1>Value of Num: {num} </h1>
      <button onClick={handleIncrement}>Increment</button>
      <button onClick={handleDecrement}>Decrement</button>
      <br />
      <button onClick={() => setNum(num * 2)}>Multiplication</button>
    </div>
  );
};

export default App;
