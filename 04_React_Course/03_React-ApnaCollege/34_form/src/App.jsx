import React, { useState } from "react";

const App = () => {
  const [fullName, setFullName] = useState("");

  const submitHandler = (evt) => {
    evt.preventDefault();
    console.log("Submitted by:-", fullName);
  };

  const handleNameChange = (evt) => {
    setFullName(evt.target.value);
  };

  return (
    <form onSubmit={submitHandler}>
      <input
        type="text"
        placeholder="Enter Your Name"
        value={fullName}
        onChange={handleNameChange}
      />
      <button>Submit</button>
    </form>
  );
};

export default App;
