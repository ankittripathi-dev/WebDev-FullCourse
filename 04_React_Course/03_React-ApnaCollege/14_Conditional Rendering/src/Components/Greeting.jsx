import React from "react";

const Greeting = ({ loginInfo }) => {
  if (loginInfo) {
    return <h1>Welcome Back</h1>;
  } else {
    return <h1>Please SignIn</h1>;
  }
};

export default Greeting;
