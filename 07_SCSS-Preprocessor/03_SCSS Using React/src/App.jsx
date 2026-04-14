import React from "react";
import "./Styles/app.scss";

const App = () => {
  return (
    <div>
      <div className="navbar">
        <ul>
          <li>
            <a href="#Home">Home</a>
          </li>
          <li>
            <a href="#About">About</a>
          </li>
          <li>
            <a href="#Product">Product</a>
          </li>
          <li>
            <a href="#Contact">Contact</a>
          </li>
          <li>
            <a href="#Login">Login</a>
          </li>
        </ul>
      </div>

      <h1>Learning SCSS from 6 pack programeer</h1>
      <h2>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius, dolorem!
      </h2>

      <div className="btn">
        <button>Click me !</button>
        <p className="p1">Click 1</p>
        <p className="p2">Click 2</p>
        <p className="p3">Click 3</p>
      </div>
    </div>
  );
};

export default App;
