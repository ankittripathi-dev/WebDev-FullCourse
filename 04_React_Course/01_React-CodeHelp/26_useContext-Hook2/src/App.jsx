import { createContext, useState } from "react";
import Child1 from "./Components/Child1";

// Step1. created UserContext
const UserContext = createContext();
// Step2: Export it
export { UserContext };

const App = () => {
  const [user, setUser] = useState({name:'Ankit', age:24, isMarried: false});

  return (
    <div>
      <UserContext.Provider value={user}>
        <h1>{`Hello ${user.name}!`}</h1>
        <Child1 />
      </UserContext.Provider>
    </div>
  ); 
};

export default App;

