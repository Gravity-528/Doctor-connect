import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const YourSlotCard = ({ props }) => {
  const date = new Date(props.date);
  console.log("props", props);
  console.log("date", date);
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const [DoctorName, setDoctorName] = useState([]);

  const GetData = async () => {
    try {
      const response = await axios.post(
        "/api/v1/doctor/doctorId",
        { id: props.Doctor },
        { withCredentials: true }
      );
      setDoctorName(response.data.data);
    } catch (error) {
      console.error("error in frontend YourSlotCard", error);
    }
  };

  useEffect(() => {
    GetData();
  }, []);

  return (
    <Card className="bg-black border border-white text-white p-6 max-w-sm mx-auto mt-6 shadow-xl">
      <CardContent>
        <h2 className="text-2xl font-bold mb-2">Slot at {props.date}</h2>
        <p className="text-gray-400">{props.doctorId.name}</p>
        <p className="text-gray-500 mb-4">{props.doctorId.qualification}</p>
        <p className="text-gray-500 mb-4">{props.time}</p>

        <Button className="w-full bg-white text-black hover:bg-gray-300 transition duration-300">
          <Link to={`/YourSlot/${props.doctorId.username}`}>Start Call</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default YourSlotCard;
