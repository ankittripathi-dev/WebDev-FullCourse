import React, { useState } from 'react'
import Heading from '../Heading/Heading'
import { products } from '../ProductList/ProductList';
import Card from '../Card/Card';
import Button from '../Button/Button';
import { Link } from 'react-router-dom';

function Products() {
    const categories = ["All","Vegetables","Dairy","SeaFood","Meat","Fruits"];
    const [activeTab,setActiveTab] = useState("All")

    const filterItems = activeTab==='All' ? products : products.filter(item=>item.category===activeTab);


    const renderCard = filterItems.slice(0,8).map(product=>{
      return(
        <Card image={product.image} title={product.name} price={product.price}/>
      )
    })



  return (
    <section>
        <div className='max-w-[1400px] px-10 mx-auto py-20'>
            <Heading highlight={"Our"} heading={"Products"}/>

            {/* Tab  */}
            <div className='flex flex-wrap gap-6 justify-center items-center mt-15 '>
                {
                    categories.map(category=>{
                        return(
                          <button key={category} className={` py-2 w-[120px]  rounded-lg cursor-pointer transition-all hover:scale-110
                           font-semibold text-lg ${activeTab===category ? " bg-gradient-to-b from-orange-500 to-orange-600 text-white":
                           "bg-zinc-300 "}`} onClick={()=>setActiveTab(category)}>
                            {category}
                          </button>
                        )
                    })
                }
            </div>

            {/* Card listing */}
            <div className='grid md:grid-cols-4 grid-cols-1 gap-9 mt-25'>
              {renderCard}
            </div>

            <div className='mt-10 mx-auto w-fit'>
              <Link  to={"/all-products"} className="bg-orange-600 rounded-[5px] text-white md:px-7 md:py-2 px-5 py-2  mt-2 text-lg hover:scale-105 cursor-pointer hover:bg-orange-500">
            View All
          </Link>
            </div>

        </div>
    </section>
  )
}

export default Products

