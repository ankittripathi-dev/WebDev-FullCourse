import React from "react";

const Card = (props) => {
  return (
    <div>
      {props.children}
      {props.name}
    </div>
  );
};

export default Card;
