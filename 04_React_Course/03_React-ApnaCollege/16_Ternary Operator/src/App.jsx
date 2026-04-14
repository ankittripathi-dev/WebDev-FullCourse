import React from "react";
import Product from "./Components/Product";

const App = () => {
  return (
    <>
      <Product title="Phone" price={30000} />
      <Product title="Laptop" price={40000} />
      <Product title="Pen" price={10} />
    </>
  );
};

export default App;
