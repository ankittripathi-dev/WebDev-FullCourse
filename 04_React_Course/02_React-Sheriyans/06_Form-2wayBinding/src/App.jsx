import React from "react";
import { useState } from "react";

const App = () => {
  const [username, setUsername] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    alert(`Submitted By :- ${username}`);
    console.log("Submitted by:-", username);
    setUsername("");
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <input
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          type="text"
          className="bg-white px-2 py-2 rounded-md text-2xl m-3 text-black"
          placeholder="Enter Your Name"
        />
        <button className="bg-green-500 px-5 py-2 text-2xl rounded text-black">
          Submit
        </button>
      </form>
    </div>
  );
};

export default App;
