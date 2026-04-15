import React from "react";

const Child = ({userDetails}) => {
  return (
    <div>
      <h2>Name: {userDetails.name}</h2>
      <h2>City: {userDetails.address.city}</h2>
      <h2>Country: {userDetails.address.country}</h2>
    </div>
  );
};

export default Child;
