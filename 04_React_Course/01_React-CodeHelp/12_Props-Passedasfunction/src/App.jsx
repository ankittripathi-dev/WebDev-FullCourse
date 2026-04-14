import Button from "./components/Button";
import { useState } from "react";

const App = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <Button handler={handleClick} text="Click me">
        <h1>{count}</h1>
      </Button>
    </div>
  );
};

export default App;
