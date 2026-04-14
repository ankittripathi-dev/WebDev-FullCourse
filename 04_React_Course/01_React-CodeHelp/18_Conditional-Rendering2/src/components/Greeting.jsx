import React from "react";

const Greeting = ({ isLoggedIn }) => {
  // (2) Using Ternary Operator (condition ? true : false)
  return (
    <div className="greeting-conatiner">
      <h1>(2) Using Ternary Operator</h1>
      <h1>{isLoggedIn ? "Welcome Back" : "Please Login"}</h1>
    </div>
  );
};

export default Greeting;
