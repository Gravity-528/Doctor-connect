import React, { useEffect, useState } from "react";
import axios from "axios";
import DoctorSlotCard from "../component/DoctorSlotCard";
import DoctorNav from "../component/DoctorNav";

const SkeletonCard = () => (
  <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-80 h-40 animate-pulse">
    <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
    <div className="h-10 bg-gray-700 rounded w-full"></div>
  </div>
);

const DoctorSlotAttend = () => {
  const [DoctorSlot, setDoctorSlot] = useState([]);
  const [loading, setLoading] = useState(true);

  const GetDoctorSlot = async () => {
    try {
      const OtherSlot = await axios.get("/api/v1/doctor/doctorSlot", {
        withCredentials: true,
      });
      setDoctorSlot(OtherSlot.data.data);
    } catch (err) {
      console.error("Error in fetching OtherSlot", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetDoctorSlot();
  }, []);

  return (
    <>
      <DoctorNav />
      <div className="min-h-screen bg-black text-white flex flex-col items-center py-6">
        <h1 className="text-2xl font-bold mb-4">Your Appointments</h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : DoctorSlot.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DoctorSlot.map((val, index) => (
              <DoctorSlotCard key={index} props={val} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-lg">No appointments available.</p>
        )}
      </div>
    </>
  );
};

export default DoctorSlotAttend;
