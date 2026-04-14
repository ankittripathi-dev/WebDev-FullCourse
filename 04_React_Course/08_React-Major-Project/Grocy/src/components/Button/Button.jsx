import React from "react";

function Button({content}) {
  return (
    <button className="bg-orange-600 rounded-[5px] text-white md:px-7 md:py-2 px-5 py-2  mt-2 text-lg hover:scale-105 cursor-pointer hover:bg-orange-500">
      {content}
    </button>
  );
}

export default Button;


