import React from "react";

const DoctorCard = (props) => {
  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white">
      <img
        className="w-full h-48 object-cover"
        src={props.image}
        alt="Doctor"
      />
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{props.name}</h2>
        <p className="text-gray-700 mb-4">{props.qualification}</p>
        <p className="text-gray-700 mb-4">{props.email}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">₹200</span>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">
          <Link to={`/SeeDoctor/${props.username}`}>
            Book Now
          </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
