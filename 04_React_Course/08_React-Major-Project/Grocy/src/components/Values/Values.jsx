import React from 'react'
import Heading from '../Heading/Heading'
import { FaHeart } from "react-icons/fa";
import { SiCodefresh } from "react-icons/si";
import { FaSeedling, FaShield } from 'react-icons/fa6';
import BasketFoods from "../../assets/basket-full-vegetables.png"


function Values() {
    const leftValues = values.slice(0,2).map(item=>{
      return(
           <div className='flex md:flex-row-reverse gap-5 ' key={item.id}>
            <div className='flex items-center'>
                <span className='bg-gradient-to-b from bg-orange-500 to-orange-600 w-15 h-15 rounded-full flex justify-center items-center text-2xl text-white'>{item.image}</span>
            </div >
            <div className='md:text-right w-1/1'>
                <h4 className='text-zinc-800 md:text-3xl text-2xl font-bold mb-1'>{item.title}</h4>
                <p>{item.description}</p>
            </div>
        </div>
      )
    })
    
    const rightValues = values.slice(2).map(item=>{
        return(
            <div className='flex gap-5 mt-5' key={item.id}>
            <div className=' flex items-center'>
                <span className='bg-gradient-to-b from bg-orange-500 to-orange-600 w-15 h-15 rounded-full flex justify-center items-center text-2xl text-white'>{item.image}</span>
            </div>
            <div className='text-left w-1/1'>
                <h4 className='text-zinc-800 md:text-3xl text-2xl font-bold mb-1'>{item.title}</h4>
                <p>{item.description}</p>
            </div>
        </div>
        )
    })

  return (
    <section>
        <div className='max-w-[1400px] mx-auto  px-10 md:py-20 py-10'>
          <Heading highlight={"Our"} heading={"Values"}/>

          <div className='flex md:gap-5 mt-15  md:flex-row flex-col'>

            {/* Left icons values */}
            <div className='md:min-h-100 md:gap-10 gap-5 md:w-1/4 flex flex-col justify-around '>
               {leftValues}
            </div>

            {/* Middle image */}
            <div className='md:w-2/4 md:flex hidden mx-auto'>
                <img src={BasketFoods} className='md:w-full md:h-auto'/>
            </div>

            {/* Right values */}
            <div className='md:min-h-100 md:gap-10 md:w-1/4  flex flex-col justify-around '>
             {rightValues}
            </div>
          </div>

        </div>
    </section>
  )
}

export default Values

const values = [
    {
        id:1,
        title:'Trust',
        description:'It is a long established fact that a reader will be distracted by the readable.',
        image:<FaHeart />
    },
    {
        id:2,
        title:'Always Fresh',
        description:'It is a long established fact that a reader will be distracted by the readable.',
        image:<SiCodefresh />
    },
    {
        id:3,
        title:'Food Safety',
        description:'From farm to kitchen, we make sure everything you eat is at its peak freshness.',
        image:<FaShield/>
    },
    {
        id:4,
        title:'100% Organic',
        description:'Our ingredients are sourced from trusted organic farms, grown naturally without chemicals or pesticides.',
        image:<FaSeedling/>
    }
]


