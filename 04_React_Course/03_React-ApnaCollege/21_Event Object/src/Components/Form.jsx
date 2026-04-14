import React from "react";

const handleFormSubmit = (event) => {
  event.preventDefault();
  // alert("form was submitted");
  console.log("form was submitted");
};

const Form = () => {
  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <input type="text" placeholder="Enter Your Name" />
        <button>Submit</button>
      </form>
    </div>
  );
};

export default Form;
