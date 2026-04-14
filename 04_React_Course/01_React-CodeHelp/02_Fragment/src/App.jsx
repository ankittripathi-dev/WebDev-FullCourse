import React from "react";

const App = () => {
  const YoutubeChannel = "Code Help";
  return (
    <>
      <div>
        <h1>Best React Course</h1>
      </div>

      <div style={{ color: "green" }}>
        <h1>{YoutubeChannel}</h1>
      </div>

      <div>
        <h3 style={{ color: "red" }}>Topic: Fragment</h3>
      </div>
    </>
  );
};

export default App;

   