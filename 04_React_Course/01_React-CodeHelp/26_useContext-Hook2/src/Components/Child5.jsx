import { useContext } from "react";
import { UserContext } from "../App";

const Child5 = () => {
  const user = useContext(UserContext);
  return (
    <div>
      <h1>Hello, I am Child-5</h1>
      <h2>{`Hello ${user.name} again`}</h2>
    </div>
  );
};

export default Child5;
