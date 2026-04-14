import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CiShoppingCart } from "react-icons/ci";
import { storecontext } from "./Context";
import { FaBars } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { useState } from "react";

export default function Header() {
  const [toggle, settoggle] = useState(false);

  const { cart } = useContext(storecontext);

  return (
    <header className="fixed top-0 w-full z-30 bg-gradient-to-r from-pink-500 via-rose-400 to-pink-600 backdrop-blur-md bg-opacity-95 text-white shadow-xl transition-all duration-300">
      <div className="max-w-[1360px] mx-auto">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/">
            <h1 className="md:text-4xl font-extrabold tracking-wider text-white hover:text-yellow-200 transition duration-300 drop-shadow-sm">
              ShopSmart
            </h1>
          </Link>

          <nav className="hidden md:block">
            <ul className="flex space-x-10 font-semibold text-lg tracking-wide">
              <li>
                <Link
                  to="/"
                  className="hover:text-yellow-200 hover:scale-105 transition-all duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/Shop"
                  className="hover:text-yellow-200 hover:scale-105 transition-all duration-200"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/aboutpage"
                  className="hover:text-yellow-200 hover:scale-105 transition-all duration-200"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contactpage"
                  className="hover:text-yellow-200 hover:scale-105 transition-all duration-200"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <nav
            className={`p-4 md:hidden fixed w-[40vw]   bg-black ${
              toggle == true ? "left-0" : "left-[-100%]"
            } top-0  h-screen  flex-col`}
          >
            <ul className="flex flex-col gap-4 text-white space-x-10 font-semibold text-lg tracking-wide">
              <li>
                <Link
                  to="/"
                  className="hover:text-yellow-200 hover:scale-105 transition-all duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/Shop"
                  className="hover:text-yellow-200 hover:scale-105 transition-all duration-200"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/aboutpage"
                  className="hover:text-yellow-200 hover:scale-105 transition-all duration-200"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contactpage"
                  className="hover:text-yellow-200 hover:scale-105 transition-all duration-200"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <Link to="/cart">
            <div className="relative flex items-center gap-2 text-lg bg-white text-pink-600 px-4 py-2 rounded-full shadow-md hover:scale-110 transition-transform duration-200">
              <span className="font-bold">Cart</span>
              <CiShoppingCart size={24} />
              {cart.length > 0 && (
                <span className="absolute top-[-6px] right-[-6px] bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                  {cart.length}
                </span>
              )}
            </div>
          </Link>

          {toggle ? (
            <IoClose
              onClick={() => settoggle(!toggle)}
              className="text-2xl text-white cursor-pointer block md:hidden"
            />
          ) : (
            <FaBars
              onClick={() => settoggle(!toggle)}
              className="text-2xl text-white cursor-pointer block md:hidden"
            />
          )}
        </div>
      </div>
    </header>
  );
}
