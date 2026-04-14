import React from "react";
import NavPart2 from "./NavPart2";

const Navbar = () => {
  return (
    <nav className="bg-emerald-900 flex items-center py-2 px-10 justify-between">
      <h2 className="text-3xl">E-mart</h2>

      <NavPart2 />
    </nav>
  );
};

export default Navbar;
