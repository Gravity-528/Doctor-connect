import React from 'react'
import { useData } from '../Providers/DataProvider'
import DoctorSlotCard from '../component/DoctorSlotCard';

const DoctorSlotAttend = () => {
    const {DoctorSlot}=useData();
    
  return (
    <div>
      {DoctorSlot.map((val,index)=>{
        return(<DoctorSlotCard key={index} props={val}/>)
      })}
    </div>
  )
}

export default DoctorSlotAttend