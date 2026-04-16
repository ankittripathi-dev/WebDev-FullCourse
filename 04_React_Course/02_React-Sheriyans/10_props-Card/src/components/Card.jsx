import { useState } from "react";

const Card = (props) => {
  // console.log(props);

  const [add, setAdd] = useState("Add Friend");

  const clickHandler = () => {
    // if (add === "Add Friend") {
    //   setAdd("Remove Friend");
    // } else {
    //   setAdd("Add Friend");
    // }
    add === "Add Friend" ? setAdd("Remove Friend") : setAdd("Add Friend");
  };

  return (
    <div className="bg-white text-black text-center rounded p-10">
      <img
        className="bg-red-400 h-60 w-60 rounded-full m-auto"
        src={props.photo}
        alt="Profile_Picture"
      />

      <h1 className="text-3xl font-semibold mb-2">
        {props.user}
      </h1>

      <h2 className="font-medium">
        {props.city}, {props.age}
      </h2>

      <h2 className="font-medium">
        {props.prof}
      </h2>

      <button
        className="bg-blue-600 text-white px-8 py-3 rounded font-medium mt-3 text-xl"
        onClick={clickHandler}
      >
        {add}
      </button>
    </div>
  );
};
export default Card;
