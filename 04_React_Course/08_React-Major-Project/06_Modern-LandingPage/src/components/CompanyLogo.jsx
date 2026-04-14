import React from 'react'
import slack from '../assets/slack.png'
import amazon from '../assets/amazon.png'
import woocommerce from '../assets/woocommerce.png'
import meundies from '../assets/meundies.png'
import sitepoint from '../assets/sitepoint.png'
import { motion } from "framer-motion"
import { fadeIn } from '../utils/motion'

const CompanyLogo = () => {

    const logos = [slack, amazon, woocommerce, meundies, sitepoint]

  return (
    <motion.div 
    variants={fadeIn('right',0.3)}
        initial = "hidden"
        whileInView = "show"
    className='w-full overflow-hidden max-w-screen-xl mx-auto py-20 gap-8 flex sm:flex-row flex-col sm:items-center items-start'>
        <div className='w-[300px] shrink-0 px-5 text-gray-600 border-l-4 border-[#2cc479] bg-white py-2 z-10 sm:text-base lg:text-xl font-semibold text-left'>Proud partner at <br />Hubspot & Segment</div>

        <motion.div 
        variants={fadeIn('left',0.4)}
            initial = "hidden"
            whileInView = "show"
        className='flex animate-marquee whitespace-nowrap'>
            {logos.map((logo, index)=>(
                <img key={index} src={logo} alt="company logo"className='mx-12 h-8 w-36 object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all'/>
            ))}

            {/* duplicate logos */}
            {logos.map((logo, index)=>(
                <img key={`duplicate-${index}`} src={logo} alt="company logo"className='mx-12 h-8 w-36 object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all'/>
            ))}
        </motion.div>
        </motion.div>
  )
}

export default CompanyLogo