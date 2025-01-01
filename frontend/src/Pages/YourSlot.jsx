import React, { useEffect,useState } from 'react'
import { useData } from '../Providers/DataProvider'
import YourSlotCard from '../component/YourSlotCard';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import axios from 'axios';

const YourSlot = () => {
    
    const [UserSlot,setUserSlot]=useState([]);
    const GetUserSlot=async()=>{
      try{
          const YourSlot=await axios.get('/api/v1/user/getSlot',{withCredentials:true});
          // console.log("YourSlot is",YourSlot)
          setUserSlot(YourSlot.data.data);
          }catch(err){
              console.error("error is here :",err);
          }

  }
  // console.log("userSlot is",UserSlot);
  useEffect(()=>{
    GetUserSlot();
  },[])
  //  console.log(UserSlot); 
  return (
    <div>
      <Navbar/>
      {UserSlot.map((val,index)=>{
        return(<YourSlotCard key={index} props={val}/>)
      })}
      <Footer/>
    </div>
  )
}

export default YourSlot