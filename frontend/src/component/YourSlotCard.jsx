import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const YourSlotCard = ({props}) => {
  const date = new Date(props.Time); 


const timeStr = date.toLocaleTimeString('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
});
  const [DoctorName,setDoctorName]=useState([]);

  const GetData=async()=>{
    try {
      const response=await axios.post("http://localhost:8000/api/v1/doctor/doctorId",{id:props.Doctor},{withCredentials:true});
      console.log(response);
     setDoctorName(response.data.data);
      
    } catch (error) {
      console.error("error in frontend YourSlotCard",error);
    }
     
  }
  console.log("DoctorName in YourSlotCard",DoctorName);

  useEffect(()=>{
    GetData();
  },[])
  
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-2">Slot at {props.Time} by {DoctorName.name}</h2>
      <p className="text-gray-600 mb-4">{DoctorName.qualification}</p>
      <p className="text-gray-600 mb-4">{timeStr}</p>
      {/* <p className="text-gray-600 mb-4">Date: November 15, 2024</p> */}
      
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-600 transition duration-300 ease-in-out">
       <Link to={`/YourSlot/${DoctorName.username}`}>
        Start Call
        </Link>
      </button>
    </div>
  );
};

export default YourSlotCard;
