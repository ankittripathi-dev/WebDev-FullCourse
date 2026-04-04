import React from "react";
import { motion } from "motion/react";

const Box = () => {
  return (
    <div >
      <motion.div
        className="bg-red-400 h-52 w-52 border"
        initial={{
          x: 300,
        }}
        animate={{
          x: 1100,
          rotate: 360,
        }}
        transition={{
          duration: 3,
          delay: 1,
          repeat: 2,
          // repeat:Infinity,
          ease: "backInOut",
          // ease:"circIn"
        }}
      ></motion.div>
    </div>
  );
};

export default Box;
