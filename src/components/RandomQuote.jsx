import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

const RandomQuote = () => {
  const [quotes, setQuotes] = useState([]);
  const [quote, setQuote] = useState("");
  const [superposingQuotes, setSuperposingQuotes] = useState([]);
  const [showFinalQuote, setShowFinalQuote] = useState(false);
  const [loading, setLoading] = useState(true);

  // Récupérer les citations depuis Firebase
  const fetchQuotes = async () => {
    try {
      const quotesCollection = collection(db, "quotes");
      const quotesSnapshot = await getDocs(quotesCollection);
      const quotesList = quotesSnapshot.docs.map((doc) => doc.data().text);
      setQuotes(quotesList);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des citations:", error);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleGetQuote = () => {
    if (quotes.length === 0) return;

    // Choisit un index aléatoire pour la citation finale
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const finalQuote = quotes[randomIndex];

    // Superpose les citations aléatoires rapidement
    const superposition = [];
    for (let i = 0; i < 10; i++) {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      superposition.push(randomQuote);
    }
    setSuperposingQuotes(superposition);

    // Affiche la citation finale avec un délai
    setShowFinalQuote(false);
    setTimeout(() => {
      setQuote(finalQuote);
      setShowFinalQuote(true);
    }, 1000);
  };

  if (loading) return <p>Chargement des citations...</p>;

  return (
    <div className="w-full h-screen bg-pink-200 flex items-center justify-center">
      {/* Composant principal pleine largeur et hauteur */}
      <div className="w-full max-w-[90%] lg:max-w-[70%] bg-blue-500 h-[70vh] flex items-center justify-center rounded-lg shadow-xl">
        {/* Div centrale */}
        <motion.div
          className="w-[90%] md:w-[80%] lg:w-[70%] h-[50%] bg-white flex items-center justify-center rounded-md shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Contenu à l'intérieur de la div centrale */}
          <p className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-700 text-center">
            Ceci est un test pour l&apos;affichage des citations
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RandomQuote;
