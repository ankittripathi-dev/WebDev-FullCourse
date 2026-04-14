import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
};

export default Layout;
