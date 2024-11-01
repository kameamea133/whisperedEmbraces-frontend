
import { motion } from "framer-motion";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="h-12 w-12 border-4 border-t-blue-400 border-b-blue-400 border-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "linear",
        }}
      />
    </div>
  );
};

export default Spinner;
