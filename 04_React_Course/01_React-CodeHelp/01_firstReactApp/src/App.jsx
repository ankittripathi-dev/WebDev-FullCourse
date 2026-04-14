import React from "react";

const App = () => {
  const instructor = "Love Babbar";
  return (
    <div>
      <h1 style={{ color: "blue" }}>My first ReactApp</h1>
      <h1 style={{ color: "red" }}>Code Help</h1>
      <h1>{instructor}</h1>
    </div>
  );
};

export default App;
