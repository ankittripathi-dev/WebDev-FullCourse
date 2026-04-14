import { useEffect, useState } from "react";

const App = () => {
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(1); // for multiple dependencies

  // Case:1 -> runs on every render/mount
  // useEffect(() => {
  //   console.log('I will run on every render')
  // });


  // Case:2 -> runs on only first render/mount
  // useEffect(() => {
  //    console.log("I will run on only 1st render");
  // }, []);


  // Case:3 -> runs on every render when dependencies is updated/changed
  // useEffect(() => {
  //    console.log("I will run every time when count is updated");
  // }, [count]);


  // Case:4 -> for multiple dependencies
  // useEffect(() => {
  //   console.log("I will run every time when count/total is updated");
  // }, [count, total]);


  // Case:5 -> cleanup function
  useEffect(() => {
    // alert("Count is updated");
    console.log('Count is updated');

    return () => {
      // alert("Count is unmounted from UI");
      console.log('Count is unmounted from UI');
    };
  }, [count]);

  return (
    <div className="container">
      <div>
        <h1> Count: {count}</h1>
        <button onClick={() => setCount(count + 1)}>Update Count</button>
      </div>

      <div>
        <h1>Total: {total}</h1>
        <button onClick={() => setTotal(total + 1)}>Update Total</button>
      </div>
    </div>
  );
};

export default App;


/* NOTES: 
🔹 useEffect Hook is used to handle side effects in functional Components.
Side Effect is any operation that affects something outside the scope of a function.
Example:-
Why useEffect are used
(1) Fetching data from an API
(2) Updating the DOM directly
(3) Working With Event listeners
(4) Working with timers (setTimeout, setInterval)


🔹 Explanation
(1) Effect function –> runs after the component renders.
(2) Cleanup function (optional) –> runs before the component unmounts or before re-running the effect.
(3) Dependency array –> controls when the effect runs:
No array → run on every render.
[] → run once when the component mounts
[state, props] → runs every time when specified values change.


🔹 Syntax:-
 useEffect(() => {
   // your side effect code  here

  return () => {
    // Cleanup code (optional)
  };
}, [dependencies]);

first -> side effect function
second -> clean-up function
third -> comma separated dependency list


🔹 Normally, Cleanup Function se kya hoga
(1) Background ka kaam stop ho jaayega (intervals, timeouts, subscriptions).
(2) Event listeners safely remove ho jaayenge.
(3) Memory leaks aur unnecessary updates avoid ho jaayenge.
(4) App lightweight & bug-free rahega.

🔹 Shortcut Yaad Rakho
(1) useEffect => kuchh kaam shuru karna (side-effect).
(2) cleanup function => us kaam ko rokna jab zaroorat na ho.
*/
