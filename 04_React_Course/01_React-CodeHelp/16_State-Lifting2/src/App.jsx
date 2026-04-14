import { useState } from "react";
import ChildInput from "./components/ChildInput";
import Display from "./components/Display";

const App = () => {
  // lifted state lives here (parent)
  const [text, setText] = useState("");

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-blue-800 text-xl font-bold">
        Lifting State Example
      </h1>
      <ChildInput text={text} setText={setText} />
      <Display text={text} />
    </div>
  );
};

export default App;
