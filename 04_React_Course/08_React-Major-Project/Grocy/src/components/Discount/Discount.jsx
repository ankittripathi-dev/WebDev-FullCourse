import React from 'react'
import Button from '../Button/Button'
import FruitsSet from "../../assets/fresh-fruits.png"

function Discount() {
  return (
    <section className='bg-zinc-200 md:py-20 md:px-10 px-5  md:bg-contain md:bg-no-repeat md:bg-right'  style={{backgroundImage:`url(${FruitsSet})`}}>
      <div className='flex md:flex-row flex-col max-w-[1400px]  mx-auto px-10 md:py-10 py-4'>
          <span className='md:text-9xl text-5xl  text-orange-600 font-bold transform md:-rotate-90 h-fit md:self-center'>20%</span>
         <div className='max-w-[700px]'>
          <h3 className='md:text-7xl text-4xl text-zinc-800 font-bold mt-2'>
            First Order Discount!
          </h3>
          <p className='text-zinc-600 md:my-6 my-4 '>Enjoy an exclusive first order discount on our grocery website! Shop fresh essentials and save big on your first purchase. Fast delivery and quality guaranteed.</p>
          <Button content={"Get a Discount"}/>
         </div>
        

      </div>
    </section>
  )
}

export default Discount

