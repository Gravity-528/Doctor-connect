import React, { useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import DoctorCard from "../component/DoctorCard";
import Footer from "../component/Footer";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import SearchBar from "../component/SearchBar";

const FindDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllDoctors = async () => {
    try {
      const response = await axios.get("/api/v1/doctor/allDoctor", {
        withCredentials: true,
      });
      setDoctors(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error in fetching the doctors:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllDoctors();
  }, []);

  return (
    <div className="bg-black min-h-screen">
  
      <Navbar />

    
      <div className="max-w-7xl mx-auto px-6 py-12"> 
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Find Your Doctor
        </h1>
        <SearchBar />

        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className="h-64 bg-gray-800 rounded-lg" />
            ))}
          </div>
        ) : (
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.length > 0 ? (
              doctors.map((doctor, index) => (
                <DoctorCard key={index} props={doctor} />
              ))
            ) : (
              <p className="text-gray-300 text-center col-span-full">
                No doctors found.
              </p>
            )}
          </div>
        )}
      </div>

      
      <Footer />
    </div>
  );
};

export default FindDoctor;
