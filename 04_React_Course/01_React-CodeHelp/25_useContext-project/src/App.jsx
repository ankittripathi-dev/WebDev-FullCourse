import { createContext, useState } from "react";
import ChildA from "./components/ChildA";

// Setp.1 context created
const ThemeContext = createContext();

const App = () => {
  const [theme, setTheme] = useState("dark");

  return (
    <>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <div
          className="h-100 w-100 flex items-center justify-center rounded-full border-2"
          style={{ backgroundColor: theme === "light" ? "pink" : "black" }}
        >
          <ChildA />
        </div>
      </ThemeContext.Provider>
    </>
  );
};

export default App;
export { ThemeContext };

// step1: create context and export it
// step2: wrap all the child inside a provider
// step3: pass value
// step4: use date or consume data Where you wants
