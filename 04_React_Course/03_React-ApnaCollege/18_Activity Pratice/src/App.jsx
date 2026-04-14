import React from "react";
import MsgBox from "./Components/MsgBox";

const App = () => {
  return (
    <>
      <MsgBox userName={"Ankit"} textColor={"crimson"} />
      <MsgBox userName={"Shiv"} textColor={"blue"} />
    </>
  );
};

export default App;


/* Ques: 
  Show a Hello Message to the user in different Colors.
  Pass 2 values as props: userName & textColor
*/
