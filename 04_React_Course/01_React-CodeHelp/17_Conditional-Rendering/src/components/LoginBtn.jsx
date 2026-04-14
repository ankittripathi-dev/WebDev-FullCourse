import React from "react";

const LoginBtn = ({handlerChange}) => {
  return (
    <div>
      <h1>Login Karo Pahle</h1>
      <button onClick={handlerChange}>Login</button>
    </div>
  );
};

export default LoginBtn;
