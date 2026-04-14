import React, { useState } from "react";
import Greeting from "./Components/Greeting";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <>
      <Greeting loginInfo={isLoggedIn} />

      <button onClick={() => setIsLoggedIn(!isLoggedIn)}>
        {isLoggedIn ? "Logout" : "Login"}
      </button>
    </>
  );
};

export default App;
