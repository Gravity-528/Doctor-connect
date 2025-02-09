import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton"; 

const Hero = () => {
  const [loading, setLoading] = useState(false);

  const handleButtonClick = () => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
    }, 2000); 
  };

  return (
    <div className="bg-black h-screen flex flex-col justify-center items-center text-white">
      <motion.h1
        className="text-5xl font-bold mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Welcome to Doctors Connect
      </motion.h1>
      <motion.p
        className="text-xl mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        Connect with Doctors who can help guide your journey!
      </motion.p>

      <div className="flex space-x-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Button
            variant="outline"
            className="text-black bg-white hover:bg-gray-200 px-6 py-3 rounded-md font-semibold"
            onClick={handleButtonClick}
          >
            <Link to="/doctorLogin">Doctor</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Button
            variant="outline"
            className="text-black bg-white hover:bg-gray-200 px-6 py-3 rounded-md font-semibold"
            onClick={handleButtonClick}
          >
            <Link to="/userLogin">User</Link>
          </Button>
        </motion.div>
      </div>

      
      {loading && (
        <div className="absolute flex items-center justify-center top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50">
          <Skeleton className="w-20 h-20" /> 
        </div>
      )}
    </div>
  );
};

export default Hero;

