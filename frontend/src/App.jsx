import { BrowserRouter, Routes ,Route} from 'react-router-dom'
import './App.css'
import DoctorCard from './component/DoctorCard'
import Hero from './component/Hero'
import Navbar from './component/Navbar'
import SlotCard from './component/SlotCard'
import Video from './component/Video'
import YourSlotCard from './component/YourSlotCard'
import FindDoctor from './Pages/FindDoctor'
import LandingPage from './Pages/LandingPage'
import { SocketProvider } from './Providers/Socket'
import { PeerProvider } from './Providers/WebRTC'

function App() {

  return (
    <>
      <SocketProvider>
      <PeerProvider>
      <BrowserRouter>
      <Routes>
      <Route path="/" element={<LandingPage/>}/>
      {/* <LandingPage/> */}
      {/* <Navbar/> */}
      {/* <DoctorCard/> */}
      {/* <FindDoctor/> */}
      {/* <Video/> */}
      {/* <YourSlotCard/> */}
      </Routes>
      </BrowserRouter>
      </PeerProvider>
      </SocketProvider>
      
    </>
  )
}

export default App

// App.js


// App.js
