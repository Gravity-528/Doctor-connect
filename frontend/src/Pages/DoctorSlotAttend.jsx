import React, { useEffect, useState } from 'react'
import { useData } from '../Providers/DataProvider'
import DoctorSlotCard from '../component/DoctorSlotCard';
import axios from 'axios';

const DoctorSlotAttend = () => {
    // const {DoctorSlot}=useData();
    const [DoctorSlot,setDoctorSlot]=useState([]);
    const GetDoctorSlot=async()=>{
      try{
      const OtherSlot=await axios.get('/api/v1/doctor/doctorSlot',{withCredentials:true});
      setDoctorSlot(OtherSlot.data.data);
      }catch(err){
          console.error("error in fetching OtherSlot",err);
      }
  }

  useEffect(()=>{
    GetDoctorSlot();
  },[]);
    
  return (
    <div>
      {DoctorSlot.map((val,index)=>{
        return(<DoctorSlotCard key={index} props={val}/>)
      })}
    </div>
  )
}

export default DoctorSlotAttend