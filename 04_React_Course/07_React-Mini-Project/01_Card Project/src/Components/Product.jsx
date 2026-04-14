import React from "react";
import Price from "./Price";
import "./Product.css";

const Product = ({ title, idx }) => {
  let oldPrice = ["Rs.88,000", "Rs.75,000", "Rs.350", "Rs.72,000"];
  let newPrice = ["Rs.83,000", "Rs.72,000", "Rs.300", "Rs.68,000"];
  let description = [
    ["Laptop", "For Heavy Gaming"],
    ["Mobile Phone", "For Personal Use"],
    ["Wireless Mouse", "For Smooth Browsing"],
    ["Camera", "For Photography"],
  ];

  return (
    <div className="product">
      <h2>{title}</h2>
      <p>{description[idx][0]}</p>
      <p>{description[idx][1]}</p>
      <Price oldPrice={oldPrice[idx]} newPrice={newPrice[idx]} />
    </div>
  );
};

export default Product;
