import React from 'react'

function Banner({title,bgImage}) {
  return (
    <div className=' md:h-[50vh] h-[30vh] md:mt-25 mt-20 flex justify-center items-center bg-center bg-cover relative'style={{backgroundImage:`url(${bgImage})`}}>
        <h2 className='md:text-5xl text-2xl text-zinc-800 bg-white p-5 rounded-xl font-bold z-10' >{title}</h2>
        <div className='bg-black/20 absolute inset-0 '>

        </div>
    </div>
  )
}

export default Banner

