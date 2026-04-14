import React from "react";

const ChildInput = (props) => {
  return (
    <input
      className="border p-2 rounded-md w-full text-black bg-white"
      type="text"
      value={props.text}
      onChange={(e) => props.setText(e.target.value)}
      placeholder="Type something..."
    />
  );
};

export default ChildInput;
