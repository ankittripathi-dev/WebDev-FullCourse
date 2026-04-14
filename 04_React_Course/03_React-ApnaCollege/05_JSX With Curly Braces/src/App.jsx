import React from "react";

const App = () => {
  let name = 'Ankit'
  return (
    <>
      <h3>2 * 2 = {2 * 2}</h3>
      <h3>Hi, {name}</h3>
      <h3>Hi, {name.toUpperCase()}</h3>
    </>
  );
};

export default App;
