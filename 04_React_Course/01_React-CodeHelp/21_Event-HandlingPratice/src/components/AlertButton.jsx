import React from "react";

const AlertButton = ({ message, children }) => {
  return (
    <div>
      <button onClick={() => alert(message)}>
        <h1>{children}</h1>
      </button>
    </div>
  );
};

export default AlertButton;

/* Destructuring
   const AlertButton = ({message, children})=> {
    return ()
  }  
*/
