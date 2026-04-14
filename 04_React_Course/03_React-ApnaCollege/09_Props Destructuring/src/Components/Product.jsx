import React from "react";
import "./Product.css";

const Product = ({title, price}) => {
  return (
    <div className="product">
      <h1>{title}</h1>
      <h4>Price : {price}</h4>
    </div>
  );
};

export default Product;
