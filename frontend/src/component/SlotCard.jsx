import React,{useState,useEffect} from "react";
import axios from "axios";
const SlotCard = ({props}) => {
  
  const [isAvailable,setIsAvailable]=useState(true);
  // const currTime=Date.now();

  const BookSlot=async()=>{
     try{
     const response=await axios.post("http://localhost:8000/api/v1/Slot/bookSlot",{DoctorId:props.Doctor,time:props.Time},{withCredentials:true});
     if(response){
      alert("booking done successfully");
     }
     }catch(err){
        console.error("some error is here in booking the slot please try again later",err);
     }
  }

  useEffect(()=>{
    // const currTime=Date.now();
    // const slotTime = new Date();
    // const [hours, minutes] = props.Time.split(":").map(Number);
    // slotTime.setHours(hours-1, minutes, 0, 0);
    //  setIsAvailable(props.status==="available" && currTime<slotTime);
    if (props.Time) {
      const currTime = Date.now();
      const slotTime = new Date(props.Time); 
      const hours = slotTime.getHours();
      const minutes = slotTime.getMinutes();
  
      slotTime.setHours(hours - 1, minutes, 0, 0); 
      setIsAvailable(props.check === "available");
    } else {
      // Handle case where Time is not available
      setIsAvailable(false);
    }
  },[props.status,props.Time]);
  console.log("isAvailable",isAvailable);
  return (
    <div className="max-w-xs rounded-lg overflow-hidden shadow-md bg-white border border-gray-200 p-4">
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold text-gray-900">{props.Time}</span>

        <button className={`px-4 py-2 rounded-md transition duration-300 ${isAvailable === true ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"}`} 
          disabled={isAvailable !== true} onClick={BookSlot}>Book Now</button>
      </div>
    </div>
  );
};

export default SlotCard;
