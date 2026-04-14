import React from "react";
import car from "../../assets/white-car.png";

const About = () => {
  return (
    <div className="dark:bg-dark bg-slate-100 sm:min-h-[600px] sm:grid sm:place-items-center duration-300">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 place-items-center">
          <div data-aos="slide-right" data-aos-duration="1500">
            <img
              src={car}
              alt=""
              className="sm:scale-125 sm:-translate-x-11 max-h-[300px] drop-shadow-[2px_10px_6px_rgba(0,0,0,0.50)]"
            />
          </div>
          <div>
            <div className="space-y-5 sm:p-16 pb-6">
              <h1
                data-aos="fade-up"
                className="text-3xl sm:text-4xl font-bold font-serif"
              >
                About us
              </h1>
              <p data-aos="fade-up" className="leading-8 tracking-wide">
                Welcome to CarRental.com, where our passion for empowering journeys meets unparalleled service. As seasoned navigators of the road, we are dedicated to transforming your travel dreams into seamless, unforgettable experiences. Explore with confidence, comfort, and style as we redefine the art of car rental, ensuring that every mile with us is a story worth telling.
              </p>
              {/* <button data-aos="fade-up" className="button-outline">
                Get Started
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
