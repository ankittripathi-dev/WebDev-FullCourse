import React from "react";
import Title from "./Components/Title";
import { Fragment } from "react";

const App = () => {
  return (
    <Fragment>
      <div>
        <h1>Fragments</h1>
      </div>

      <Title/>
      <Title/>
    </Fragment>
  );
};

export default App;
