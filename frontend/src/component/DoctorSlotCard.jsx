import axios from 'axios';
import React,{useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

const DoctorSlotCard = ({props}) => {

  const [Patient,setPatient]=useState([]);

  const GetPatient=async()=>{
    try{
    const response=await axios.post("http://localhost:8000/api/v1/doctor/fetchById",{id:props.Patient},{withCredentials:true});
    console.log(response);
    setPatient(response.data.data);
    }catch(err){
      console.error("error in fetching userDetail at DoctorSide")
    }
  }
  console.log("Patient at DoctorCard is",Patient);
  useEffect(()=>{
    GetPatient();
  },[]);
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-2">Appointment for {Patient.name} at {props.Time}</h2>
      <p className="text-gray-600 mb-4">{props.Time}</p>
      {/* <p className="text-gray-600 mb-4">Date: November 15, 2024</p> */}
      <Link to={`/DoctorSlot/${Patient.username}+${props.Time}`}>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-600 transition duration-300 ease-in-out">
        Start Call
      </button>
      </Link>
    </div>
  );
};

export default DoctorSlotCard;
