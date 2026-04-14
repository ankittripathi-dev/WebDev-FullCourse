import { assetsCollection } from "../../assets/assetsData";
import { FaPhoneAlt } from "react-icons/fa";
import { useState } from "react";

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false); // toogle

  return (
    <nav className="absolute top-0 left-0 z-10 w-full bg-black text-white">
      {/* navbar */}
      <div className="flex items-center justify-between px-6 py-4 mx-auto bg-transparent md:px-20">
        <div>
          <h1 className="text-2xl font-semibold">CAR WALA</h1>
        </div>

        <ul className="hidden md:flex gap-5 text-md">
          <li>
            <a href="" className="cursor-pointer hover:text-blue-800">
              HOME
            </a>
          </li>

          <li>
            <a href="" className="cursor-pointer hover:text-blue-800">
              ABOUT
            </a>
          </li>

          <li>
            <a href="" className="cursor-pointer hover:text-blue-800">
              GET A CAB
            </a>
          </li>

          <li>
            <a href="" className="cursor-pointer hover:text-blue-800">
              REVIEWS
            </a>
          </li>

          <li>
            <a href="" className="cursor-pointer hover:text-blue-800">
              OUR NEWS
            </a>
          </li>

          <li>
            <a href="" className="cursor-pointer hover:text-blue-800">
              CONTACTS
            </a>
          </li>
        </ul>

        <div className="hidden md:flex justify-center items-center">
          <a href="tel:+15178858129">
            <FaPhoneAlt size={20} className="text-blue-800" />
          </a>
          <h1 className="text-xl">+1517-885-8129</h1>
        </div>

        <img
          onClick={() => setShowMobileMenu(true)}
          src={assetsCollection.menuIcon}
          className="w-7 md:hidden"
          alt="MenuIcon"
        />
      </div>

      {/* --- mobile-menu --- */}
      <div
        className={`md:hidden ${
          showMobileMenu ? "fixed h-screen w-full" : "hidden"
        } top-0 right-0 bottom-0 cursor-pointer bg-black text-white transition-all`}
      >
        <div className="flex justify-end pt-6 pr-6">
          <img
            onClick={() => setShowMobileMenu(false)}
            src={assetsCollection.crossIcon}
            className="w-6 cursor-pointer"
            alt="Icon"
          />
        </div>

        <ul className="flex flex-col items-center gap-6 px-5 mt-5 text-3xl font-medium">
          <li>
            <a
              onClick={() => setShowMobileMenu(false)}
              href="/"
              className="inline-block py-2 transition duration-100 ease-in-out rounded-full px-9 hover:bg-amber-400"
            >
              Home
            </a>
          </li>

          <li>
            <a
              onClick={() => setShowMobileMenu(false)}
              href="#about"
              className="inline-block py-2 transition duration-100 ease-in-out rounded-full px-9 hover:bg-amber-400"
            >
              About
            </a>
          </li>

          <li>
            <a
              onClick={() => setShowMobileMenu(false)}
              href="#projects"
              className="inline-block py-2 transition duration-100 ease-in-out rounded-full px-9 hover:bg-amber-400"
            >
              Get A Cab
            </a>
          </li>

          <li>
            <a
              onClick={() => setShowMobileMenu(false)}
              href="#reviews"
              className="inline-block py-2 transition duration-100 ease-in-out rounded-full px-9 hover:bg-amber-400"
            >
              Reviews
            </a>
          </li>

          <li>
            <a
              onClick={() => setShowMobileMenu(false)}
              href="#our news"
              className="inline-block py-2 transition duration-100 ease-in-out rounded-full px-9 hover:bg-amber-400"
            >
              Our News
            </a>
          </li>

          <li>
            <a
              onClick={() => setShowMobileMenu(false)}
              href="#our news"
              className="inline-block py-2 transition duration-100 ease-in-out rounded-full px-9 hover:bg-amber-400"
            >
              Contact
            </a>
          </li>

          <li>
            <a
              href="tel:+15178858129"
              className="flex items-center gap-2 text-blue-800 hover:bg-amber-400 transition  py-2  duration-100 ease-in-out rounded-full px-6"
            >
              <FaPhoneAlt size={24} />
              <span className="text-md font-medium text-white">
                +1 517-885-8129
              </span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
