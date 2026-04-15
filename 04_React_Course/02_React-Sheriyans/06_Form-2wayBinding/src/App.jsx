import { useState } from "react";

const App = () => {
  const [username, setUsername] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();

    alert(`submitted by :- ${username}`);
    console.log("submitted by:-", username);
    setUsername("");   // reset input after submit
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
          className="bg-white px-2 py-2 rounded-md text-2xl m-1 text-black"
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
