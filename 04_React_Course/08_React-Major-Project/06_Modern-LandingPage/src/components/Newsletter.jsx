import React from 'react'
import { FaArrowRightLong } from "react-icons/fa6";
import { motion } from "framer-motion"
import { fadeIn } from '../utils/motion'

const Newsletter = () => {
  return (
   <section className='max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16' id='newsletter'>
    
    <div 
     
    className='bg-[#2cc479] rounded-2xl overflow-hidden'>
        <motion.div 
        variants={fadeIn('up',0.5)}
        initial = "hidden"
        whileInView = "show"
        className='relative md:px-16 py-16 px-6 md:py-24'>
            {/* graident bg */}
            <div className='absolute top-0 right-0 w-1/2 h-full bg-[#15d474] clip-path-slant hidden md:block'></div>


            <div className='relative flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12'>
                {/* left content */}
                <div className='text-white max-w-lg text-center md:text-left'>
                    <h2 className='text-2xl sm:text-3xl lg:text-4xl font-medium mb-4'>Subscribe NewsLetter !</h2>
                    <p className='text-green-100 text-sm sm:text-base'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorem, deleniti recusandae eum reiciendis aliquid harum?</p>
                </div>

                {/* right form */}
                <div className='flex flex-col sm:flex-row gap-4 sm:gap-0'>
                    <input type="text" placeholder='Enter Your Email Address' className='w-full bg-white sm:w-auto md:w-80 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-l-xl sm:rounded-r-none focus:outline-none'/>

                    <button className='w-full max-md:w-35 max-md:ml-7 sm:w-auto cursor-pointer bg-blue-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-l-none sm:rounded-r-lg flex items-cente gap-2'>
                        <span>Discover</span>
                        <FaArrowRightLong className='size-5 mt-0.5'/>
                    </button>
                </div>
            </div>
        </motion.div>
    </div>

    <style>
        {
            '.clip-path-slant{clip-path:polygon(10% 0%,100% 0%,100% 100%,0% 100%)}'
        }
    </style>
   </section>
  )
}

export default Newsletter