import './App.css'
import DoctorCard from './component/DoctorCard'
import Hero from './component/Hero'
import Navbar from './component/Navbar'
import SlotCard from './component/SlotCard'
import FindDoctor from './Pages/FindDoctor'
import LandingPage from './Pages/LandingPage'
import { SocketProvider } from './Providers/Socket'

function App() {

  return (
    <>
      <SocketProvider>
      {/* <LandingPage/> */}
      {/* <Navbar/> */}
      {/* <DoctorCard/> */}
      {/* <FindDoctor/> */}
      </SocketProvider>
      
    </>
  )
}

export default App

// App.js


// App.js
