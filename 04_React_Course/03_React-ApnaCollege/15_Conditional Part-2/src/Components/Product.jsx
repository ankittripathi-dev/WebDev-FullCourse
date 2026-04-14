import React from "react";
import "./Product.css";

const Product = ({ title, price }) => {
  if (price > 30000) {
    return (
      <div className="product">
        <h2>{title}</h2>
        <h3>Price: {price}</h3>
        <h4>Discount of 5%</h4>
      </div>
    );
  } else {
    return (
      <div className="product">
        <h2>{title}</h2>
        <h3>Price: {price}</h3>
      </div>
    );
  }
};

export default Product;
