import React, { useState, useEffect } from "react";
import axios from "axios";

const SlotCard = ({ props }) => {
  const [isAvailable, setIsAvailable] = useState(true);

  const BookSlot = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/Slot/bookSlot",
        { DoctorId: props.Doctor, time: props.Time },
        { withCredentials: true }
      );


      console.log("book response",response.data.data.check);


      if (response.data.data.check === "unavailable") {
        setIsAvailable(false); 
      }
      console.log("Booking response:", response);
    } catch (err) {

      console.error("Error booking the slot, please try again later", err);
    }
  };

  useEffect(() => {
    if (props.Time) {
      const currTime = Date.now();
      const slotTime = new Date(props.Time);
      const hours = slotTime.getHours();
      const minutes = slotTime.getMinutes();
  
      slotTime.setHours(hours - 1, minutes, 0, 0);
      setIsAvailable(props.check === "available");
    } else {
      setIsAvailable(false);
    }
  }, [props.check, props.Time]);

  return (
    <div className="max-w-xs rounded-lg overflow-hidden shadow-md bg-white border border-gray-200 p-4">
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold text-gray-900">{props.Time}</span>
        
        <button
          className={`px-4 py-2 rounded-md transition duration-300 ${
            isAvailable ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!isAvailable} 
          onClick={BookSlot}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default SlotCard;

