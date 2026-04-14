import React, { useCallback, useState } from "react";
import ChildComponent from "./Components/ChildComponent";

const App = () => {
  const [count, setCount] = useState(0);

  let handleClick = useCallback(() => {
    setCount(count + 1);
  }, []);

  return (
    <div>
      <div>
        <h1>Count:- {count}</h1>
      </div>

      <div>
        <button onClick={handleClick}>Increment</button>
      </div>

      <div>
        <ChildComponent handleClick1={handleClick} buttonName="click me" />
      </div>
    </div>
  );
};

export default App;
