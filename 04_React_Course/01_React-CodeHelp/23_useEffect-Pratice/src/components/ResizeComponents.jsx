import { useEffect, useState } from "react";

const ResizeComponents = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // run on first render
  useEffect(() => {
    const handlerResize = () => {
      console.log("Event Listner Added");
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handlerResize);

    return () => {
      console.log("Event Listner removed");
      window.removeEventListener("resize", handlerResize);
    };
  }, []);

  return (
    <div>
      <h1>Window width: {windowWidth}px</h1>
    </div>
  );
};

export default ResizeComponents;
