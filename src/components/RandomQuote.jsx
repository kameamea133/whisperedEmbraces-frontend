import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Button } from "./ui/button";

const RandomQuote = () => {
  const [quotes, setQuotes] = useState([]);
  const [quote, setQuote] = useState("");
  const [showFinalQuote, setShowFinalQuote] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

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

    
    const superposition = [];
    for (let i = 0; i < 10; i++) {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      superposition.push(randomQuote);
    }
    

    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const finalQuote = quotes[randomIndex];
      setQuote(finalQuote);
      setShowFinalQuote(true);
      setIsSearching(false);
    }, 5000);
  };

  if (loading) return <p>Chargement des citations...</p>;

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

 
  <div className="absolute inset-0 bg-black opacity-30"></div>

  <div className="relative w-full bg-slate-100/5 max-w-[90%] lg:max-w-[70%] h-[70vh] flex flex-col items-center justify-center rounded-lg shadow-xl">
    
    {isSearching ? (
      <motion.div
        className="text-3xl text-gray-700 font-bold mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
      >
        Laissons le hasard agir...
      </motion.div>
    ) : (
      <Button
        onClick={handleGetQuote}
        className="text-md lg:text-lg shadow-xl px-8  mx-auto w-[200px] mt-[-30px] lg:mt-[-130px] lg:mb-[70px] bg-gray-900 hover:bg-gray-900/60 hover:text-gray-100 transition duration-1000"
      >
        Inspire-moi !
      </Button>
    )}

   
    <AnimatePresence>
      {showFinalQuote && (
        <motion.div
          className="w-[90%] md:w-[80%] lg:w-[70%] bg-transparent p-4 flex items-center justify-center "
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <blockquote className="text-lg md:text-2xl lg:text-3xl font-bold text-white text-center">
            {quote.text}
            {quote.author && <footer className="font-tangerine italic text-5xl mt-5 text-right">-{quote.author}</footer>}
            
          </blockquote>

        </motion.div>
      )}
    </AnimatePresence>
  </div>
</div>

  );
};

export default RandomQuote;
