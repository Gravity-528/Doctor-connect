import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DoctorCard = ({ props }) => {
  return (
    <Card className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-black border border-white hover:shadow-xl transition-shadow duration-300 text-center">
      <CardHeader className="p-0">
        <img
          className="w-full h-60 object-cover"
          src={props.image}
          alt="Doctor"
        />
      </CardHeader>
      <CardContent className="p-6">
        <CardTitle className="text-xl font-bold text-white mb-2">
          {props.name}
        </CardTitle>
        <CardDescription className="text-gray-300 mb-4">
          {props.qualification}
        </CardDescription>
        <CardDescription className="text-gray-300 mb-4">
          {props.email}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex flex-col items-center p-6">
        <span className="text-lg font-semibold text-white mb-3">₹200</span>
        <Link to={`/SeeDoctor/${props.username}`}>
          <Button className="border border-white text-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition duration-300">
            Book Now
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default DoctorCard;
