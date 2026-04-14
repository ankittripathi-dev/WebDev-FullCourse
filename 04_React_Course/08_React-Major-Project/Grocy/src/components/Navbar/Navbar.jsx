import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { TbMenu2 } from "react-icons/tb";
import { RiMenu3Line } from "react-icons/ri";
import { Link } from "react-router-dom";

function Navbar() {
  const [showMenu,setShowMenu] = useState(false);
  const toggleMenu = () =>{
    setShowMenu(!showMenu);
  }
  const [isScroll,setIsScroll] = useState(false);
  useEffect(()=>{
      const handleScroll = () =>{
        setIsScroll(window.scrollY > 10)
      }

      window.addEventListener("scroll",handleScroll);
      return ()=> window.removeEventListener("scroll",handleScroll);

  },[])


  return (
    <header className={`bg-white fixed top-0 right-0 left-0 z-50  ${isScroll ? "drop-shadow-[0_4px_25px_rgba(0,0,0,0.1)]":''}`}>
      <nav className="flex justify-between mx-auto h-[10vh] max-w-[1400px] md:h-[14vh] items-center px-3 ">
        {/* LOGO */}
        <Link to={"/"} className="text-3xl font-bold px-4">
          Gr<span className="text-orange-600">O</span>cy
        </Link>

        {/* Desktop menu */}
        <ul className="md:flex justify-end  gap-x-10 hidden">
          <li>
            <Link
              to="/"
              className=" text-1xl hover:text-amber-700 cursor-pointer font-semibold tracking-wide"
            >
              Home
            </Link>
          </li>
          <li>
            <a
              href="#"
              className=" text-1xl hover:text-amber-700 cursor-pointer font-semibold tracking-wide"
            >
              About Us
            </a>
          </li>
           <li>
            <Link
              to={"/all-products"}
              className=" text-1xl hover:text-amber-700 cursor-pointer font-semibold tracking-wide"
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              to={"/process"}
              className=" text-1xl hover:text-amber-700 cursor-pointer font-semibold tracking-wide"
            >
              Process
            </Link>
          </li>
          <li>
            <a
              href="#"
              className=" text-1xl hover:text-amber-700 cursor-pointer font-semibold tracking-wide"
            >
              Contact Us
            </a>
          </li>
        </ul>

        {/* Nav actions */}
        <div className="flex items-center gap-10 ">
          {/* input fields */}
          <div className="md:flex hidden justify-center items-center gap-0 border-2 border-orange-500 rounded-full px-2">
            <input
              type="text"
              id="text"
              name="texxt"
              placeholder="Search..."
              autoComplete="off"
              className="flex-1 h-[4vh] px-2 focus:outline-none"
            />
            <button className="bg-orange-600 cursor-pointer text-white w-7 h-7 flex justify-center items-center rounded-full">
              <FaSearch />
            </button>
          </div>

          <a href="#" className="text-[20px] text-zinc-800">
            <FaHeart className="" />
          </a>
          <a>
            <FaShoppingBag className="text-[20px] text-zinc-800 cursor-pointer" />
          </a>

          {/* Hamburger  */}
          <a href="#" className="text-zinc-800 text-3xl cursor-pointer md:hidden sm:show" onClick={toggleMenu}>
            {showMenu ? <RiMenu3Line /> : <TbMenu2 />}
          </a>
        </div>

        {/* Menu */}
        <ul className={`flex flex-col gap-y-8 justify-center shadow-xl items-center bg-orange-600/20 backdrop-blur-xl rounded-xl gap-x-10 px-4 md:hidden absolute top-25 transform -translate-x-1/2 -left-full  transition-all duration-500  ${showMenu ? "left-1/2":" "}`}>
          <li className="mt-5">
            <Link
              to={"/"}
              className=" text-1xl hover:text-amber-700 cursor-pointer font-semibold tracking-wide"
            >
              Home
            </Link>
          </li>
          <li>
            <a
              href="#"
              className=" text-1xl hover:text-amber-700 cursor-pointer font-semibold tracking-wide"
            >
              About Us
            </a>
          </li>
           <li>
            <Link
              to={"/all-products"}
              className=" text-1xl hover:text-amber-700 cursor-pointer font-semibold tracking-wide"
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              to={"/process"}
              className=" text-1xl hover:text-amber-700 cursor-pointer font-semibold tracking-wide"
            >
              Process
            </Link>
          </li>
          <li>
            <a
              href="#"
              className=" text-1xl hover:text-amber-700 cursor-pointer font-semibold tracking-wide"
            >
              Contact Us
            </a>
          </li>

           <li className="flex md:hidden mb-5 justify-center items-center gap-0 border-2 border-orange-500 rounded-full px-3">
            <input
              type="text"
              id="text"
              name="texxt"
              placeholder="Search..."
              autoComplete="off"
              className="flex-1 h-[4vh] px-2 focus:outline-none"
            />
            <button className="bg-orange-600 cursor-pointer text-white w-7 h-7 flex justify-center items-center rounded-full">
              <FaSearch />
            </button>
          </li>

        </ul>
      </nav>
    </header>
  );
}

export default Navbar;



