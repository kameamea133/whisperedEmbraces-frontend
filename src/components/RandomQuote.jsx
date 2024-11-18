import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useTranslation } from 'react-i18next';

const RandomQuote = () => {
  const [quotes, setQuotes] = useState([]);
  const [quote, setQuote] = useState("");
  const [showFinalQuote, setShowFinalQuote] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const { t } = useTranslation();

  const location = useLocation();

  
  const fetchQuotes = async () => {
    try {
      const quotesCollection = collection(db, "quotes");
      const quotesSnapshot = await getDocs(quotesCollection);
      const quotesList = quotesSnapshot.docs.map((doc) => ({
        text: doc.data().text,
        author: doc.data().author, 
      }));
      setQuotes(quotesList);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des citations:", error);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  useEffect(() => {
    if (location.state?.scrollTo === "randomQuote") {
      const quoteElement = document.getElementById("randomQuote");
      if (quoteElement) {
        quoteElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);
  

  
  const handleGetQuote = () => {
    if (quotes.length === 0) return;
  
    setIsSearching(true);
    setShowFinalQuote(false);
  
    setTimeout(() => {
     
      let randomIndex;
      let finalQuote;
  
      
      do {
        randomIndex = Math.floor(Math.random() * quotes.length);
        finalQuote = quotes[randomIndex];
      } while (finalQuote === quote); 
  
      setQuote(finalQuote);
      setShowFinalQuote(true);
      setIsSearching(false);
    }, 5000);
  };
  
  if (loading) return <p>{t('randomQuote.loading')}</p>;

  return (
    <div id="randomQuote" className="relative w-full h-screen flex flex-col items-center justify-center">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/rqVid.mp4"
        autoPlay
        loop
        muted
        playsInline
      ></video>

      <div className="absolute inset-0 bg-black opacity-30 min-h-[60vh]"></div>

      <div className="relative w-full bg-slate-100/5 max-w-[90%] lg:max-w-[70%] min-h-[60vh] flex flex-col items-center justify-center rounded-lg shadow-xl">
        {isSearching ? (
          <motion.div
            className="md:text-3xl text-gray-500 text-center font-bold mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          >
            {t('randomQuote.loading')}
          </motion.div>
        ) : (
          <Button
            onClick={handleGetQuote}
            className="text-md lg:text-lg shadow-xl px-8 mx-auto w-[200px] mt-[-30px] lg:max-mt-[-30px] lg:max-mb-[70px] bg-gray-900 hover:bg-gray-900/60 hover:text-gray-100 transition duration-1000"
          >
            {t('randomQuote.button')}
          </Button>
        )}

        <AnimatePresence>
          {showFinalQuote && (
            <motion.div
              className="w-[90%] md:w-[80%] lg:w-[70%] bg-transparent p-4 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <blockquote className="text-lg md:text-2xl lg:text-3xl font-raleway font-semibold text-white text-center">
                {quote.text}
                {quote.author && (
                  <footer className="font-tangerine italic text-xl md:text-3xl mt-5 text-right">
                    -{quote.author}
                  </footer>
                )}
              </blockquote>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RandomQuote;
