import React from "react";
import Card from "./components/Card";

const App = () => {
  return (
    <div className="p-10">
      <Card user="Ankit" surname="Tripathi" age="25" address="Bhairahawa" />
    </div>
  );
};

export default App;
