import React from 'react'
import CategoryPage from '../CategoryPage/CategoryPage'
import Bgimage from "../../assets/all-banner.jpg"

function AllProducts() {
  return (
    <div>
      <CategoryPage title={"All Products "} bgImage={Bgimage} categories={["All"]}/>
    </div>
  )
}

export default AllProducts

