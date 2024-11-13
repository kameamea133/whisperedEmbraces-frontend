/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { X } from 'lucide-react';

function SoftNotification({ message, onClose }) {


    useEffect(() => {
        const timer = setTimeout(onClose, 3000); 
        return () => clearTimeout(timer); 
      }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="fixed top-[200px] right-10 flex flex-col bg-blue-500 px-4 py-6 text-white rounded-lg shadow-lg z-40 "
    >
      <button 
        onClick={onClose} 
        className="relative top-2 right-2 p-1 text-white hover:text-gray-200"
      >
        <X className="w-5 h-5 absolute top-[-30px] right-[-20px]" />
      </button>
      <p>{message}</p>
    </motion.div>
  );
}

export default SoftNotification;