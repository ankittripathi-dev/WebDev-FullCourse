import { useState } from "react";
import { createContext } from "react";
import ChildA from "./components/ChildA";

// Step1: Create context & export it
const UserContext = createContext();
// Step2: Wrap all the child inside a provider
// Step3: Pass value
// Step4: consumer ke ander jake consume karlo

const App = () => {
  const [user, setUser] = useState({
    name: "Ankit",
    age: 24,
    role: "Web-Developer",
  });

  return (
    <>
      <UserContext.Provider value={user}>
        <ChildA />
      </UserContext.Provider>
    </>
  );
};

export default App;

export { UserContext };

// Step1: create context
// Step2: wrap all children inside a provide
// Step3: pass value
// Step4: export created context
// Step5: consume the value where needed.

/*
What is useContext?
(1) useContet allows you to use context values directly in your components without using props drilling.
(2) Props drilling means passing data from parent → child → grandchild →  even if intermediate components dont need it.

The Context API in React.js is a way to share data globally across components without passing props manually at every level (prop drilling).
*/
