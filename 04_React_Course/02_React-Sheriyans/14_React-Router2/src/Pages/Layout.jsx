import React from "react";
import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <div className="flex justify-between items-center px-8 py-3 bg-emerald-800  text-white">
        <div>
          <h2 className="text-3xl">
            E-mart
            <input type="text" className="bg-white ml-3.5 rounded w-50 h-8" />
          </h2>
        </div>

        <div className="flex gap-10 text-2xl">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/signin">SignIn</Link>
        </div>
      </div>

      <Outlet />
    </>
  );
};

export default Layout;
