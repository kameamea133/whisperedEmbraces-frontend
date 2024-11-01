import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  

  useEffect(() => {
    setIsLoaded(true); // Activer le fondu en entrée lorsque le composant est monté
  }, []);

  
  return (
    <section className="relative h-screen overflow-hidden">
    {/* Image de fond avec effet Parallax */}
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: "url('/hero3.webp')"
      }}
    ></div>

    {/* Overlay sombre */}
    <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

    {/* Titre avec effet de fondu */}
    <div className="absolute bottom-[200px] right-[100px] z-20 text-white text-right">
      <motion.h1
        className="text-[167px] font-whisper leading-[1]"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 5, delay: 1.5 }}
      >
        Étreintes
      </motion.h1>
      <motion.h1
        className="text-[167px] font-whisper leading-[1] ml-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 5, delay: 2.5 }}
      >
        Murmurées
      </motion.h1>
    </div>
  </section>
  )
}

export default Hero