import React, { useState } from "react";

const Card = (props) => {
  // console.log(props);

  const [add, setAdd] = useState("Add Friend");

  const clickHandler = () => {
    setAdd("Remove Friend");
  };

  return (
    <div className="mr-8 bg-white text-black inline-block text-center rounded p-6">
      <img
        className="bg-red-400 h-40 w-40 rounded-full m-auto"
        src={props.photo}
        alt="Profile_Picture"
      />

      <h1 className="text-2xl font-semibold mb-2">{props.user}</h1>

      <h2 className="font-medium">
        {props.city}, {props.age}
      </h2>

      <h2 className="font-medium">{props.prof}</h2>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded font-medium mt-3"
        onClick={clickHandler}
      >
        {add}
      </button>
    </div>
  );
};
export default Card;
