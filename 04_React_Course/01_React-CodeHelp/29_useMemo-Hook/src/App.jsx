/* Notes:-
  memo:- memoization
  useMemo Hook returns a memoized value.

*/

import React, { useMemo, useState } from "react";

const App = () => {
  const [count, setCount] = useState(0);
  const [input, setInput] = useState(0);

  // expensive task
  function expensiveTask(num) {
    console.log("Inside Expensive Task");
    for (let i = 0; i <= 1000000000; i++) {}
    return num * 2;
  }

  //  let doubleValue = expensiveTask(input)
  let doubleValue = useMemo(() => expensiveTask(input), [input])

  return (
    <div>
      <div>
        <h1>Count:- {count}</h1>
        <button onClick={() => setCount(count + 1)}>Increment</button>
      </div>
      <br />

      <div>
        <h2>Doubled:- {doubleValue}</h2>
        <input
          type="number"
          placeholder="Enter number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
    </div>
  );
};

export default App;
