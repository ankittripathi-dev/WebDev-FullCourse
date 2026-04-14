import React from 'react';
import { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import { motion } from "framer-motion"
import { fadeIn } from '../utils/motion'

const Navbar = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('#home');

  const navLinks = [
    {href: "#home" , label:"Home"},
    {href: "#about" , label:"About Us"},
    {href: "#services" , label:"Our Services"},
    // {href: "#testimonials" , label:"Testimonials"}
  ]

  return (
    <motion.nav 
    variants={fadeIn('down',0.2)}
    initial = "hidden"
    whileInView = "show"
    viewport = {{once:true}}
    className='fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-50  border-grey-100 shadow-lg'>

        <div className='w-full max-w-screen-xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 md:h-20 h-16'>

            {/* Logo */}
            <div className='flex items-center gap-1 cursor-pointer'>
                <div className='w-4 h-4 bg-[#2cc479] rounded-full opacity-75 hover:opacity-100 transition-opacity'></div>
                <div className='w-4 h-4 bg-[#fa5f69] -ml-2 rounded-full opacity-100 hover:opacity-75 transition-opacity'></div>
            </div>

             {/* mobile menu */}
             <button onClick={()=>setIsMenuOpen(!isMenuOpen)} className='md:hidden p-2 '>
                {
                    isMenuOpen ? <HiX className='size-6'/> : <HiMenu className='size-6'/>
                }
             </button>

            {/* Navbar items */}
            <div className='hidden md:flex items-center gap-10'>
                {
                    navLinks.map((link, index) =>(
                        <a key={index} href={link.href} onClick={()=> setActiveLink(link.href)} className={`text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-[#2cc479] after:transition-all ${activeLink === link.href ? "text-[#2cc479] after:w-full" : "text-gray-700 hover:text-gray-900"}`}>
                            {link.label}
                            </a>
                    ))
                }
            </div>


            {/* getintouch button */}
            <button className='hidden md:block bg-[#2cc479] text-white px-6 py-2.5 rounded-lg hover:bg-green-600 text-sm font-medium transition-all hover:shadow-lg hover:shadow-blue-100'>
                <a href="#newsletter">Get in Touch</a>
            </button>

           

        </div>


        {/* mobile menu items */}

        {
            isMenuOpen && (
                <div className='md:hidden bgwhite border-t border-gray-100 py-4 text-center '>
                     <div className='container mx-auto px-4 space-y-3'>
                        {navLinks.map((link, index) => (
                            <a key={index} onClick={()=>{
                                setActiveLink(link.href);
                                setIsMenuOpen(false);
                            }} className={`block text-sm font-medium py-2 ${activeLink === link.href ? "text-[#2cc479]" : "text-gray-700 hover:text-gray-900"}`} href={link.href}>{link.label}</a>
                        ))}

                <button className='w-full bg-[#2cc479] text-white px-6 py-2.5 rounded-lg hover:bg-[#72d8b3] text-sm font-medium transition-all hover:shadow-lg hover:shadow-blue-100'>
                <a href="#newsletter">Get in Touch</a>
                </button>
                     </div>
                </div>
            )
        }
    </motion.nav>
  );
};

export default Navbar;
