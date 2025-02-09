import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const DoctorSlotCard = ({ props }) => {
  const [Patient, setPatient] = useState(null);

  const GetPatient = async () => {
    try {
      const response = await axios.post(
        "/api/v1/doctor/fetchById",
        { id: props.Patient },
        { withCredentials: true }
      );
      setPatient(response.data.data);
    } catch (err) {
      console.error("Error fetching user details at DoctorSide:", err);
    }
  };

  useEffect(() => {
    GetPatient();
  }, []);

  return (
    <div className="bg-black border border-white rounded-lg p-6 max-w-sm mx-auto mt-6 shadow-lg text-white">
      <h2 className="text-xl font-bold mb-2">
        Appointment for {Patient?.name || "Loading..."} at {props.Time}
      </h2>
      <p className="text-gray-400 mb-4">{props.Time}</p>

      <Link to={`/DoctorSlot/${Patient?.username || ""}+${props.Time}`}>
        <button className="bg-white text-black px-4 py-2 rounded-md font-semibold hover:bg-gray-300 transition duration-300 ease-in-out w-full">
          Start Call
        </button>
      </Link>
    </div>
  );
};

export default DoctorSlotCard;
