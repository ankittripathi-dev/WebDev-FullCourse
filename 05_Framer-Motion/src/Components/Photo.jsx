import { motion } from "motion/react";
import React from "react";
import oogy from "../assets/oogy.png";
import { animate } from "motion";

const Photo = () => {
  return (
    <div>
      <motion.img
        className="h-52"
        animate={{
          x: 1000,
        }}
        transition={{
          duration: 3,
          delay: 1,
          repeat: Infinity,
          ease: "anticipate",
        }}
        src={oogy}
      />
    </div>
  );
};

export default Photo;
