import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slices/authSlice";

import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/firebaseConfig"; 
import { signOut } from "firebase/auth";

const Navbar = () => {
  
  const [menuOpen, setMenuOpen] = useState(false);
    const [navbarBg, setNavbarBg] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);
   
     
    const handleScroll = () => {
        if (window.scrollY >= 80) {
          setNavbarBg(true);
        } else {
          setNavbarBg(false);
        }
      };
      

      useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
      }, []);

      const handleLoginClick = () => {
        navigate("/login"); 
      };

      const handleLogout = async () => {
        try {
          await signOut(auth); 
          dispatch(logout());
          navigate("/");
        } catch (error) {
          console.log("Erreur lors de la déconnexion :", error);
        }
      };
    

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 text-white transition-colors duration-700 ${navbarBg ? 'bg-slate-400/60 shadow-md' : 'bg-transparent'}`}>
    <div className="container mx-auto px-6 py-1 text-shadow flex justify-between items-center font-raleway">
        {/* Logo */}
        <div className="text-lg font-bold relative flex items-center gap-4">
            <Link to="/"
            onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
            >
                <img src="/logo3.png" alt="logo" className="h-[50px] sm:h-[100px]" />
            </Link>
            
        </div>

        {/* Menu Desktop */}
        <ul className="hidden md:flex space-x-8 text-lg">
            <li><Link to="/" className="relative  before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-0 before:h-[2px] before:bg-white before:transition-all before:duration-700 hover:before:w-full" onClick={() => {
      document.getElementById('etreintes-section')?.scrollIntoView({ behavior: 'smooth' });
    }} >Étreintes</Link></li>
            <li><Link to="/" className="relative before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-0 before:h-[2px] before:bg-white before:transition-all before:duration-700 hover:before:w-full">Inspirations</Link></li>
            {userInfo && (
            <>
              <li>
                <Link to="/posts" className="relative before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-0 before:h-[2px] before:bg-white before:transition-all before:duration-700 hover:before:w-full">
                  Mes textes
                </Link>
              </li>
              <li>
              <Link to="/profile" className="relative  before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-0 before:h-[2px] before:bg-white before:transition-all before:duration-700 hover:before:w-full">Mon profil</Link>
              </li>
            </>
          )}
        </ul>

        {/* login / logout button */}
        <div className="hidden md:flex space-x-4">
            {userInfo ? (
                <div className="flex items-center gap-4">
                    <p className="text-lg">Bonjour {userInfo.username}</p>
                    <Button
                        className="text-shadow text-lg px-4 py-2 rounded-md hover:bg-white transition duration-300"
                        variant="ghost"
                        onClick={handleLogout}
                    >
                        Déconnexion
                    </Button>
                    
                </div>
            ) : (
                <Button
                    onClick={handleLoginClick}
                    className=" px-4 py-2  rounded-md hover:bg-white transition duration-800 hover:text-black"
                    
                >
                    Connexion
                </Button>
            )}
        </div>

        {/* toggle menu */}
        <button
            className="md:hidden flex items-center justify-center p-2"
            onClick={() => setMenuOpen(!menuOpen)}
        >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-black" />}
        </button>
    </div>

    {/* Mobile Menu */}
<AnimatePresence>
  {menuOpen && (
    <motion.div
      className="md:hidden bg-black text-white p-4 space-y-4 text-shadow h-screen flex flex-col justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Link to="/" className="block hover:text-gray-300 text-2xl" onClick={() => setMenuOpen(false)}>
        Étreintes
      </Link>
      <Link to="/" className="block hover:text-gray-300 text-2xl" onClick={() => setMenuOpen(false)}>
        Inspirations
      </Link>
      {userInfo ? (
        <>
          <Link to="/posts" className="block hover:text-gray-300 text-2xl" onClick={() => setMenuOpen(false)}>
            Mes Textes
          </Link>
          <Link to="/profile" className="block hover:text-gray-300 text-2xl" onClick={() => setMenuOpen(false)}>
            Mon profil
          </Link>
          <button
            className="w-full  hover:text-gray-300 text-2xl mt-4"
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
          >
            Déconnexion
          </button>
        </>
      ) : (
        <button
          className="w-full text-left hover:text-gray-300 text-2xl mt-4"
          onClick={() => {
            handleLoginClick();
            setMenuOpen(false);
          }}
        >
          Connexion
        </button>
      )}
    </motion.div>
  )}
</AnimatePresence>

</nav>
  )
}

export default Navbar