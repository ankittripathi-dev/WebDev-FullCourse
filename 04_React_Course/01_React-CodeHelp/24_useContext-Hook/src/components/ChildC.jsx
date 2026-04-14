import { useContext } from "react";
import { UserContext } from "../App";

const ChildC = () => {
  const userDetails = useContext(UserContext);

  return (
    <div>
      <h2>Name: {userDetails.name}</h2>
      <h2>Age: {userDetails.age}</h2>
      <h2>Position: {userDetails.role}</h2>
    </div>
  );
};

export default ChildC;
