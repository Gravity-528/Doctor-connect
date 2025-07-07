// import React from "react";
// import { Heart, Brain, Stethoscope, Syringe, Eye, Bone } from "lucide-react";
// import Navbar from "../component/Navbar";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
// import { Button } from "@/components/ui/button";
// import { motion } from "framer-motion";

// const analyticsData = [
//   { name: "Jan", consultations: 5 },
//   { name: "Feb", consultations: 8 },
//   { name: "Mar", consultations: 6 },
//   { name: "Apr", consultations: 10 },
// ];

// const specialties = [
//   { name: "Cardiology", icon: Heart },
//   { name: "Psychology", icon: Brain },
//   { name: "General Medicine", icon: Stethoscope },
//   { name: "Vaccination", icon: Syringe },
//   { name: "Ophthalmology", icon: Eye },
//   { name: "Orthopedics", icon: Bone },
// ];

// const UserAnalytics = () => {
//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-black text-white p-6">
//         <h1 className="text-3xl font-bold mb-8 text-center">User Analytics</h1>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           <motion.div
//             className="bg-black border border-white shadow-lg hover:shadow-xl transition-shadow"
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             <CardHeader>
//               <CardTitle className="text-xl text-center">Total Consultations</CardTitle>
//             </CardHeader>
//             <CardContent className="flex flex-col items-center">
//               <p className="text-4xl font-bold">30</p>
//             </CardContent>
//           </motion.div>

//           <motion.div
//             className="bg-black border border-white shadow-lg hover:shadow-xl transition-shadow"
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             <CardHeader>
//               <CardTitle className="text-xl text-center">Upcoming Appointments</CardTitle>
//             </CardHeader>
//             <CardContent className="flex flex-col items-center">
//               <p className="text-4xl font-bold">2</p>
//               <Button variant="outline" className="mt-4 border-white text-white hover:bg-white hover:text-black">
//                 View Details
//               </Button>
//             </CardContent>
//           </motion.div>

//           <motion.div
//             className="bg-black border border-white shadow-lg hover:shadow-xl transition-shadow"
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             <CardHeader>
//               <CardTitle className="text-xl text-center">Doctors Consulted</CardTitle>
//             </CardHeader>
//             <CardContent className="flex flex-col items-center">
//               <p className="text-4xl font-bold">5</p>
//               <Button variant="outline" className="mt-4 border-white text-white hover:bg-white hover:text-black">
//                 View History
//               </Button>
//             </CardContent>
//           </motion.div>
//         </div>

//         <div className="mt-12 p-6 bg-black border border-white rounded-lg shadow-lg">
//           <h2 className="text-2xl font-bold mb-6 text-center">Consultation Trends</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={analyticsData}>
//               <XAxis dataKey="name" stroke="#fff" />
//               <YAxis stroke="#fff" />
//               <Tooltip contentStyle={{ backgroundColor: "#333", borderRadius: "8px", color: "#fff" }} />
//               <Line type="monotone" dataKey="consultations" stroke="#fff" strokeWidth={3} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="mt-12 p-6 bg-black border border-white rounded-lg shadow-lg">
//           <h2 className="text-2xl font-bold mb-6 text-center">Specialty Consultations</h2>
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
//             {specialties.map((specialty, index) => (
//               <motion.div
//                 key={index}
//                 className="bg-black border border-white p-6 rounded-lg shadow-lg hover:shadow-xl"
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 <div className="flex flex-col items-center">
//                   <specialty.icon size={40} className="text-white mb-4" />
//                   <p className="text-xl font-bold">{specialty.name}</p>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default UserAnalytics;

import React from "react";
import Navbar from "../component/Navbar";
import { motion } from "framer-motion";

const UserAnalytics = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-6">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to User Dashboard
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-gray-300 text-center max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Stay connected with your consultations and appointments. Explore
your upcoming sessions and history at your convenience.
        </motion.p>
      </div>
    </>
  );
};

export default UserAnalytics;