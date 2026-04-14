import React from "react";
import { useState } from "react";
import Comp1 from "./components/Comp1";

const App = () => {
  const [userData, setUserData] = useState({
    username: "Ankit Tripathi",
    age: 25,
    city: "Gorakhpur",
  });

  return (
    <div>
      <h2>User:- {userData.username}</h2>
      <h2>City:- {userData.city}</h2>
      <h2>Age:- {userData.age}</h2>
      <Comp1 userData={userData} />
    </div>
  );
};

export default App;
