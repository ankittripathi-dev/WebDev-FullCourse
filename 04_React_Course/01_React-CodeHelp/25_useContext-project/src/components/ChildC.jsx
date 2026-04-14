import { useContext } from "react";
import { ThemeContext } from "../App";

const ChildC = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  const toogleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }

    // setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div>
      <button
        className="bg-red-500 p-4 rounded-md text-2xl"
        style={{backgroundColor: theme==="light"? "black" : "red",  color: "white"}}
        onClick={toogleTheme}
      >
        Change Theme
      </button>
    </div>
  );
};

export default ChildC;
