import React from "react";
import Navbar from "../Navbar/Navbar";
import Hero from "../Hero/Hero";
import Category from "../Category/Category";
import Values from "../Values/Values";
import Products from "../Products/Products";
import Discount from "../Discount/Discount";
import Process from "../Process/Process";
import Testimonials from "../Testimonials/Testimonials";
import Footer from "../Footer/Footer";
import Layout from "../Layout/Layout";

function Home() {
  return (
    <div>
     
      <Hero />
      <Category/>
      <Values/>
      <Products/>
      <Discount/>
      <Process/>
      <Testimonials/>
    </div>
  );
}

export default Home;