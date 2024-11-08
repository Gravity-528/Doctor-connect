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
import LoginUser from "./Pages/LoginUser"
import RegisterUser from "./Pages/RegisterUser"
import SlotPage from "./Pages/SlotPage"
import YourSlot from "./Pages/YourSlot"
import DoctorNav from "./component/DoctorNav"
import DoctorSlotAttend from "./Pages/DoctorSlotAttend"
import DoctorVideo from "./component/DoctorVideo"



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
    },
    {
      path:'/userLogin',
      element:<LoginUser/>
    },
    {
      path:'/userRegister',
      element:<RegisterUser/>
    },
    {
      path:'/UserHome',
      element:<Navbar/>
    },
    {
      path:'/DoctorHome',
      element:<DoctorNav/>
    },
    {
      path:'/SeeDoctor',
      element:<FindDoctor/>,
      // children:[
      //   {
      //     path:':username',
      //     element:<SlotPage/>
      //   }
      // ]
    },
    {
      path:'/SeeDoctor/:username',
      element:<SlotPage/>
    },
    {
      path:'/YourSlot',
      element:<YourSlot/>,
    },{
      path:'/YourSlot/:username',
      element:<Video/>
    },
    {
      path:'/DoctorSlot',
      element:<DoctorSlotAttend/>
    },{
      path:'/DoctorSlot/:username',
      element:<DoctorVideo/>
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

