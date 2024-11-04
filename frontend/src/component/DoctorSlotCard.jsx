import React from 'react';

const DoctorSlotCard = (props) => {

  
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-2">{props.Patient}</h2>
      <p className="text-gray-600 mb-4">{props.Time}</p>
      {/* <p className="text-gray-600 mb-4">Date: November 15, 2024</p> */}
      
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-600 transition duration-300 ease-in-out">
        Start Call
      </button>
    </div>
  );
};

export default DoctorSlotCard;
