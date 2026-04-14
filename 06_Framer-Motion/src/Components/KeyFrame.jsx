import React from "react";
import { motion } from "motion/react";

const KeyFrame = () => {
  return (
    <div>
      <motion.div
        className="bg-blue-400 h-52 w-52 border"
        // keyFrame type
        animate={{
          x: [0, 800, 800, 0, 0],
          y: [0, 0, 300, 300, 0],
          rotate: [0, 360, 0, -360, 0],
        }}
        transition={{
          duration: 7,
          delay: 1,
          repeat: 2,
          ease: "backInOut",
        }}
      ></motion.div>
    </div>
  );
};

export default KeyFrame;
