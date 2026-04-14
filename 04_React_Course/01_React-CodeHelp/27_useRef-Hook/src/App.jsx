import { useEffect, useRef, useState } from "react";

const App = () => {
  const [count, setCount] = useState(0);

  // Case-1: Presist value on render (re-render ho ya na ho value ohi rhega re-initalize nhi hoga phir se)
  let val = useRef(0);

  const handleIncrement = () => {
    val.current = val.current + 1;
    console.log("Value of Val:", val.current);
    setCount(count + 1);
  };

  // runs on every render
  useEffect(() => {
    console.log("runs on every render");
  });

  // case-2: DOM elements access/change directly.
  let btnRef = useRef();   // reference create krna 

  const changeColor = () => {
    btnRef.current.style.backgroundColor = "orangered";
    btnRef.current.style.color = "white";
  };

  return (
    <div>
      {/* Reference Pass Krna */}
      <button ref={btnRef} onClick={handleIncrement}>Increment</button>
      <br />
      <h1>Count:{count}</h1>
      <button onClick={changeColor}>
        Change Color of 1st Button
      </button>
    </div>
  );
};

export default App;

/*
- The useRef Hook allows you to persist values between renders.
- It can be used to store a mutable value that does not cause a re-render when updated.
- It can be used to access/change a DOM element directly.

useRef() only returns one item. It returns an Object called current.
When we initialize useRef we set the initial value: useRef(0).
It's like doing this: const count = {current: 0}. We can access the count by using count.current.

Does Not Cause Re-renders
If we tried to count how many times our application renders using the useState Hook, we would be caught in an infinite loop since this Hook itself causes a re-render.
To avoid this, we can use the useRef Hook.
*/

/* Notes:
🔹 What is useRef?
lets you store a value that doesn’t re-render the component when it changes.
It’s often used to access DOM elements directly.
The value remains saved even after the component re-renders (refresh hota hai).

Agar tum useRef se value change karoge → render (refresh) nahi hoga.
Value change ho jaayegi, par UI dobara draw nahi hoga.


✅ So, simple language me:
Render = UI ka refresh hona
State badlegi → refresh hoga
Ref badlega → refresh nahi hoga

count har render ke baad dobara calculate hota hai (refresh hota hai).
refValue.current persist karta hai (value wahi save rehti hai re-renders ke across).
Persist = tikna / bana rehna / continue rehna
Normal variable => re-render ho jaye toh phir se initialize hota hai
 useRef se bana variable => re-render ho ya na ho apne value ko persist kr rha hota hai.
*/

