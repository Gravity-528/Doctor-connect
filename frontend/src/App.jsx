import {createBrowserRouter,RouterProvider} from "react-router-dom"
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
import { DataProvider } from "./Providers/DataProvider"
import DoctorLogin from "./Pages/DoctorLogin"
import DoctorRegister from "./Pages/DoctorRegister"



function App() {
  
  const router=createBrowserRouter([
    {
       path:"/",
       element:<LandingPage/>
    },
    {
      path:'/doctorLogin',
      element:<DoctorLogin/>
    },
    {
      path:'/doctorRegister',
      element:<DoctorRegister/>
    }
  ]);

  return (
    <>
      <SocketProvider>
      <PeerProvider>
      <DataProvider>
      <RouterProvider router={router}/>
      {/* <LandingPage/> */}
      {/* <Navbar/> */}
      {/* <DoctorCard/> */}
      {/* <FindDoctor/> */}
      {/* <Video/> */}
      {/* <YourSlotCard/> */}
      </DataProvider>
      </PeerProvider>
      </SocketProvider>
      
    </>
  )
}

export default App

