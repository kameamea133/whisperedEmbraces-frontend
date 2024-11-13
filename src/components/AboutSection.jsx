import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';

const AboutSection = () => {
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth.userInfo);

  const handleButtonClick = () => {
    if (userInfo) {
      navigate('/posts'); 
    } else {
      navigate('/login'); 
    }
  };


  return (
    <div className='flex flex-col'>
    
    <div 
    id="about"
      className="flex items-center justify-center w-[90%] lg:w-[76%] mx-auto  md:h-screen bg-[url('/aboutBg.png')] bg-cover bg-no-repeat bg-center my-10 md:my-[150px] font-lora rounded-sm shadow-lg p-4"
    >
      <div className="w-full font-semibold md:w-[80%] lg:w-[60%] flex flex-wrap gap-4 md:gap-8 text-[14px] lg:font-normal md:text-lg lg:text-xl px-2 py-4 md:p-6 lg:p-8 rounded-lg overflow-y-auto">
        {[
          "...chaque mot est un soupir venu du cœur, murmurant la vérité des émotions. Ici, les écrits deviennent l’écho de nos songes, l’expression de nos joies secrètes et de nos peines muettes, tissées dans l’étoffe même de l’existence.",
          "Sur ces pages, chaque poème, chaque pensée, est une offrande : un fragment de l’âme partagé dans l’espérance de toucher celle d’un autre. C’est un espace où l’écriture est un chant, une prière murmurée à l’univers, une étreinte entre l’éphémère et l’éternité.",
          "Quand vous déposez vos mots, sachez qu’ils deviennent des graines semées dans le jardin des âmes, prêtes à germer, à réconforter et, je l'espère, à éveiller. Car dans la beauté de l’instant présent, même le murmure le plus doux peut devenir une symphonie de résonance.",
          "Laissez la vie écrire à travers vous. Chaque mot est un délicat lien brodé entre la lumière et l'ombre, là où le tangible s'effleure à l'immatériel, entre la solitude et la communion. Et rappelez-vous, chaque étreinte partagée, même fugace, nous rend un peu plus humains, un peu plus vivants..."
        ].map((text, index) => (
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
      <Button className='text-md lg:text-lg shadow-xl  mx-auto w-[200px] mt-[-30px] lg:mt-[-130px] bg-gray-900 hover:bg-gray-900/80 hover:text-gray-100 transition duration-1000' onClick={handleButtonClick} >Ecrire une étreinte</Button>

    </div>
  );
};

export default AboutSection;
