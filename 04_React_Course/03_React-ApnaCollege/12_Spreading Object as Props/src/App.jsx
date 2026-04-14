import React from "react";
import Profile from "./Components/Profile";

const user = { name: "Emart", email: "emart@gmail.com" };

function App() {
  return <Profile {...user} />;
}

export default App;
