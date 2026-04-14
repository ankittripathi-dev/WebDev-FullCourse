import React from "react";
import "./Hero.css";

const Hero = () => {
  return (
    <main className="hero">
      <div className="hero-content">
        <h1>Your Feet Derserve The Best</h1>
        <p>
          Your Feet Derserve The Best And We're Here to Help You With Our Shoes.
          Your journey starts with the right pair
        </p>

        <div className="hero-btn">
          <button className="primary-btn">Shop Now</button>
          <button className="secondary-btn">Category</button>
        </div>

        <div className="shopping">
          <p>Also Available On</p>

          <div className="brand-icons">
            <img src="/Images/flipkart.png" alt="flipkart" />
            <img src="/Images/amazon.png" alt="amazon" />
          </div>
        </div>
      </div>

      <div className="hero-image">
        <img src="/Images/jordan_image.png" alt="shoes" />
      </div>
    </main>
  );
};

export default Hero;
