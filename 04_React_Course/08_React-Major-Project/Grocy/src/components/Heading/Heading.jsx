import React from 'react'

function Heading({highlight,heading}) {
  return (
    <div className='w-fit mx-auto'>
                <h2 className=' md:text-5xl text-3xl font-bold '>
                <span className='text-orange-600'>{highlight}</span> {heading}</h2>
                <div className='md:w-30 w-20 h-1 md:mt-3 mt-2 ml-auto bg-orange-400'></div>
            </div>
  )
}

export default Heading