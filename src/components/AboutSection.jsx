import { motion } from 'framer-motion';

const AboutSection = () => {
  return (
    <>

    <div 
      className="relative w-[76%] mx-auto  h-screen bg-[url('/aboutBg.png')] bg-cover bg-no-repeat bg-center my-[150px] font-lora rounded-sm">
      <div className='flex items-center justify-center'>
      <div className="w-[60%] flex flex-wrap gap-8 text-xl p-5 rounded-lg pt-[200px]">
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
            transition={{ duration: 1, delay: index * 1.5 }}
            viewport={{ once: true, amount: 1 }}
          >
            {text}
          </motion.h2>
        ))}
      </div>
      
      </div>
      <h1 className='font-tangerine text-3xl absolute right-[300px] bottom-[100px]'>Stéphane M.</h1>
    </div>
        
    </>
  );
};

export default AboutSection;
