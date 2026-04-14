import Navbar from "../Navbar/Navbar";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <div
      className="flex items-center w-full min-h-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url(/taxiimage.avif)" }}
    >
      <Navbar />


      {/* framer Motion Animation */}
      <motion.div
        initial={{ opacity: 0, y: -200 }}
        transition={{ duration: 1.5 }}
        whileInView={{ opacity: 1, y: -120 }}
        viewport={{ once: true }}
        // viewport={{ once: false }} //infinate time when scroll up down
        className="container px-6 py-4 mx-auto text-center text-white md:px-20 overflow-x-hidden"
      >
        <h2 className="inline-block max-w-4xl text-6xl font-semibold sm:text-7xl md:text-[76px]">
          Book Your Luxury Ride
        </h2>
        <h3>
          Premium taxi service available 24/7. Professional drivers, comfortable
          vehicles.
        </h3>
      </motion.div>
      <h1 className="text-2xl text-white"></h1>
    </div>
  );
};

export default Header;
