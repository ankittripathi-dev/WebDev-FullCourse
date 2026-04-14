import React from "react";
import "./Product.css";

const Product = ({ title, price }) => {
  const styleSet = {backgroundColor: price > 30000 ? 'orange' : ''}

  return (
    <div className="product" style={styleSet}>
      <h2>{title}</h2>
      <h3>Price: {price}</h3>
      {price > 30000 && <p>"Discount of 5%"</p>}
    </div>
  );
};

export default Product;


// && ke condition me agar condition true huwa tab jo print hogi nhi toh nhi hoga
