import React from 'react'
import heroImage from '../assets/hero-image.png'
import { motion } from "framer-motion"
import { fadeIn, textVariant } from '../utils/motion'
const Hero = () => {
  return (
    <section id='home' className='max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center pt-44 pb-6 px-4 sm:px-6 lg:px-8 '>
        
        {/* left column */}
        <div className='w-full md:w-1/2 space-y-8'>
            {/* star badge */}
           <motion.div
           variants={fadeIn('right',0.2)}
               initial = "hidden"
               whileInView = "show"
           >
           <div className='flex items-center gap-2 bg-gray-50 w-fit px-4 py-2
            rounded-full hover:bg-gray-100 transition-colors cursor-pointer group'>
                <span className='text-[#2cc479] group-hover:text-amber-300 group-hover:scale-110 transition-transform text-1xl'>★</span>
                <span className='text-sm font-medium'>Just start your Growth</span>
            </div>
           </motion.div>

            <motion.h1 
            variants={textVariant(0.3)}
            initial = "hidden"
            whileInView = "show"
            className='text-4xl md:text-4xl lg:text-5xl font-bold leading-tight'>We Boost the Growth for<span className='text-[#2cc479] relative inline-block'>Startup to Fortune 500 <span className='absolute bottom-0 left-0 w-full h-0.5 bg-green-300/60'></span></span>companies<span className='inline-bloc ml-2 animate-pluse'>⏰</span></motion.h1>

            <motion.p 
            variants={fadeIn('up',0.4)}
            initial = "hidden"
            whileInView = "show"
            className='text-gray-600 text-lg md:text-xl max-w-xl'>Get the most accurate leads, sales people training and conversions, tools and more - all within the same one billing.</motion.p>

            <motion.div 
            variants={fadeIn('right',0.4)}
            initial = "hidden"
            whileInView = "show"
            className='flex gap-3 max-w-md'>
                <input type="email" placeholder='Email Address' className='flex-1 px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2cc479] focus:ring-2 focus:ring-green-300 transition-all' />
                <button className='bg-[#2cc479] text-white px-8 py-4 rounded-xl hover:bg-green-600 cursor-pointer transition-all hover:shadow-lg hover:shadow-green-300'>➜</button>
            </motion.div>
        </div>

         {/* right column */}
         <motion.div 
         variants={fadeIn('left',0.5)}
         initial = "hidden"
         whileInView = "show"
         className='w-full md:w-1/2 mt-16 md:mt-0 pl-0 md:pl-12'>
            <div className='relative '>
                <img src={heroImage} alt="Hero Image" className='rounded-lg relative z-10 hover:scale-[1.02] transition-transform duration-300'/>
            </div>
        </motion.div>
    </section>
  )
}

export default Hero