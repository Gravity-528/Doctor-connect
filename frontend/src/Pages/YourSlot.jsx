// // import React, { useEffect,useState } from 'react'
// // import { useData } from '../Providers/DataProvider'
// // import YourSlotCard from '../component/YourSlotCard';
// // import Navbar from '../component/Navbar';
// // import Footer from '../component/Footer';
// // import axios from 'axios';

// // const YourSlot = () => {
    
// //     const [UserSlot,setUserSlot]=useState([]);
// //     const GetUserSlot=async()=>{
// //       try{
// //           const YourSlot=await axios.get('/api/v1/user/getSlot',{withCredentials:true});
// //           // console.log("YourSlot is",YourSlot)
// //           setUserSlot(YourSlot.data.data);
// //           }catch(err){
// //               console.error("error is here :",err);
// //           }

// //   }
// //   // console.log("userSlot is",UserSlot);
// //   useEffect(()=>{
// //     GetUserSlot();
// //   },[])
// //   //  console.log(UserSlot); 
// //   return (
// //     <div>
// //       <Navbar/>
// //       {UserSlot.map((val,index)=>{
// //         return(<YourSlotCard key={index} props={val}/>)
// //       })}
// //       <Footer/>
// //     </div>
// //   )
// // }

// // export default YourSlot
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useData } from "../Providers/DataProvider";
// import YourSlotCard from "../component/YourSlotCard";
// import Navbar from "../component/Navbar";
// import Footer from "../component/Footer";

// const YourSlot = () => {
//   const [UserSlot, setUserSlot] = useState([]);

//   const GetUserSlot = async () => {
//     try {
//       const YourSlot = await axios.get("/api/v1/user/getSlot", {
//         withCredentials: true,
//       });
//       setUserSlot(YourSlot.data.data);
//     } catch (err) {
//       console.error("Error fetching user slots:", err);
//     }
//   };

//   useEffect(() => {
//     GetUserSlot();
//   }, []);

//   return (
//     <div className="min-h-screen bg-black text-white">
//       <Navbar />
//       <div className="container mx-auto px-4 py-6 flex flex-wrap justify-center gap-6">
//         {UserSlot.length > 0 ? (
//           UserSlot.map((val, index) => (
//             <YourSlotCard key={index} props={val} />
//           ))
//         ) : (
//           <p className="text-center text-gray-400 text-lg">No slots booked yet.</p>
//         )}
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default YourSlot;
import React, { useEffect, useState } from "react";
import axios from "axios";
import YourSlotCard from "../component/YourSlotCard";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

const YourSlot = () => {
  const [UserSlot, setUserSlot] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  const GetUserSlot = async () => {
    try {
      const response = await axios.get("/api/v1/user/getSlot", {
        withCredentials: true,
      });
      setUserSlot(response.data.data);
    } catch (err) {
      console.error("Error fetching user slots:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetUserSlot();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-6 flex flex-wrap justify-center gap-6">
        {loading ? (
          // Skeleton Loader
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-800 animate-pulse w-80 h-40 rounded-lg shadow-lg p-4"
            >
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-10 bg-gray-700 rounded"></div>
            </div>
          ))
        ) : UserSlot.length > 0 ? (
          UserSlot.map((val, index) => (
            <YourSlotCard key={index} props={val} />
          ))
        ) : (
          <p className="text-center text-gray-400 text-lg">
            No slots booked yet.
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default YourSlot;
