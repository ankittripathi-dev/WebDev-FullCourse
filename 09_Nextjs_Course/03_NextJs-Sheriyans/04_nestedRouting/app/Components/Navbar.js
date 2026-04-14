import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center px-4 md:px-10 py-2 text-sm md:text-xl bg-emerald-800">
      <h3>Sheriyans</h3>

      <div className="flex gap-4 md:gap-12">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/product">Product</Link>
      </div>
    </div>
  );
};

export default Navbar;
