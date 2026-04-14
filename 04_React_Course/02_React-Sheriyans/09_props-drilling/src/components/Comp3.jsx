import React from "react";

const Comp3 = ({ user }) => {
  return (
    <div
      style={{
        backgroundColor: "blue",
        color: "black",
        padding: "16px",
        margin: "10px",
        borderRadius: "10px",
      }}
    >
      <h2>Components C</h2>
      <h3>Age:- {user.age}</h3>
    </div>
  );
};

export default Comp3;
