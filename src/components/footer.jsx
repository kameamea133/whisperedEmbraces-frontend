import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-gray-900 py-4 lg:h-[200px] text-white lg:pt-[70px]">
      <div className="container mx-auto text-center font-bold">
        <ul className="flex flex-col md:flex-row justify-center md:space-x-6 space-y-4 md:space-y-0 mb-4 text-sm">
          <li>
            <Link 
              to="/" 
              className="relative text-lg text-gray-400 hover:text-white before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-0 before:h-[2px] before:bg-white before:transition-all before:duration-700 hover:before:w-full"
            >
              {t('footer.home')}
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
              {t('footer.about')}
            </Link>
          </li>

          <li>
            <Link 
              to="/conditions" 
              className="text-gray-400 text-lg hover:text-white"
            >
              {t('footer.terms')}
            </Link>
          </li>

          <li>
            <Link 
              to="/privacy" 
              className="relative text-lg text-gray-400 hover:text-white before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-0 before:h-[2px] before:bg-white before:transition-all before:duration-700 hover:before:w-full"
            >
              {t('footer.privacy')}
            </Link>
          </li>

          <li>
            <Link 
              to="/contact" 
              className="relative text-lg text-gray-400 hover:text-white"
            >
              <Mail className="inline-block" /> {t('footer.contact')}
            </Link>
          </li>
        </ul>

        {/* Copyright */}
        <p className="text-gray-500 text-sm">
          {t('footer.copyright')} {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
