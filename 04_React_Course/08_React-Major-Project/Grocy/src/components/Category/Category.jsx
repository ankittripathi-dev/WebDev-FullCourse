import React from "react";
import Heading from "../Heading/Heading";
import FruitsVeggies from "../../assets/fruits-and-veggies.png";
import EggsDiary from "../../assets/dairy-and-eggs.png";
import MeatSeaFood from "../../assets/meat-and-seafood.png";
import Button from "../Button/Button";
import { Link } from "react-router-dom";
function Category() {
  const renderCard = category.map((card) => {
    return (
      <div className="flex-1 basis-[300px]">
        {/* card image */}
        <div
          className=" w-full min-h-[30vh] rounded-2xl relative mb:-mb-10 -mb-25"
          key={card.id}
        >
          <img src={card.image} className="absolute bottom-0" />
        </div>
        {/* card content */}
        <div className="bg-zinc-100 pt-35 p-8 rounded-xl ">
          <h3 className="text-zinc-800 text-3xl font-bold">{card.title}</h3>
          <p className="text-zinc-600 mt-3 mb-9 ">{card.description}</p>
          <Link  to={card.path} className="bg-orange-600 rounded-[5px] text-white md:px-7 md:py-2 px-5 py-2  mt-2 text-lg hover:scale-105 cursor-pointer hover:bg-orange-500">
            See All
          </Link>
        </div>
      </div>
    );
  });
  return (
    <div>
      <section>
        <div className="max-w-[1400px] mx-auto px-10 py-20 ">
          <Heading highlight="Shop" heading="by Category" />

          {/*Category Card */}
          <div className="flex md:gap-10 gap-0 md:mt-12 mt-8 flex-wrap">
            {renderCard}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Category;

const category = [
  {
    id: 1,
    title: "Fruits & Veggies",
    description:
      "Fresh, organic produce sourced daily from local farms. Explore a wide range of seasonal fruits and crisp vegetables.",
    image: FruitsVeggies,
    path:"/fruits-veggies"
  },
  {
    id: 2,
    title: "Dairy & Eggs",
    description:
      "Wholesome dairy products and free-range eggs. From creamy milk and yogurt to artisanal cheeses.",
    image: EggsDiary,
    path:"/dairy-eggs"
  },
  {
    id: 3,
    title: "Meat & SeaFood",
    description:
      "High-quality, responsibly sourced meat and seafood. Choose from fresh cuts, marinated options, and more.",
    image: MeatSeaFood,
    path:"/meat-seafood"
  },
];
