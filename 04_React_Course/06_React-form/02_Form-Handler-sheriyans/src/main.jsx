import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./style.css";

// ReactDOM.AppcreateRoot(document.getElementById("root")).render(<App />);
const conatiner = document.getElementById("root");
const root = ReactDOM.createRoot(conatiner);
root.render(<App />);
