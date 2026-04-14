import React from "react";

const App = () => {
  // (1) h1
  const handlerMouseOver = () => {
    alert("MouseOver on Heading-1");
  };

  // (2) button
  const handlerClickBtn = () => {
    alert("clicked on Button");
  };

  // (3) input
  const handlerInputChange = (evt) => {
    console.log("Value till Now:", evt.target.value);
  };

  // (4) form
  const handlerSubmit = (evt) => {
    evt.preventDefault();
    // I am writing my custom behaviour down
    alert("Form Submitted");
  };

  return (
    <div className="flex flex-col items-center justify-center gap-20 mt-40">
      <h1
        className="text-3xl bg-white px-26 py-2 rounded-md text-pink-800 font-bold"
        onMouseOver={handlerMouseOver}
      >
        Heading-1
      </h1>

      <button
        className="bg-amber-600 px-4 py-1.5 text-2xl text-black rounded-md"
        onClick={handlerClickBtn}
      >
        click Me
      </button>

      {/* form */}
      <form onSubmit={handlerSubmit} className="flex gap-1">
        <input
          className="bg-white text-black px-2 py-1.5 rounded-md text-2xl"
          type="text"
          placeholder="Enter your Name..."
          onChange={handlerInputChange}
        />
        <button
          className="bg-amber-600 px-4 py-1.5 text-2xl text-black rounded-md"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default App;
