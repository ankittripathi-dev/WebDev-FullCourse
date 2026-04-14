import { useContext } from "react";
import { DataContext } from "../context/UserContext";

const Header = () => {
  const user = useContext(DataContext);
  
  return (
    <div>
      <h1>Header City: {user.city}</h1>
    </div>
  );
};

export default Header;
