import React from 'react'
import Banner from '../Banner/Banner'
import { products } from '../ProductList/ProductList'
import Card from "../Card/Card"

function CategoryPage({title,bgImage,categories=[]}) {
    let filterItems = categories.includes("All") ? products :
     products.filter(product=>categories.includes(product.category));


    const renderProduct = filterItems.map(product=>{
        return(
            <Card image={product.image} title={product.name} price={product.price}/>
        )
    })

  return (
    <div>
        <Banner title={title} bgImage={bgImage}/>
        <div className='grid md:grid-cols-4 grid-cols-1 gap-9 m-10 md:py-20 py-10 max-w-[1400px]'>
            {renderProduct}
        </div>
    </div>
  )
}

export default CategoryPage

