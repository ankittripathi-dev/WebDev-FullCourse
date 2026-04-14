import React, { useState } from "react";

const App = () => {
  const [username, setUsername] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("Submitted by:-", username);
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <input
          onChange={(e) => {
            setUsername(e.target.value);
            // console.log(e.target.value);
          }}
          className="px-2 py-1 rounded text-xl m-5 text-black"
          type="text"
          placeholder="Enter Your Name"
        />

        <button className="px-4 py-1 text-xl bg-green-600 text-white rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default App;
