import { motion } from "motion/react";
import React from "react";

const Drag = () => {
  return (
    <div>
      <motion.div
        className="bg-emerald-600 h-52 w-52 border"
        drag
        whileDrag={{
          scale: 0.8,
        }}
        dragConstraints={{
          left: 0,
          top: 0,
          right: 1000,
          bottom: 500,
        }}
        // dragDirectionLock='true'  // move only in one direction
      ></motion.div>
    </div>
  );
};

export default Drag;
