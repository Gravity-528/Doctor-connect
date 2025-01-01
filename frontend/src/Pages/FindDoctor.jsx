import React, { useEffect,useState } from 'react'
import Navbar from '../component/Navbar'
import DoctorCard from '../component/DoctorCard'
import { useData } from '../Providers/DataProvider'
import Footer from '../component/Footer'
import axios from 'axios'



const FindDoctor = () => {
  // const {Doctor}=useData();
  // console.log("doctor is",Doctor);
  const [Doctor,setDoctor]=useState([]);
  
  const GetAllDoctor=async()=>{
    try {
        const response=await axios.get('/api/v1/doctor/allDoctor',{withCredentials:true});
        setDoctor(response.data.data);
        
        alert("doctor fetched successfully");
    } catch (error) {
        console.error("error in fetching the doctor",error);
    }
}
console.log(Doctor);
useEffect(()=>{
  GetAllDoctor();
},[])
  return (
    <>
        <Navbar/>
        {/* {Doctor.map((val,index)=>{
           return(
            <DoctorCard key={index} props={val}/>
           )
        
        })} */}
        {Doctor.length > 0 ? (
  Doctor.map((val, index) => {
    return <DoctorCard key={index} props={val} />;
  })
) : (
  <p>No doctors found.</p>  // Show a message when the array is empty
)}
        <Footer/>
    </>
  )
}

export default FindDoctor