import React, { useEffect } from 'react'
import { useData } from '../Providers/DataProvider'
import YourSlotCard from '../component/YourSlotCard';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';

const YourSlot = () => {
    
    const [UserSlot,setUserSlot]=useState({});
    const GetUserSlot=async()=>{
      try{
          const YourSlot=await axios.get('https://localhost:8000/api/v1/user/getSlot',{withCredentials:true});
          setUserSlot(YourSlot.data);
          }catch(err){
              console.error("error is here :",err);
          }
  }
  useEffect(()=>{
    GetUserSlot();
  })
    
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