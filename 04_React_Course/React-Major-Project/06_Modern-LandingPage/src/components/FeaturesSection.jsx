import React from 'react'
import { motion } from "framer-motion"
import { fadeIn } from '../utils/motion'

const features = [
    {
      icon: "🔍", 
      title: "Find out what you need",
      description: "We present you a proposal and discuss nitty-gritty like"
    },
    {
      icon: "⚙️",
      title: "Work out the details", 
      description: "Communication protocols apart from engagement models"
    },
    {
      icon: "🚀",
      title: "We get to work fast",
      description: "Protocols apart from engage models, pricing billing"
    }
  ]

const FeaturesSection = () => {
  return (
    <section className='max-w-7xl mx-auto px-4 py-16'>
        {/* heading text */}
        <motion.div 
        variants={fadeIn('down',0.5)}
        initial = "hidden"
         whileInView = "show"
        className='mb-12 text-center'>
            <h2 className='text-3xl font-bold mb-4'>How can We Help Your Business ?</h2>
            <p className='text-gray-600
            '>When you resell besnik, you build trust and increase</p>
        </motion.div>

        {/* boxs */}
        <motion.div 
        variants={fadeIn('up',0.5)}
                            initial = "hidden"
                            whileInView = "show"
        className='grid grid-cols-1 md:grid-cols-3 gap-8 '>
            {features.map((feature, index)=>(
                <div key={index} className='flex flex-col text-center items-center p-6'>
                    <div className='w-24 h-24 rounded-full mb-6 flex items-center justify-center' style={{
                    backgroundColor : index === 0 ? "#f1effd" : index === 1 ? "#fee7e7" : "#fff3e4"}}>
                        <div className='text-3xl'>{feature.icon}</div>
                    </div>

                    <h3 className='text-2xl font-medium mb-3'>{feature.title}</h3>
                    <p className='text-gray-500 text-center'>{feature.description}</p>
                </div>
            ))}
        </motion.div>

        {/* button */}
        <motion.div 
        variants={fadeIn('down',0.5)}
                            initial = "hidden"
                            whileInView = "show"
        className='text-center mt-12'> 
          <button className='bg-[#2cc479] text-white cursor-pointer px-8 py-3 rounded-full font-medium hover:bg-green-600 transition-colors relative'>Become a Partner

            <div className='absolute -z-10 w-full h-full rounded-full bg-green-600/50 blur-xl top-0 left-0'>

            </div>
          </button>
        </motion.div>
    </section>
  )
}

export default FeaturesSection