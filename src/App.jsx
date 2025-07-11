import Navbar from './components/Navbar'
import { Outlet, useLocation } from 'react-router-dom'
import BackgroundMusic from './components/BackgroundMusic'
import Footer from './components/footer'
import { useEffect } from 'react'
import { trackPageView } from './lib/analytics'
import './App.css'

function App() {
  const location = useLocation();

  useEffect(() => {
    // Track page views uniquement en production
    trackPageView(location.pathname, document.title);
  }, [location]);

  return (
    <>
      <div className="bg-[#C8C4B9]/90 w-full">
        <Navbar />
        <BackgroundMusic />
        <Outlet /> 
        <Footer />
      </div>
    </>
  )
}

export default App
