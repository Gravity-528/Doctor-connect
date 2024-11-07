import React, { useEffect,useState } from 'react'
import { useParams } from 'react-router-dom'
import SlotCard from "../component/SlotCard.jsx"
import axios from "axios"

const SlotPage = () => {
  const {username}=useParams();

  const [doctor,setDoctor]=useState([]);
  
  const fetchData=async()=>{
     const response=await axios.post('http://localhost:8000/api/v1/doctor/FindDoctorById',{username},{withCredentials:true});
     setDoctor(response.data.data);
     console.log("all slot is",doctor);
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

export default SlotPage;