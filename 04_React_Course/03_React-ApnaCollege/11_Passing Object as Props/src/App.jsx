import React from "react";
import Profile from "./Components/Profile";
import ProfileDestructuring from "./Components/ProfileDestructuring";

const userDetails = { name: "Ankit", email: "ankit@csk.com" };

const App = () => {
  return (
    <>
      <div>
        <h1 style={{ color: "red" }}>Passing Object as a Prop Directly</h1>
        <Profile user={userDetails} />
        <Profile user={{ name: "Dhoni", email: "dhoni07@csk.com" }} />
      </div>

      <div>
        <h1 style={{color: 'green'}}>Using Object Destructuring in the Child Component</h1>
        <ProfileDestructuring user ={userDetails} />
      </div>
    </>
  );
};

export default App;
