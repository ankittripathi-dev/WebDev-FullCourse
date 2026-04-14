import React from "react";

const Product = ({ techStack }) => {
  return (
    <div>
      <h2>My Tech Stack</h2>
      <ol>
        {techStack.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ol>
    </div>
  );
};

export default Product;
