import { useRef, useState } from "react";

const App = () => {
  const [time, setTime] = useState(0);

  // create useRef
  let timeRef = useRef(null);

  const startTimer = () => {
    timeRef.current = setInterval(() => {
      setTime((time) => time + 1); // setTime(time => time + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timeRef.current);
    timeRef.current = null;
  };

  const resetTimer = () => {
    stopTimer();
    setTime(0);
  };

  return (
    <div>
      <h1>StopWatch: {time} sec</h1>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
      <button onClick={resetTimer}>Reset</button>
    </div>
  );
};

export default App;
