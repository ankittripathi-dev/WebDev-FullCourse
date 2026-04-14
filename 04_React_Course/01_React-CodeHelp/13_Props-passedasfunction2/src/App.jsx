import Button from "./components/Button";
import { useState } from "react";

const App = () => {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDecrement = () => {
    setCount(count - 1);
  };

  return (
    <div>
      <Button
        handlerPlus={handleIncrement}
        handlerMinus={handleDecrement}
        incrementText="Plus"
        decrementText="Minus"
      >
        <h1>Count:{count}</h1>
      </Button>
    </div>
  );
};

export default App;
