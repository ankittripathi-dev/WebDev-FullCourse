import React, { useState } from "react";

const App = () => {
  const [num, setNum] = useState(0);

  const changeMe = () => {
    console.log("change ho gaya");
    setNum(20);
    // setNum('Happy New Year')    // Can assign string as well
  };

  return (
    <div>
      <h1>Value of Num: {num}</h1>
      <button onClick={changeMe}>Change num</button>
    </div>
  );
};

export default App;

/* Notes:-
  hooks:- hooks are special type of function
  useState hook :- state management
*/
