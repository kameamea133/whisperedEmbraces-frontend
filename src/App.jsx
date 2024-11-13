import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'
import BackgroundMusic from './components/BackgroundMusic'
import Footer from './components/footer'
import './App.css'



function App() {
  
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
