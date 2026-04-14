import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <nav>
        <NavLink
          to="/"
          className={(e) => {
            return e.isActive ? "red" : "";
          }}
        >
          <li>Home</li>
        </NavLink>
        <NavLink
          to="/about"
          className={(e) => {
            return e.isActive ? "red" : "";
          }}
        >
          <li>About</li>
        </NavLink>
        <NavLink
          to="/contact"
          className={(e) => {
            return e.isActive ? "red" : "";
          }}
        >
          <li>Contact</li>
        </NavLink>
        <NavLink
          to="/login"
          className={(e) => {
            return e.isActive ? "red" : "";
          }}
        >
          <li>LogIn</li>
        </NavLink>
      </nav>
    </>
  );
};

export default Navbar;
