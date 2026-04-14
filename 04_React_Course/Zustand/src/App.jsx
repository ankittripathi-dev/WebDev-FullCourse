import zustandLogo from "./assets/zustand.png";
import UserComp from "./Components/UserComp";
import useCounterStore from "./Store/useCounterStore";
import "./App.css";
import { useEffect } from "react";

const func = () => {
  const count = useCounterStore.getState().count;
  console.log("count =", count);
};

const App = () => {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);
  const reset = useCounterStore((state) => state.reset);
  // const { count, increment, decrement, reset } = useCounterStore();   // destructuring

  // calls when page mounted
  useEffect(() => {
    func();
  }, []);

  return (
    <>
      <div>
        <a href="https://zustand-demo.pmnd.rs/" target="_blank">
          <img src={zustandLogo} className="logo" alt="zustand logo" />
        </a>
        <h1>Zustand Tutorial</h1>
      </div>

      <div className="card">
        <h1>Count: {count}</h1>
        <button onClick={increment}>Increment</button>
        <button onClick={decrement}>Decrement</button>
        <button onClick={reset}>Reset</button>
      </div>

      <UserComp name="Ankit Tripathi" />
    </>
  );
};
export default App;
