import React from 'react'
import { useData } from '../Providers/DataProvider'
import YourSlotCard from '../component/YourSlotCard';

const YourSlot = () => {
    const {UserSlot}=useData();
    
  return (
    <div>
      {UserSlot.map((val,index)=>{
        return(<YourSlotCard key={index} props={val}/>)
      })}
    </div>
  )
}

export default YourSlot