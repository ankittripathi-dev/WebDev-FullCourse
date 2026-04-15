import { useState } from "react";
import Child from "./components/Child";

const App = () => {
  const [userData, setUserData] = useState({
    username: "Ankit",
    age: 25,
    city: "Gudgaon",
  });

  const baseStyle = {
    padding: "16px",
    margin: "10px",
    color: "black",
    borderRadius: "10px",
  };

  const styles = {
    child: { ...baseStyle, backgroundColor: "crimson" },
    grandChildA: { ...baseStyle, backgroundColor: "green" },
    grandChildB: { ...baseStyle, backgroundColor: "blue" },
  };

  return (
    <div>
      <h1>Parent Component</h1>
      <h2>User: {userData.username}</h2>
      <h2>City: {userData.city}</h2>
      <h2>Age: {userData.age}</h2>

      <Child userData={userData} styles={styles} />
    </div>
  );
};

export default App;
