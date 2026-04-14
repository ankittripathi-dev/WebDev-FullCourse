import { useState } from "react";
import ChildA from "./Components/ChildA";

const App = () => {
  const [userDetails, setUserdetails] = useState({ name: "Ankit", age: 25 });
  
  return (
    <div>
      <ChildA user1={userDetails} />
    </div>
  );
};

export default App;

// Notes: Props drilling happens when you pass props through multiple levels of components, even if the intermediate components don’t need them—just so the deepest child component can use them.