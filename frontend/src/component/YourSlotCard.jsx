import React from 'react';
import { Link } from 'react-router-dom';
const YourSlotCard = ({props}) => {

  
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-2">{props.Doctor}</h2>
      <p className="text-gray-600 mb-4">{props.qualification}</p>
      <p className="text-gray-600 mb-4">{props.Time}</p>
      {/* <p className="text-gray-600 mb-4">Date: November 15, 2024</p> */}
      
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-600 transition duration-300 ease-in-out">
       <Link to={`/YourSlot/${props.username}`}>
        Start Call
        </Link>
      </button>
    </div>
  );
};

export default YourSlotCard;
