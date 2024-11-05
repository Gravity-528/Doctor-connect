import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="bg-blue-500 h-screen flex flex-col justify-center items-center text-white">
      <h1 className="text-5xl font-bold mb-6">Welcome to Mentors Connect</h1>
      <p className="text-xl mb-8">Connect with mentors who can help guide your journey!</p>
      
      <div className="flex space-x-4">
        <button className="bg-white text-blue-500 px-6 py-3 rounded-md font-semibold hover:bg-gray-200 transition duration-300 ease-in-out">
        <Link to='/doctorLogin'>
          Doctor
        </Link>
        </button>
        <button className="bg-white text-blue-500 px-6 py-3 rounded-md font-semibold hover:bg-gray-200 transition duration-300 ease-in-out">
        <Link to='/userLogin'>
          User
        </Link>
        </button>
      </div>
    </div>
  );
};

export default Hero;
