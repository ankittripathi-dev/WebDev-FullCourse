import React from "react";
import "./Product.css";

const Product = ({ title, price }) => {
  return (
    <div className="product">
      <h2>{title}</h2>
      <h3>Price: {price}</h3>
      {/* <h4>{price > 30000 ? '5%': ""}</h4> */}
      {/* {price > 30000 ? <p>"Discount of 5%"</p>: null} */}
      {/* {price > 30000 ? <p>"Discount of 5%"</p> : <a href="/">Get discount</a>} */}
      {price > 30000 && <p>"Discount of 5%"</p>}
    </div>
  );
};

export default Product;


// && ke condition me agar condition true huwa tab jo print hogi nhi toh nhi hoga
