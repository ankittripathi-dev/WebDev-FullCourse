import React from "react";

const Price = ({ oldPrice, newPrice }) => {
  let oldStyles = {
    textDecorationLine: "line-through",
  };

  let newStyles = {
    fontWeight: "bold",
  };

  let styleSet = {
    backgroundColor:'#e0c367',
    height:'24px',
    borderBottomLeftRadius: '14px',
    borderBottomRightRadius: '14px'
  }
  return (
    <div style={styleSet}>
      <span style={oldStyles}>{oldPrice}</span>
      &nbsp; &nbsp;
      <span style={newStyles}>{newPrice}</span>
    </div>
  );
};

export default Price;
