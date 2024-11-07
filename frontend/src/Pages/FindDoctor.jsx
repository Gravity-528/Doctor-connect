import React from 'react'
import Navbar from '../component/Navbar'
import DoctorCard from '../component/DoctorCard'
import { useData } from '../Providers/DataProvider'
import Footer from '../component/Footer'



const FindDoctor = () => {
  const {Doctor}=useData();
  
  return (
    <>
        <Navbar/>
        {Doctor.map((val,index)=>{
           return(
            <DoctorCard key={index} props={val}/>
           )
        
        })}
        <Footer/>
    </>
  )
}

export default FindDoctor