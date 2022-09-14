import React from "react";
import { motion } from "framer-motion";

const Animations = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};
const AnimatedRoutes = ({ children }) => {
  return (
    <motion.div
      variants={Animations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 1 }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedRoutes;
