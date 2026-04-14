import React from "react";
import Product from "./Components/Product";

const App = () => {
  const items = ["React", "Redux", "JavaScript", "Tailwind"];

  return (
    <div>
      <Product techStack={items} />

      <Product techStack={["Materail UI", "BootStarps", "Tailwind"]} />
    </div>
  );
};

export default App;
