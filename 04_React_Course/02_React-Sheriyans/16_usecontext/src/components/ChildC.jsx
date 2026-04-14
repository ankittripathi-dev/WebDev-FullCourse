import { useContext } from "react";
import { UserContext } from "../App";

const ChildC = () => {
  const userData = useContext(UserContext);

  return (
    <div
      style={{
        backgroundColor: "green",
        padding: "20px",
        marginBlock: "10px",
        borderRadius: "10px",
      }}
    >
      <h1>Child C</h1>
      <h2>User: {userData.username}</h2>
      <h2>City: {userData.city} </h2>
      <h2>Age: {userData.age}</h2>
    </div>
  );
};

export default ChildC;
