import React from "react";
import { useSelector, useDispatch } from "react-redux";

const Navbar = () => {
  const count = useSelector((state) => state.counter.value);

  return (
    <div>
      <h1>I am a Navbar and counter is {count}</h1>
    </div>
  );
};

export default Navbar;
