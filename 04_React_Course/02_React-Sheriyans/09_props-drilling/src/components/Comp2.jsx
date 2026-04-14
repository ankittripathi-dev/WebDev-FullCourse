import React from "react";
import Comp3 from "./Comp3";

const Comp2 = ({ userData }) => {
  return (
    <>
      <div
        style={{
          backgroundColor: "green",
          color: "black",
          padding: "16px",
          margin: "10px",
          borderRadius: "10px",
        }}
      >
        <h2>Component B</h2>
        <h3>City:- {userData.city}</h3>
      </div>

      <Comp3 user={userData} />
    </>
  );
};

export default Comp2;
