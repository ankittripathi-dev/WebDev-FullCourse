import React from 'react'
import monitorImage from "../assets/monitor-card.webp"
import { FaArrowRightLong } from "react-icons/fa6";
import { motion } from "framer-motion"
import { fadeIn } from '../utils/motion'

const MonitorSection = () => {
  return (
    <section className='max-w-7xl mx-auto px-4 py-16 md:py-24'>

    <div className='flex flex-col md:flex-row items-center justify-between gap-12 md:gap-24'>
        {/* left */}
        <motion.div 
        variants={fadeIn('right',0.5)}
        initial = "hidden"
        whileInView = "show"
        className='md:w-1/2 w-full'>
            <p className='text-[#2cc479] font-semibold'>MONITOR</p>

            <h2 className='text-3xl md:text-4xl font-bold text-neutral-900 mt-4 mb-6 md:w-4/5'>Introducing Best Mobile Carousels</h2>

            <p className='text-gray-600 mb-8'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Necessitatibus aspernatur nobis error sapiente explicabo deleniti doloribus repellat quaerat quam quo. Necessitatibus sed qui eaque iste. Lorem ipsum dolor sit amet.</p>

            <a href="#" className='text-blue-500 font-semibold flex items-center gap-2 hover:gap-4 transition-all'>
                Learn more about monitoring
                <FaArrowRightLong className='w-7 h-7'/>
            </a>
        </motion.div>


        

        {/* right */}
        <motion.div 
        variants={fadeIn('left',0.5)}
        initial = "hidden"
        whileInView = "show"
        className='md:w-1/2 w-full'>
            <img src={monitorImage} alt="Monitor Image" className='w-full h-auto' />
        </motion.div>
    </div>
    
    </section>
  )
}

export default MonitorSection