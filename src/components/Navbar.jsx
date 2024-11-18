import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slices/authSlice";
import { useTranslation } from 'react-i18next';

import { Button } from "./ui/button";
import { Menu, X, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/firebaseConfig";
import { signOut } from "firebase/auth";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navbarBg, setNavbarBg] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { t, i18n } = useTranslation();

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

    const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <nav className={`fixed top-0 left-0 h-auto w-full z-50 sm:text-center text-white transition-colors duration-700 ${navbarBg ? 'bg-gray-900/90 shadow-md' : 'bg-transparent'}`}>
      <div className="px-6 py-1 flex justify-between items-center font-raleway">
        {/* Logo */}
        <div className="relative flex items-center">
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/logo12.png" alt="logo" className="h-[110px] lg:h-[160px] object-cover rounded-full" />
          </Link>
        </div>

        {/* Menu Desktop */}
        <ul className={`hidden sm:flex space-x-6 text-base lg:text-base uppercase ${userInfo ? 'lg:ml-[150px]' : ''}`}>
          <li><Link to={{ pathname: "/" }} state={{ scrollTo: "etreintes-section" }}  className="relative  text-white before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-0 before:h-[2px] before:bg-white before:transition-all before:duration-700 hover:before:w-full">{t('navbar.embraces')}</Link></li>
          <li>
            <Link to={{ pathname: "/" }} state={{ scrollTo: "randomQuote" }}  className="relative  text-white before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-0 before:h-[2px] before:bg-white before:transition-all before:duration-700 hover:before:w-full">
              {t('navbar.inspirations')}
            </Link>
          </li>
          {userInfo && (
            <>
              <li><Link to="/posts"  className="relative  text-white before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-0 before:h-[2px] before:bg-white before:transition-all before:duration-700 hover:before:w-full">{t('navbar.myTexts')}</Link></li>
              <li><Link to="/profile"  className="relative  text-white before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-0 before:h-[2px] before:bg-white before:transition-all before:duration-700 hover:before:w-full">{t('navbar.profile')}</Link></li>
            </>
          )}
        </ul>

        {/* Login / Logout button */}
        <div className="hidden md:flex space-x-4 items-center">
          {userInfo ? (
            <div className="flex items-center gap-4 lg:text-base uppercase">
              <p className="bg-gray-400/20 shadow-xl px-2 py-1 rounded-md">&quot; {t('navbar.hello')} {userInfo.username} &quot;</p>
              <Button onClick={handleLogout} className="text-base px-2 py-1 hover:shadow-xl uppercase bg-transparent">{t('navbar.logout')}</Button>
            </div>
          ) : (
            <Button onClick={handleLoginClick} className="text-base uppercase bg-transparent" >{t('navbar.login')}</Button>
          )}
          <Link to="/contact"><Mail className="w-6 h-6 text-white" /></Link>
        <div className="flex gap-2 ml-4">
          <button onClick={() => changeLanguage('fr')}>FR</button>
          <button onClick={() => changeLanguage('en')}>EN</button>
        </div>
        </div>

       

        {/* Toggle Menu for Mobile */}
        <button className="md:hidden flex items-center justify-center p-2" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8 text-black" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden bg-black text-white uppercase p-4 space-y-4 h-screen flex flex-col justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {userInfo && <p className="text-xl mb-9">{t('navbar.hello')} {userInfo.username}</p>}
            <Link to="/" className="text-xl" onClick={() => setMenuOpen(false)}>{t('navbar.embraces')}</Link>
            <Link to="/" state={{ scrollTo: "randomQuote" }} className="text-xl" onClick={() => setMenuOpen(false)}>{t('navbar.inspirations')}</Link>
            {userInfo ? (
              <>
                <Link to="/posts" className="text-xl" onClick={() => setMenuOpen(false)}>{t('navbar.myTexts')}</Link>
                <Link to="/profile" className="text-xl" onClick={() => setMenuOpen(false)}>{t('navbar.profile')}</Link>
                <button onClick={handleLogout} className="text-xl uppercase">{t('navbar.logout')}</button>
              </>
            ) : (
              <button onClick={handleLoginClick} className="text-xl uppercase">{t('navbar.login')}</button>
            )}
            <Link to="/contact" onClick={() => setMenuOpen(false)}><Mail className="w-6 h-6 text-white" /></Link>
            <div className="flex w-[70%] justify-center gap-6">
          <button onClick={() => changeLanguage('fr')}>FR</button>
          <button onClick={() => changeLanguage('en')}>EN</button>
        </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
