import React from "react";

const handleClick = (event) => {
  console.log("Hello");
  alert("Hello");
  console.log(event);
  
};

const handleMouseOver = () => {
  console.log("Bye!");
};

const handleDblClick = () => {
  console.log("double clicked on button 2");
};

const Button = () => {
  return (
    <div>
      <h2 onMouseOver={handleMouseOver}>This Heading is for event demo</h2>
      <button onClick={handleClick}>click me!</button>
      <button onDoubleClick={handleDblClick}>double click me!</button>
    </div>
  );
};

export default Button;
