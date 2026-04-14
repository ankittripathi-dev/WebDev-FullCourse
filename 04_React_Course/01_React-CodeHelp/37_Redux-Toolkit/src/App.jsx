import React from "react";
import Navbar from "./components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement, multiply, incrementByAmount } from "./redux/counter/counterSlice";

const App = () => {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <>
      <Navbar />
      <div>
        <h1>Currently count = {count}</h1>
        <button onClick={() => dispatch(increment())}>Plus +</button>
        <button onClick={() => dispatch(decrement())}>Minus -</button>
        <button onClick={() => dispatch(multiply())}>Minus *</button>
        <button onClick={() => dispatch(incrementByAmount(5))}>By Amount 5</button>
      </div>
    </>
  );
};

export default App;
