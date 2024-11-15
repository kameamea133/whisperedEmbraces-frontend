import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-[50vh] md:min-h-[75vh] lg:min-h-screen overflow-hidden">
    <video
      className="absolute inset-0 w-full h-full object-cover"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      onLoadedData={() => setIsLoaded(true)}
    >
      <source src="/bgVideo.mp4" type="video/mp4" />
      Votre navigateur ne prend pas en charge la lecture de vidéos.
    </video>

    {/* dark overlay */}
    <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

    <div className="absolute flex flex-col justify-center px-4 pt-[30%] md:px-8 md:py-16 lg:px-10 md:top-[30%] z-20 text-white text-left">
      <motion.h1
        className="text-[5rem] md:text-[6rem] lg:text-[8rem] mb-[-30px] font-whisper leading-tight text-shadow"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 5, delay: 1.5 }}
      >
        Étreintes
      </motion.h1>
      <motion.h1
        className="text-[5rem] md:text-[6rem] lg:text-[8rem] font-whisper leading-tight text-shadow"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 5, delay: 2.5 }}
      >
        Éphémères
      </motion.h1>
      <motion.h3
        className="text-[2rem] md:text-[2.5rem] lg:text-[3.5rem] font-whisper leading-tight text-shadow"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 5, delay: 3.5 }}
      >
        (ephemeral embraces)
      </motion.h3>
    </div>
  </section>
  );
};

export default Hero;
