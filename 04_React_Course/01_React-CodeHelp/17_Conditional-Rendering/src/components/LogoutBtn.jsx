import React from "react";

const LogoutBtn = ({handlerChange}) => {
  return (
    <div>
      <h1>Logout Kro Jaldi</h1>
      <button onClick={handlerChange}>Logout</button>
    </div>
  );
};

export default LogoutBtn;
