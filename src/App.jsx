import Navbar from './components/Navbar'
import { Outlet, useLocation } from 'react-router-dom'
import BackgroundMusic from './components/BackgroundMusic'
import Footer from './components/footer'
import { useEffect, useState } from 'react'
import { trackPageView } from './lib/analytics'
import CookieConsent from "react-cookie-consent"
import './App.css'

function App() {
  const location = useLocation();
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  useEffect(() => {
    // Track seulement si cookies acceptés
    if (cookiesAccepted) {
      trackPageView(location.pathname, document.title);
    }
  }, [location, cookiesAccepted]);

  return (
    <>
      <div className="bg-[#C8C4B9]/90 w-full">
        <Navbar />
        <BackgroundMusic />
        <Outlet /> 
        <Footer />
        
        <CookieConsent
          location="bottom"
          buttonText="Accepter"
          declineButtonText="Refuser"
          enableDeclineButton
          cookieName="ga-consent"
          style={{ background: "#2B373B" }}
          buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
          declineButtonStyle={{ color: "#4e503b", fontSize: "13px" }}
          expires={150}
          onAccept={() => setCookiesAccepted(true)}
          onDecline={() => setCookiesAccepted(false)}
        >
          Ce site utilise des cookies pour analyser le trafic et améliorer votre expérience. 
          <span style={{ fontSize: "10px" }}>
            {" "}Consultez notre <a href="/privacy">politique de confidentialité</a>.
          </span>
        </CookieConsent>
      </div>
    </>
  )
}

export default App
