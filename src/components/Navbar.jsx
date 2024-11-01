import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slices/authSlice";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLogoutMutation } from "../slices/usersApiSlice";

const Navbar = () => {
  
  const [menuOpen, setMenuOpen] = useState(false);
    const [navbarBg, setNavbarBg] = useState(false);
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);

    const [logoutApiCall] = useLogoutMutation();


      

      const handleLoginClick = () => {
        navigate("/login"); 
      };

      const handleLogout = async () => {
        try {
          await logoutApiCall().unwrap();
          dispatch(logout());
          navigate("/");
        } catch (error) {
          console.log(error);
        }
    };
    

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 text-white transition-colors duration-700 ${navbarBg ? 'bg-slate-400/30 shadow-md' : 'bg-transparent'}`}>
    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-lg font-bold">
            <Link to="/">
                <img src="/logoWhispered.png" alt="logo" className="h-[50px] sm:h-[100px]" />
            </Link>
        </div>

        {/* Menu Desktop */}
        <ul className="hidden md:flex space-x-6">
            <li><Link to="/" className="hover:text-gray-300 duration-500">Étreintes</Link></li>
            <li><Link to="/" className="hover:text-gray-300 duration-500">Inspirations</Link></li>
        </ul>

        {/* Boutons Connexion / Déconnexion */}
        <div className="hidden md:flex space-x-4">
            {userInfo ? (
                <>
                    <Button
                        className="border px-4 py-2 rounded-md hover:bg-white transition duration-300"
                        variant="ghost"
                        onClick={handleLogout}
                    >
                        Déconnexion
                    </Button>
                    <Link to="/profile" className="hover:text-gray-300">Profil</Link>
                </>
            ) : (
                <Button
                    onClick={handleLoginClick}
                    className="border px-4 py-2 rounded-md hover:bg-white transition duration-300"
                    variant="ghost"
                >
                    Connexion
                </Button>
            )}
        </div>

        {/* Menu Mobile Toggle */}
        <button
            className="md:hidden flex items-center justify-center p-2"
            onClick={() => setMenuOpen(!menuOpen)}
        >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
    </div>

    {/* Menu Mobile */}
    <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        className="md:hidden bg-black/30 text-white p-4 space-y-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <Link to="/" className="block hover:text-gray-300" onClick={() => setMenuOpen(false)}>Étreintes</Link>
                        <Link to="/" className="block hover:text-gray-300" onClick={() => setMenuOpen(false)}>Inspirations</Link>
                        {userInfo ? (
                            <>
                                <Link to="/profile" className="block hover:text-gray-300" onClick={() => setMenuOpen(false)}>Profil</Link>
                                <button
                                    className="w-full text-left hover:text-gray-300"
                                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                                >
                                    Déconnexion
                                </button>
                            </>
                        ) : (
                            <button
                                className="w-full text-left hover:text-gray-300"
                                onClick={() => { handleLoginClick(); setMenuOpen(false); }}
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