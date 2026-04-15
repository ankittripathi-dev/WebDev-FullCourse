import React from "react";

const GrandChildB = ({ userData, Styles }) => {
  return (
    <div style={Styles.grandChildB}>
      <h2>GrandChild B Component</h2>
      <h3>Age: {userData.age}</h3>
    </div>
  );
};

export default GrandChildB;
