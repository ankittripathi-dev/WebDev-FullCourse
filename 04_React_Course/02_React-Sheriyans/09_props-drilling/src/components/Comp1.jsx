import React from "react";
import Comp2 from "./Comp2";

const Comp1 = ({ userData }) => {
  return (
    <>
      <div
        style={{
          backgroundColor: "crimson",
          color: "black",
          padding: "16px",
          margin: "10px",
          borderRadius: "10px",
        }}
      >
        <h2>Component A</h2>
        <h3>User:- {userData.username}</h3>
      </div>

      <Comp2 userData={userData} />
    </>
  );
};

export default Comp1;
