// props:- props property ki tarah hai props ke jagah kuch vi likh skte hai, like property, abc etc.
import React from "react";

const Card = (props) => {
  console.log(props);
  console.log(props.user); // output: In console browser

  return (
    <div className="bg-white text-black text-center rounded-xl p-10">
      <h1 className="text-3xl">
        Name:- {props.user} {props.surname}
      </h1>

      <h3 className="text-xl">
        City:- {props.address}, Age:- {props.age}
      </h3>

      <button className="bg-orange-500 px-3 py-1 text-xl rounded mt-3">
        Add Friend
      </button>
    </div>
  );
};
export default Card;
