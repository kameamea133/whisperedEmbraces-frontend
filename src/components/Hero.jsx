import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-[50vh] md:min-h-[75vh] lg:min-h-screen overflow-hidden">
      {/* Video background */}
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
        {t('hero.videoError')}
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-20 z-10"></div>

      {/* Hero text */}
      <div className="absolute flex flex-col justify-center px-4 pt-[30%] md:px-8 md:py-16 lg:px-10 md:top-[25%] z-20 text-white text-left">
        <motion.h1
          className="text-[5rem] md:text-[6rem] lg:text-[8rem] mb-[-30px] font-whisper leading-tight text-shadow"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 5, delay: 1.5 }}
        >
          {t('hero.title1')}
        </motion.h1>
        <motion.h1
          className="text-[5rem] md:text-[6rem] lg:text-[8rem] font-whisper leading-tight text-shadow"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 5, delay: 2.5 }}
        >
          {t('hero.title2')}
        </motion.h1>
        <motion.p
          className="text-[1.5rem] h-[20px] md:text-[6rem] lg:text-[3rem] font-whisper leading-tight text-shadow"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 5, delay: 3.5 }}
        >
          {t('hero.text')}
        </motion.p>
      </div>
    </section>
  );
};

export default Hero;
