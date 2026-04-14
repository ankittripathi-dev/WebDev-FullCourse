import { useState } from "react";
import Comp2 from "./Comp2";

const Comp1 = () => {
  const [user, setUser] = useState("Ankit Tripathi");

  return (
    <>
      <h1>{`Hello, ${user}`}</h1>
      <Comp2 user={user} />
    </>
  );
};

export default Comp1;
