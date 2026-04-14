import React from "react";
import Product from "./Product";

const ProductTab = () => {
  let styles = {
    display: 'flex',
  }
  return (
    <div style={styles}>
      <Product title={"Acer Nitro 5"} idx={0} />
      <Product title="Iphone 16" idx={1} />
      <Product title="Petronics Toad 23" idx={2} />
      <Product title="Canon EOS R5" idx={3} />
    </div>
  );
};

export default ProductTab;
