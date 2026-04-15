import { useState } from "react";
import Child from "./components/Child";

const App = () => {
  const [user, setUser] = useState({
    name: "Ankit",
    address: {
      city: "New Delhi",
      country: "India",
    },
  });

  return (
    <div>
      <Child userDetails={user} />
    </div>
  );
};

export default App;
