import React from "react";

const Display = ({ text }) => {
  return (
    <div>
      <p className="mt-2 text-lg font-bold">You typed: {text}</p>
    </div>
  );
};

export default Display;
