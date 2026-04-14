import React from "react";

const App = () => {
  const hanlderClick = (name) => {
    alert(`Hello, ${name}`);
  };

  return (
    <div className="flex flex-col gap-6 items-center text-3xl">
      <h1>Event handling with Argument Passed</h1>

      <button
        className="bg-orange-600 text-black text-2xl  px-2 py-1 rounded"
        onClick={() => {
          hanlderClick("React Developer");
        }}
      >
        click me
      </button>
    </div>
  );
};

export default App;
