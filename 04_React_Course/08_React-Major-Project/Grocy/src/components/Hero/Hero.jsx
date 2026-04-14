import React from "react";
import Grocery from "../../assets/grocery.png";
import Button from "../Button/Button";

function Hero() {
  return (
    <section>
      <div className=" min-h-screen max-w-[1400px] mx-auto px-10 flex md:flex-row flex-col  items-center md:pt-35 pt-30">
        {/* Hero content */}
        <div className="flex-1">
          <span className="bg-orange-100 text-orange-500 text-lg md:px-5 px-4 py-2 rounded-full">
            Export Best Quality...
          </span>
          <h1 className="text-4xl/13 md:text-7xl/22  font-bold mt-4">
            Tasty Organic <span className="text-orange-600">Fruits</span> &{" "}
            <span className="text-orange-600">Veggies</span> <br/>In Your City{" "}
          </h1>
          <p className="text-zinc-600 md:text-lg text-md mt-5  max-w-[530px] mb-2">
            Bred for a high content of beneficial substances. Our products are
            all fresh and healthy.
          </p>
          <Button content={"Shop Now"} />
        </div>

        {/* Image content */}
        <div className="flex-1">
          <img src={Grocery} alt="Hero Image" />
        </div>
      </div>
    </section>
  );
}

export default Hero;




