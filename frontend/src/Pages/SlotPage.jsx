import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import SlotCard from "../component/SlotCard.jsx"
const SlotPage = () => {
  const id=useParams();
  const [doctor,setDoctor]=useState({});
  const fetchData=async(id)=>{
     const response=await axios.post('https://localhost:8000/api/v1/doctor/',{id},{withCredentials:true});
     setDoctor(response.data);
  }
  useEffect(()=>{
     fetchData();
  },[])
  return (
    <div>
        {doctor.map((val,index)=>{
            return(
                <SlotCard key={index} props={val}/>
            );
        })}
    </div>
  )
}

export default SlotPage