import { motion } from "motion/react";
import React from "react";

const Hover = () => {
  return (
    <div>
      <motion.div
        className="bg-green-400 h-52 w-52 border"
        whileHover={{
          backgroundColor: "orange",
        }}
    
        whileTap={{
          scale:0.8
        }}  
      ></motion.div>
    </div>
  );
};

export default Hover;
