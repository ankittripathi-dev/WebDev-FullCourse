import { useEffect, useState } from "react";

const Timer = () => {
  const [seconds, setSeconds] = useState(0);

  // run only on first render
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("setInterval Executed");
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    // cleanup function
    return () => {
      console.log("Time to stop");
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div>
      <h1>Seconds: {seconds}</h1>
    </div>
  );
};

export default Timer;
