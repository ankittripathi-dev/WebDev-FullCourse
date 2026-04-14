import React from "react";
import './Home.css'
import { useNavigate, useNavigation } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/about");
  };

  return (
    <div className="home">
      <h1>Home Page</h1>
      <button onClick={handleClick}>Move to About Page</button>
    </div>
  );
};

export default Home;
