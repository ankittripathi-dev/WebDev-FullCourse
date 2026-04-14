import { useState } from "react";
import Greet from "./components/Greet";
import Greeting from "./components/Greeting";
import Notification from "./components/Notification";

const App = () => {
  // const [isLoggedIn, setLoggedIn] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(false);

  // change state when click on button
  const toogleChange = () => {
    setLoggedIn((prev) => !prev);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <Greet isLoggedIn={isLoggedIn} />
        <Greeting isLoggedIn={isLoggedIn} />
        <Notification isLoggedIn={isLoggedIn} />
      </div>

      <div className="flex items-center justify-center mt-4">
        <button
          className="bg-amber-600 text-black p-2 rounded-md text-xl"
          onClick={toogleChange}
        >
          Toogle Login
        </button>
      </div>
    </>
  );
};

export default App;
