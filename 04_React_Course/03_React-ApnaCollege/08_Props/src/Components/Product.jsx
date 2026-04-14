import React from "react";
import "./Product.css";

const Product = (props) => {
  return (
    <div className="product">
      <h1>{props.title}</h1>
      <h4>Price : {props.price}</h4>
    </div>
  );
};

export default Product;
