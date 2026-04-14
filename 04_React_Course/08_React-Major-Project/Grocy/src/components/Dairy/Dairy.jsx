import React from 'react'
import CategoryPage from '../CategoryPage/CategoryPage'
import BgImage from "../../assets/dairy-banner.jpg";


function Dairy() {
  return (
    <div>
      <CategoryPage title={"Dairy & Eggs"} bgImage={BgImage} categories={["Dairy","Eggs"]}/>
    </div>
  )
}

export default Dairy