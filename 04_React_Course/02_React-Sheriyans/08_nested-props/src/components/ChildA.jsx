import React from "react";
import ChildB from "./ChildB";

const ChildA = (props) => {
  return (
    <>
      <div>
        <h1>I am childA:- {props.name}</h1>
      </div>

      <div>
        <ChildB user={props.name} />
      </div>
    </>
  );
};

export default ChildA;
