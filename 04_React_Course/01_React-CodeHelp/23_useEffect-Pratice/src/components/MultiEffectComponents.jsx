import { useEffect, useState } from "react";

const MultiEffectComponents = () => {
  const [count, setCount] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // run only on first render
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("SetInterval Started");
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    // cleanup function
    return () => {
      console.log("Time to stop");
      clearInterval(intervalId);
    };
  }, []);

  // side-effect logic will run everytime when count is changed
  useEffect(() => {
    console.log("Count Changed:", count);
  }, [count]);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
      <h2>Seconds: {seconds}</h2>
    </div>
  );
};

export default MultiEffectComponents;
