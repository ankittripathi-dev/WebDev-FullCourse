import React from 'react'
import Banner from '../Banner/Banner'
import CategoryPage from "../CategoryPage/CategoryPage"
import Bgimage from "../../assets/seafood-banner.jpg"

function Meat() {
  return (
    <div>
    <CategoryPage title={"Meat & SeaFood"} bgImage={Bgimage} categories={["Meat","SeaFood"]}/>
  
    </div>
  )
}

export default Meat