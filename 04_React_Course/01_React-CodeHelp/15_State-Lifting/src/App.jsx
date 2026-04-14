import Card from "./components/Card";
import { useState } from "react";

// parent components
const App = () => {
  // create state
  // manage state
  // change state
  // sabhi child me state koo sync karwa denge
  const [name, setName] = useState("");

  return (
    <div>
      <Card title="Card1" userName={name} setNameKaro={setName} />
      <Card title="Card2" userName={name} setNameKaro={setName} />
      <p>{name}</p>
    </div>
  );
};

export default App;

/* Notes:
- Lifting State Up in React is a core concept used when multiple components need to share the same data.
➡️ Moving state from a child component to their closest common parent
➡️ So that multiple components can access and stay in sync

🔹 Why used?
- It’s used to avoid duplicate states,
- keep data synchronized,
- And let components communicate through the parent.
*/