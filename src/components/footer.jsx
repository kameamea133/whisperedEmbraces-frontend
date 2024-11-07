import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto text-center font-bold">
        
        <ul className="flex flex-col md:flex-row justify-center md:space-x-6 space-y-4 md:space-y-0 mb-4 text-sm">
          <li>
            <Link 
              to="/" 
              className="relative text-lg text-gray-400 hover:text-white before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-0 before:h-[2px] before:bg-white before:transition-all before:duration-700 hover:before:w-full"
            >
              Accueil
            </Link>
          </li>
          
          <li>
            <Link
              to="/"
              className="relative text-lg text-gray-400 hover:text-white before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-0 before:h-[2px] before:bg-white before:transition-all before:duration-700 hover:before:w-full"
              onClick={() => {
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              À propos
            </Link>
          </li>
          
          <li>
            <Link 
              to="/conditions" 
              className="text-gray-400 text-lg hover:text-white"
            >
              Conditions d’utilisation
            </Link>
          </li>
          
          <li>
            <Link 
              to="/privacy" 
              className="relative text-lg text-gray-400 hover:text-white before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-0 before:h-[2px] before:bg-white before:transition-all before:duration-700 hover:before:w-full"
            >
              Politique de confidentialité
            </Link>
          </li>
        </ul>

        {/* Copyright */}
        <p className="text-gray-500 text-sm">
          Étreintes Éphémères © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
