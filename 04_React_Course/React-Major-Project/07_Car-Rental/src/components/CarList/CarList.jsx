import React from "react";
import whiteCar from "../../assets/white-car.png";
import car2 from "../../assets/car5.png";
import car1 from "../../assets/MGcomet1.png";
import car3 from "../../assets/creta.png";
import car4 from "../../assets/swift.png";
import car5 from "../../assets/i20.png";
import car6 from "../../assets/MarutiErtiga.png";
import car7 from "../../assets/ToyotaInnovaCrysta.png";
import car8 from "../../assets/toyotafortuner.png";
import car9 from "../../assets/Thar.png";

const carList = [
  {
    name: "MG Comet",
    price: 2200,
    image: car1,
    aosDelay: "0",
  },
  {
    name: "Mahindra Scorpio",
    price: 4500,
    image: car2,
    aosDelay: "500",
  },
  {
    name: "Hyundai Creta",
    price: 4000,
    image: car3,
    aosDelay: "1000",
  },
  {
    name: "Maruti Swift",
    price: 2000,
    image: car4,
    aosDelay: "1000",
  },
  {
    name: "Hyundai i20",
    price: 3000,
    image: car5,
    aosDelay: "1000",
  },
  {
    name: "Maruti Ertiga",
    price: 3500,
    image: car6,
    aosDelay: "1000",
  },
  {
    name: "Toyota Innova Crysta",
    price: 5500,
    image: car7,
    aosDelay: "1000",
  },
  {
    name: "Toyota Fortuner",
    price: 10000,
    image: car8,
    aosDelay: "1000",
  },
  {
    name: "Mahindra Thar",
    price: 5500,
    image: car9,
    aosDelay: "1000",
  },
];

const CarList = () => {
  return (
    <div className="pb-24">
      <div className="container">
        {/* Heading */}
        <h1
          data-aos="fade-up"
          className="text-3xl sm:text-4xl font-semibold font-serif mb-3"
        >
          Cars Available for Rent
        </h1>
        <p data-aos="fade-up" aos-delay="400" className="text-sm pb-10">
          Choose from a wide range of cars available for rent
        </p>
        {/* Car listing */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16">
            {carList.map((data) => (
              <div
                data-aos="fade-up"
                data-aos-delay={data.aosDelay}
                className="space-y-3 border-2 border-gray-300 hover:border-primary p-3 rounded-xl relative group"
              >
                <div className="w-full h-[120px]">
                  <img
                    src={data.image}
                    alt=""
                    className="w-full h-[120px] object-contain sm:translate-x-8 group-hover:sm:translate-x-16 duration-700"
                  />
                </div>
                <div className="space-y-2">
                  <h1 className="text-primary font-semibold">{data.name}</h1>
                  <div className="flex justify-between items-center text-xl font-semibold">
                    <p>₹{data.price}/Day</p>
                    <a href="#">Details</a>
                  </div>
                </div>
                {/* <p className="text-xl font-semibold absolute top-0 left-3">
                  12Km
                </p> */}
              </div>
            ))}
          </div>
        </div>
        {/* End of car listing */}
        <div className="grid place-items-center mt-8">
          {/* <button data-aos="fade-up" className="button-outline">
            Get Started
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default CarList;
