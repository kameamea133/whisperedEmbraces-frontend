import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';

const AboutSection = () => {
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const { t } = useTranslation();

  const handleButtonClick = () => {
    if (userInfo) {
      navigate('/posts'); 
    } else {
      navigate('/login'); 
    }
  };

  const texts = [
    t('about.text1'),
    t('about.text2'),
    t('about.text3'),
    t('about.text4')
  ];

  return (
    <div className='flex flex-col'>
      <div 
        id="about"
        className="flex items-center justify-center w-[90%] lg:w-[76%] mx-auto md:h-screen bg-[url('/aboutBg.png')] bg-cover bg-no-repeat bg-center my-10 md:my-[150px] font-lora rounded-sm shadow-lg p-4"
      >
        <div className="w-full font-semibold md:w-[80%] flex flex-wrap gap-4 md:gap-8 text-[14px] lg:font-normal md:text-lg lg:text-xl px-2 py-4 md:p-6 lg:p-8 rounded-lg overflow-y-auto">
          {texts.map((text, index) => (
            <motion.h2
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: index * 0.4 }}
              viewport={{ once: true, amount: 0.5 }}
            >
              {text}
            </motion.h2>
          ))}
        </div>
      </div>
      <Button 
        className='text-md lg:text-lg shadow-xl mx-auto w-[200px] mt-[-30px] lg:mt-[-130px] bg-gray-900 hover:bg-gray-900/80 hover:text-gray-100 transition duration-1000' 
        onClick={handleButtonClick}
      >
        {t('about.button')}
      </Button>
    </div>
  );
};

export default AboutSection;
