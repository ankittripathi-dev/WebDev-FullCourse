import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  decrement,
  increment,
  incrementByAmount,
  reset,
} from "./features/counter/counterSlice";
import Navbar from "./components/Navbar";

const App = () => {
  const [amount, setAmount] = useState(0);

  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  const handleIncrementClick = () => {
    dispatch(increment());
  };

  const handleDecrementClick = () => {
    dispatch(decrement());
  };

  const handleResetClick = () => {
    dispatch(reset());
  };

  const handleIncAmountClick = () => {
    dispatch(incrementByAmount(amount));
  };

  return (
    <div>
      <Navbar/>
      <button onClick={handleIncrementClick}>+</button>
      <button onClick={handleDecrementClick}>-</button>
      <button onClick={handleResetClick}>Reset</button>
      <h3>Count: {count}</h3>
      <input
        type="Number"
        value={amount}
        placeholder="Enter Amount"
        onChange={(e) => setAmount(e.target.value)}
      />
      <br />
      <button onClick={handleIncAmountClick}>Incr By Amount</button>
    </div>
  );
};

export default App;
