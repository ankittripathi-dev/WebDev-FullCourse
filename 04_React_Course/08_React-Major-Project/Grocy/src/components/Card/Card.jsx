import React from 'react'
import { FaHeart } from 'react-icons/fa6'
import Button from "../Button/Button"
import { TiPlus } from "react-icons/ti";


function Card({image,title,price}) {
  return (
    <div className='bg-zinc-200 p-5 rounded-xl transition-all hover:bg-zinc-300 '>
        
        {/* heart , plus */}
        <div className='flex  justify-between'>
          <span className='text-3xl text-zinc-400'>
              <FaHeart className='cursor-pointer'/>
          </span>
          <button className='text-3xl rounded-lg bg-gradient-to-b from-orange-600 to-orange-600 text-white'>
            {/* <FaCartPlus/> */}
            <TiPlus className='cursor-pointer'/>
          </button>
        </div>

        {/* image content */}
        <div className='w-full h-50'>
            <img src={image} className='w-full h-full object-contain'/>
        </div>

        {/* Card content like title, price , button */}
        <div className='text-center '>
            <h3 className='text-xl font-semibold'>{title}</h3>
            <p className='text-xl font-bold mt-2 mb-2'>${price.toFixed(2)}</p>
            <Button content={"Shop Now"}/>
        </div>
    </div>
  )
}

export default Card

