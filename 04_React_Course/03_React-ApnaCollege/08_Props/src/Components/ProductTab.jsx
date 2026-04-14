import React from "react";
import Product from "./Product";

const ProductTab = (props) => {
  return (
    <div>
      <Product title ='phone' price = {30000}/>  
      <Product title = 'laptop' price = '40000'/>
      <Product title = 'Pen' price = '10'/>
    </div>
  );
};

export default ProductTab;
