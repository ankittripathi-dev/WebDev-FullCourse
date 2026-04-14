import React from "react";
import Header from "./Components/Header";
import Home from "./Components/Home";
import Footer from "./Components/Footer";

const App = () => {
  return (
    <div className="bg-gradient-to-br from-[#e9f1fd] via-[#e3eafe] to-[#f4f7ff] min-h-screen flex flex-col justify-center items-center py-8 px-4 overflow-x-hidden">
      <Header />
      <Home />
      <Footer />
    </div>
  );
};

export default App;
