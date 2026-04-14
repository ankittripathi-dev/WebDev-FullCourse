import { useState } from "react";
import LogoutBtn from "./components/LogoutBtn";
import LoginBtn from "./components/LoginBtn";

const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);

  const toogleHandler = () => {
    setLoggedIn((prev) => !prev);
  };

  // (1) if-else Statement
  if (isLoggedIn) {
    return <LogoutBtn  handlerChange={toogleHandler}/>;
  } else {
    return <LoginBtn handlerChange={toogleHandler} />;
  }

  // (2) Ternary Operator
  // return <div>{isLoggedIn ? <LogoutBtn /> : <LoginBtn />}</div>;

  /* // (3) Logical Operator
  Renders content only if condition is true
  return (
    <div>
      <h2>Welcome to Web dev Course</h2>
      <div>
        {isLoggedIn && <LogoutBtn />}
      </div>
    </div>
  );
*/

  /* // (4) Early Return
  if (!isLoggedIn) {
    return <LoginBtn />;
  }
*/
};

export default App;
