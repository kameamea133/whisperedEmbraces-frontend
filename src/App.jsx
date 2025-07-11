import Navbar from './components/Navbar'
import { Outlet, useLocation } from 'react-router-dom'
import BackgroundMusic from './components/BackgroundMusic'
import Footer from './components/footer'
import { useEffect, useState } from 'react'
import { trackPageView } from './lib/analytics'
import CookieConsent from './components/cookie-consent'
import './App.css'

function App() {
  const location = useLocation();
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  useEffect(() => {
    // Vérifier le consentement existant au chargement
    const existingConsent = document.cookie.includes("cookieConsent=true");
    if (existingConsent) {
      setCookiesAccepted(true);
    }
  }, []);

  useEffect(() => {
    // Track seulement si cookies acceptés
    if (cookiesAccepted) {
      trackPageView(location.pathname, document.title);
    }
  }, [location, cookiesAccepted]);

  const handleAcceptCookies = () => {
    setCookiesAccepted(true);
  };

  const handleDeclineCookies = () => {
    setCookiesAccepted(false);
  };

  return (
    <>
      <div className="bg-[#C8C4B9]/90 w-full">
        <Navbar />
        <BackgroundMusic />
        <Outlet /> 
        <Footer />
        
        <CookieConsent
          variant="small"
          description="Ce site utilise des cookies pour analyser le trafic et améliorer votre expérience. En acceptant, vous consentez à notre utilisation des cookies."
          learnMoreHref="/privacy"
          onAcceptCallback={handleAcceptCookies}
          onDeclineCallback={handleDeclineCookies}
          className="sm:left-4 sm:bottom-4"
        />
      </div>
    </>
  )
}

export default App
