import React from "react";

const Greet = ({ isLoggedIn }) => {
  // (1) Using if/else
  if (isLoggedIn) {
    return (
      <div className="greet-container">
        <h1>(1) Using if/else Statement</h1>
        <h2>Welcome Hai Jee</h2>
      </div>
    );
  } else {
    return (
        <div className="greet-container">
        <h1>(1) Using if/else Statement</h1>
        <h2>Please Login First</h2>
      </div>
    );
  }
};

export default Greet;
