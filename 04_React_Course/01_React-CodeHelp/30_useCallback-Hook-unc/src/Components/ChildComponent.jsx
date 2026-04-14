import React from "react";

const ChildComponent = React.memo((props) => {
  console.log("child component go re-rendered again");

  return (
    <div>
      <button onClick={props.handleClick1}>{props.buttonName}</button>
    </div>
  );
});

export default ChildComponent;



// step:1  React.memo -> child ko faltu me nhi render karwana hai toh React.memo me childComponent ko  wrap kr denge
// step:2 React.memo me wrap kr liya toh component me change krenge tab chnage hoga.
// step:3 Parent se child me function bhej diya toh phir se re-render hone laga.
// step:4 React.memo ka kuch limitation hai :- Jab tk value bhej rhe the tab React.memo re-render hone se bach le rha tha. But jab function bhej diye toh phir se re-render hone lagega ( React.memo nhi bacaha paya re-redner hone se).

// if u r sending a function from parent to child, then React.memo won't be able to save you from re-rendering 

