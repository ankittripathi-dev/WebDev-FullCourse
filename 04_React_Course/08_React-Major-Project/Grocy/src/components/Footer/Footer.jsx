import React from "react";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { FaCopyright, FaRegCopyright } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";

function Footer() {
  return (
    <footer className="bg-zinc-100 py-20">
      <div className="flex flex-wrap max-w-[1400px] gap-y-6 gap-x-5 px-10  mx-auto">
        <div className="flex-1 basis-[300px]">
          <a href="#" className="text-3xl font-bold ">
            Gr<span className="text-orange-600">O</span>cy
          </a>
          <p className="text-zinc-600 mt-6 max-w-[350px]">
            Bred for a high content of beneficial substances. Our products are all fresh and healthy.
          </p>
           <p className="text-sm text-zinc-800 mt-2 font-semibold">
                 {new Date().getFullYear()} &copy; All Rights Reserved
           </p>
        </div>

        <ul className="flex-1">
            <li>
                <h5 className="text-zinc-800 text-2xl font-bold">Company</h5>
            </li>
            <li className="mt-6">
                <a href="#" className=" text-zinc-800 hover:text-orange-600">About</a>
            </li>
            <li className="mt-6">
                <a href="#" className=" text-zinc-800 hover:text-orange-600">FAQ'S</a>
            </li>
        </ul>

          <ul className="flex-1">
            <li>
                <h5 className="text-zinc-800 text-2xl font-bold">Support</h5>
            </li>
            <li className="mt-6">
                <a href="#" className=" text-zinc-800 hover:text-orange-600">Support Center</a>
            </li>
            <li className="mt-6">
                <a href="#" className=" text-zinc-800 hover:text-orange-600">Feedback</a>
            </li>
            <li className="mt-6">
                <a href="#" className=" text-zinc-800 hover:text-orange-600">Contact Us</a>
            </li>
        </ul>

       <div className="flex-1">
           <h5 className="text-zinc-800 w-full text-2xl font-bold">Stay Connected</h5>
           <p className="text-zinc-700 mt-6">
            Questions or Feedbacks? <br/> We'd love to hear from you.
           </p>

           <div className="flex w-[250px] bg-zinc-300 p-1 rounded-lg mt-6 max-w-sm">
            <input type="email" name="email" id="email" autoComplete="off" placeholder="Email Address" 
            className="h-[5vh] flex-1 pl-4 focus:outline-none"/>

            <button className="bg-orange-600 rounded-lg cursor-pointer px-3 
             text-white p-2 hover:bg-amber-600">
                <IoIosArrowForward/>
            </button>
           </div>
       </div>

      </div>
    </footer>
  );
}

export default Footer;




