import React from "react";
import './About.css'
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/dashboard");
  };

  return (
    <div className="about">
      <h1>About Page</h1>
      <button onClick={handleClick} style={{ backgroundColor: "green" }}>
        Move to DashBoard
      </button>
    </div>
  );
};

export default About;
