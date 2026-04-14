import React from "react";

const App = () => {
  let user = "Ankit";
  let age = 25;

  const handleChange = () => {
    console.log(user);
    user = "Aryan"; // Real DOM se intract ho rha hai na ki Virtual DOM. So UI pe change nhi hoga.
    console.log(user);
  };

  return (
    <div>
      <h1>Hi, My name is {user}</h1>
      <h1>I am {age} year old</h1>
      <button onClick={handleChange}>Change User</button>
    </div>
  );
};

export default App;
