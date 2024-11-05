import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative h-[50vh] md:h-[75vh] lg:h-screen overflow-hidden">
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
      <div className="absolute inset-0 bg-black opacity-10 z-10"></div>

      <div className="absolute bottom-[50px] md:bottom-[100px] lg:bottom-[50px] left-4 md:left-8 lg:left-10 z-20 text-white text-left">
        <motion.h1
          className="text-[100px] md:text-[80px]  lg:text-[200px] font-whisper leading-tight md:leading-[1] text-shadow"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 5, delay: 1.5 }}
        >
          Étreintes
        </motion.h1>
        <motion.h1
          className="text-[100px] md:text-[80px] lg:text-[200px] font-whisper leading-tight md:leading-[1] ml-2 md:ml-4 lg:ml-10 text-shadow"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 5, delay: 2.5 }}
        >
          Éphémères
        </motion.h1>
        <motion.h3
          className="text-[40px] md:text-[32px] lg:text-[67px] font-whisper leading-tight md:leading-[1] ml-2 md:ml-4 lg:ml-10 text-shadow"
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
