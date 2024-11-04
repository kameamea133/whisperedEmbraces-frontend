import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'
import BackgroundMusic from './components/BackgroundMusic'

import './App.css'


function App() {
  return (
    <div className="bg-[#E2DFD7]/70 ">
     <Navbar />
     <BackgroundMusic />
     <Outlet /> 
    </div>
  )
}

export default App
